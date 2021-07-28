import React, { Component } from 'react'
import { connect } from 'react-redux'
import { listCall, alertErroClose, statusErro, hideResultColumnCalls, saveParamsEvents, loadActionPending, statusLoading } from '../../actions'
import { cdProcesso } from '../../globals'
import { Navbar, Alert } from 'react-bootstrap'
import DateInput from '../../components/DateInput'
import SelectInput from '../../components/SelectInput'
import { listOptionEvent, listStatus, listFase, getDateDataBaseCall } from '../../APISchulze'
import { setCookie, getCookie, deleteCookie, formatPhone, hideCollumnsOfRow, hideCollumnsOfHeader, reduceRowsGrid, getDateById } from '../../utils'
import Grid from '../../components/Grid'
import Pager from '../Pager'
import Button from '../Button'

class Acionamento extends Component  {
    constructor(props){
        super(props)
        this.state = {
            erro: null,
            showErro: false,
            cdProcesso : null,
            listOf: [],
            listOfChecked: getCookie('listOfCheckedCall') !== '' ? getCookie('listOfCheckedCall') : 30,
            listStatus: [0],
            listStatusChecked: [0],
            listFase: [0],
            listFaseChecked: [0],
            listCallBackup: getCookie('listCallBackup') === 'true' ? true : false,
            dt_base_acionamento: '0',
            lb_data_base_acionamento: '0',
            checkHideResultColumn : false,
            buttonActive: true,
            clearFase: true,
            clearValueInput : false,
            reloadSearch : false,
            isDisabledInputListOf: false,
            isDisabledInputComplement: true,
            currentPage: null
        }
        this.handleDismissWarning = this.handleDismissWarning.bind(this)
        this.handleDismissErro = this.handleDismissErro.bind(this)
        this.handleClickPanel = this.handleClickPanel.bind(this)    
        this.handleHideResultColumn = this.handleHideResultColumn.bind(this)
        this.callbackListOf = this.callbackListOf.bind(this)
        this.callbackSetDateEnd = this.callbackSetDateEnd.bind(this)
        this.callbackSetDateBegin = this.callbackSetDateBegin.bind(this)
        this.callbackListFase = this.callbackListFase.bind(this)  
        this.Search = this.Search.bind(this)
        this.callbackListCallBackup = this.callbackListCallBackup.bind(this)
        this.Clear = this.Clear.bind(this)
        this.handleClickListOf = this.handleClickListOf.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.h = this.h.bind(this)
    }

    callbackSetDateBegin = ( value, stateClearValue ) => { 
        this.setState({ dataDe: value, clearValueInput : stateClearValue })
    }
    callbackSetDateEnd = ( value, stateClearValue ) => { 
        this.setState({ dataAte: value, clearValueInput : stateClearValue }) 
    }
    callbackCheckFase = ( fase, clearValueInputSelect ) => {         
        this.setState({ listFaseChecked: fase, clearValueInput : clearValueInputSelect, clearFase: false }) 
    }

    handleClickListOf = (listOf) => { 
        const checkBackupCall = getCookie('listCallBackup') === 'true' ? true : false
        setCookie('listOfCheckedCall', listOf.value)
        this.callbackListOf(listOf.value, null, null, checkBackupCall)
    }

    handleDismissWarning = () => ( this.props.alertErroClose() )
    handleDismissErro = () => { this.props.alertErroClose() }
    
    handleClickPanel = () => {
        if(document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility === 'visible'){
            document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility = 'hidden'
            document.getElementById("navCob").className = "DivCob-menu-collapse NavCob-collapse navbar-collapse collapse";
            document.getElementById("buttonExpandPanel").className = "ButtonCob-collapse Panel-closed-button fixed-top btn btn-light btn-sm"
            document.getElementById("divButtons").className = "HeaderCob-navbar Panel-closed-menu-buttons navbar navbar-expand navbar-light bg-light fixed-top"
            document.getElementById("gridOverlay").className = ""
        } else {
            document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility = 'visible'
            document.getElementById("navCob").className = "DivCob-menu-collapse NavCob-collapse navbar-collapse collapse show";
            document.getElementById("buttonExpandPanel").className = "ButtonCob-collapse Panel-opened-button fixed-top btn btn-light btn-sm"
            document.getElementById("divButtons").className = "HeaderCob-navbar Panel-opened-menu-buttons navbar navbar-expand navbar-light bg-light fixed-top"
            document.getElementById("gridOverlay").className = "loadingCob-overlay-grid"
        }
    }

    handleSearch = () => {
        this.Search({type : 'Consultar'})
        this.handleClickPanel()
    }

    UNSAFE_componentWillMount = () => {
        this.setState({cdProcesso: cdProcesso})
        listOptionEvent('acionamento').then(
          (result) => {
            if(result.error){
              this.setState({erro: result.message})
              throw Error(result.message)
            }        
            let list = []
            result.map((i) => ( list.push({value: i, label: ( typeof i === 'number' ? "Últimos " : "") + i + " registros"})))
            this.setState({listOf: list})
          }
        )
        .catch((error) => {
          this.props.statusErro('A aplicação está tendo problemas para exibir informações na tela.')
          this.setState({erro: error, showErro: true})
        })
    }

    componentDidMount = () => {
        this.handleClickPanel()
        setTimeout(()=>{
            listStatus('acionamento')
            .then( result => {
                if(result.error){
                    this.setState({erro: result.message})
                    throw Error(result.message)
                }
                var status = result.map((i) => ({value: i.statusCode, label: i.statusName})).sort(function(a, b) {
                    return +(a.label > b.label) || +(a.label === b.label) - 1
                })
                this.setState({listStatus: status})
            })
            .catch((error) => { this.setState({erro: error}) })

            getDateDataBaseCall()
            .then(result => {
                if(result.error){
                    this.setState({erro: result.message})
                    throw Error(result.message)
                }

                this.setState({
                    dt_base_acionamento: result.dt_base_acionamento,
                    lb_data_base_acionamento: result.lb_data_base_acionamento
                })

                this.callbackListCallBackup(1)
            })
            .catch((error) => { this.setState({erro: error}) })

        }, 2000)
    }

    callbackListOf = ( listOfChecked, offset = null, filterCall = null, listCallBackup = false, reloadSearch = false) => {

        const { listCall } = this.props
        const { erro } = this.props.application.erro

        const listFaseChecked = this.state.listFaseChecked

        const params = {
            index: listOfChecked, 
            cdProcesso: this.state.cdProcesso,
            dataDe: getDateById('d1'),
            dataAte: getDateById('d2'),
            listStatus: this.state.listStatusChecked.value, 
            listFase: listFaseChecked.map((fase) => (fase && fase.value ? fase.value : null)),
            filterCall: filterCall,
            listCallBackup: getCookie('listCallBackup') === 'true' ? true : false,
            offset: offset,
            limiter: this.props.acionamento.limiter,
            reloadSearch: reloadSearch
        }

        listCall(params)
        setCookie('listOfCheckedCall', listOfChecked)

        if(erro){
            this.setState({erro: 'A aplicação está tendo problemas para exibir informações na tela: ' + erro, showErro: true})
        }
    }

    Clear = () => {

        reduceRowsGrid('acio')
        deleteCookie('listCallBackup')
        deleteCookie('checkHideResultColumn')

        if(this.state.checkHideResultColumn){
            document.getElementById('hideResultColumn').click()
        }

        this.setState({ 
            checkHideResultColumn: false,
            dataDe: [], 
            clearValueInput : true, 
            dataAte: [],             
            listFase: [null],
            listFaseChecked: [null],
            listStatusChecked: [null],
            clearFase: true,
            buttonActive: true,
            reloadSearch: false,
            isDisabledInputComplement: true
        })
        
        setTimeout(()=>{
            this.Search({type : 'Reload'});
            this.h(null, 'Todos')},
        100)
    }

    callbackListFase = ( status, clearValueInputSelect ) => {         
        if(status === null || status.length === 0){
            this.setState({
                listFase: [null],
                listFaseChecked: [null],
                listStatusChecked: [null],
                clearFase: true,
                clearValueInput: clearValueInputSelect,
                isDisabledInputComplement: true
            })
        }else{
            listFase(status.value, 'acionamento')
            .then( (data) => {
                this.setState({
                    listFase: data.map((fase) => ({value: fase.faseCode, label: fase.faseName})),
                    listFaseChecked: [null],
                    listStatusChecked: status,
                    clearValueInput: clearValueInputSelect,
                    isDisabledInputComplement: false,
                    clearFase: true
                })
            })
            .catch((error) => { 'console.log'(error) })
        }
    }

    Search = (action) => {
        const param = { currentPage: 1 }        
        this.setState( action.type === 'Consultar' ? { ...param, buttonActive: false } : { ...param } )
        this.callbackListOf(getCookie('listOfCheckedCall') !== '' ? getCookie('listOfCheckedCall') : 30, null, action.type)
    }

    callbackListCallBackup = (value) => {
        if(value === 1){
            setCookie('listCallBackup', 'false')
        }else{
            setCookie('listCallBackup', 'true')
            setCookie('listOfCheckedCall', 'Todos os')
        }

        this.setState({
            isDisabledInputListOf: value === 1 ? false : true,
            listCallBackup: value === 1 ? false : true,
            listOfChecked: value === 2 ? 'Todos os' : getCookie('listOfCheckedCall') !== '' ? getCookie('listOfCheckedCall') : 30
        })

        setTimeout(()=>{
            const listOfChecked = getCookie('listOfCheckedCall') !== '' ? getCookie('listOfCheckedCall') : 30
            this.callbackListOf(listOfChecked)
        }, 100)
    }

    formatRegistries = (base, noResult = null) => {

        let Rows = []

        if(base && noResult === null){ 
            base.map((registry, index) => {

                var actionType = registry.actionType !== '' ? <><b>Tipo de ação </b><br />{registry.actionType}</> : <>&nbsp;</>    
                var phone = <><b>Telefone </b><br /> {formatPhone(registry.phone)}</>                
                var idCall = <><b>IDChamada </b><br /> {registry.idCall}</>                
                var branch = <><b>Ramal </b><br /> {registry.branch}</>                
                var called = <><b>Acionador </b><br /> {registry.called}</>
    
                Rows.push(
                    {
                        columns: [
                            {text: <b>{registry.eventDate}</b>, align: '', className: 'Column-Acionamento Column-Acionamento-Data'},
                            {text: <b>{registry.phone !== '0' && registry.phone !== '' ? formatPhone(registry.phone) : registry.email}</b>, align: '', className: 'Column-Acionamento Column-Acionamento-Telefone-Email'},
                            {text: <b>{registry.type.toUpperCase()} - {registry.result}</b>, align: '', className: 'Column-Acionamento Column-Acionamento-Resultado'} ,
                            {text: <b>{registry.complement}</b>, align: '', className: 'Column-Acionamento Column-Acionamento-Complemento'},
                            {text: <b>{registry.middle}</b>, align: '', className: 'ColumnTipo-Acionamento Column-Acionamento-Tipo'}
                        ],
                        subColumns: [
                            {text: '', align: '', style: { width: '12.5%', margin: '0 0 0 1.5px' }, className: ''},
                            {text: 
                                <>
                                    <div className="divToTable">
                                        <div className="divToTable-Row">
                                            <div className="divToTable-Cell Column-Acionamento-TipoAcao">{actionType}&nbsp;</div>
                                            <div className="divToTable-Cell Column-Acionamento-Telefone">{phone}&nbsp;</div>
                                            <div className="divToTable-Cell Colspan-99 divToTable-Cell-Description">{registry.description}</div>
                                        </div>
                                    </div>
                                    <div className="divToTable">
                                        <div className="divToTable-Row">
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed" style={{width: '21.5% !important'}} >{idCall}</div>
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed">{branch}&nbsp;</div>
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed">{called}&nbsp;</div>                                            
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed" style={{width: '90px!important'}}><b>Desligamento</b><br />{registry.tp_desligamento}&nbsp;</div>
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed"><b>After Call</b><br />{registry.nr_aftercall}&nbsp;</div>
                                            <div className="divToTable-Cell divToTable-Cell-Width-Fixed"><b>Falado</b><br />{registry.nr_conversado}&nbsp;</div>
                                            <div className="divToTable-CelldivToTable-Cell-Width-Fixed"><b>Duração</b><br />{registry.nr_duracao}&nbsp;</div>                                                
                                        </div>
                                    </div>
                                </>
                                , align: 'left', width: '', className: 'SubColum-Acionamento', colSpan: 5},
                        ],
                        eventHash: index
                    }
                )

                return 0
            })
        } else {
            Rows = { noResult : 'Nenhum registro encontrado' }
        }

        return Rows
    }

    h = (e = null, b = null) => {
        var btns = document.getElementsByClassName("buttonActive")
		for (var i = 0; i < btns.length; i++) {

            var current = document.getElementsByClassName("actived")
            for (var x = 0; x < current.length; x++) {
                current[x].className = current[x].className.replace(" actived", "")
            }
		}

        if(b){
            var f = document.getElementById(b)
            f.className += " actived"
        }
        else{
            e.target.className += " actived"
        }
    }

    handleHideResultColumn = () => { 
        this.setState({checkHideResultColumn: !this.state.checkHideResultColumn})
        //this.props.hideResultColumnCalls(this.state.checkHideResultColumn); 
    }

    render() {

        const { listOf, listStatus, listStatusChecked, listFase, listFaseChecked, clearFase, lb_data_base_acionamento, clearValueInput, isDisabledInputListOf, isDisabledInputComplement, checkHideResultColumn } = this.state
        const indexOption = getCookie('listOfCheckedCall') !== '' ? getCookie('listOfCheckedCall') : 30
        const listOfChecked = {value: indexOption, label: ( indexOption !== 'Todos os' ? "Últimos " : "") + indexOption + " registros"}
        const hideCollumnsOfHeaderByIndex = [2]
        const hideCollumnsOfRowByIndex = [2]
        const hideResultColumn = checkHideResultColumn ? true : false
        let Rows = []
        let Paginator = false
        let clsGrid = 'marginWithoutPaginator';

        let totalRegistries = this.props.acionamento.recordCount
        let Header = [
            {text: 'Data', align: 'center', style: { width: '1%', margin: '0 0 0 1.5px'}, className: ''},
            {text: 'Telefone/Email', align: '', style: { margin: '0 0 0 5px'}, className: ''},
            {text: 'Resultado', align: '', style: { margin: '0 0 0 5px'}, className: ''},
            {text: 'Complemento', align: '', style: { margin: '0 0 0 5px'}, className: ''},
            {text: 'Tipo', align: '', style: { margin: '0 0 0 5px'}, className: ''}
        ]

        if(this.props.acionamento.calls){
            Rows = this.formatRegistries(this.props.acionamento.calls)
        } else if(this.props.acionamento.noResult) {
            Rows = this.formatRegistries('', this.props.acionamento.noResult)
        }

        Rows = hideResultColumn ? hideCollumnsOfRow(Rows, hideCollumnsOfRowByIndex) : Rows

        Header = hideResultColumn ? hideCollumnsOfHeader(Header, hideCollumnsOfHeaderByIndex) : Header
        

        if((this.props.acionamento.recordCount > this.props.acionamento.limiter) && typeof this.props.acionamento.listOfChecked === 'string' && Rows.length > 0){
            Paginator = true
            clsGrid = 'marginWithPaginator'      
        }

        return (
            <>
                {this.props.application.alertShowErro ? (
                    <div className='DivCob-alert'>
                        <Alert variant='danger' onClose={this.handleDismissErro} dismissible >
                        <Alert.Heading className='TextCob-alert'>Atenção!</Alert.Heading>
                            <p className='TextCob-alert'>{this.props.application.erro}.<br />
                                Acesse novamente essa tela e caso o problema persista entre em contato com o setor de TI através de abertura de chamado no SE.
                            </p>
                            <Button id='btnAlertReload' className='ButtonCob-navbar-danger' name="btnAlertReload" textButton='Acionamento' onClick={ (event) => { event.preventDefault(); this.handleDismissErro(); this.callbackListCallBackup(30); } }/>
                        </Alert>
                    </div>
                ) : ('')}

                <Navbar.Collapse id='navCob' className='DivCob-menu-collapse NavCob-collapse' style={{ visibility: 'visible' }}>
                    <SelectInput 
                        id="selectInputListar"
                        placeholder="Listar"
                        listValue={listOf}
                        callbackHandleChange={(value) => this.handleClickListOf(value)}
                        isMulti={false}
                        listValueChecked={listOfChecked}
                        closeMenuOnSelect={true}
                        className='SelectCob-input'
                        isDisabled={isDisabledInputListOf}
                    />
                    <DateInput 
                        id="d1"
                        placeholder="Data de"
                        clearValueDate={clearValueInput} 
                    />

                    <DateInput 
                        id="d2"
                        placeholder="Data até"
                        clearValueDate={clearValueInput} 
                    />

                    <SelectInput 
                        id="selectInputResult"
                        placeholder="Selecione o Resultado"
                        listValue={listStatus}
                        listValueChecked={listStatusChecked}
                        defaultValue="Status"
                        callbackHandleChange={(value, clearValueInputSelect) => this.callbackListFase(value, clearValueInputSelect)}
                        isMulti={false}
                        maxMenuHeight={125}
                        closeMenuOnSelect={true}
                        className='SelectCob-input'
                        clearValueSelect={clearValueInput}
                        isDisabled={false}
                        isClearable={true}
                    />

                    <SelectInput 
                        id="selectInputComplement"
                        placeholder="Selecione a(s) Fase(s)"
                        listValue={listFase}
                        listValueChecked={listFaseChecked}
                        defaultValue="Fase"
                        callbackHandleChange={(value) => this.callbackCheckFase(value)}
                        isMulti={true}
                        clear={clearFase}
                        maxMenuHeight={81}
                        closeMenuOnSelect={false}
                        className='SelectCob-input'
                        clearValueSelect={clearValueInput}
                        isDisabled={isDisabledInputComplement}
                    />

                    <SelectInput 
                        id="listBasePeriod"
                        placeholder="Selecione o período da base"
                        listValue={[{label: 'Registros dos últimos 45 dias', value: 1}, {label: `Registros anteriores a 45 dias ${lb_data_base_acionamento}`, value: 2}]}
                        listValueChecked={!this.state.listCallBackup ? [{label: 'Registros dos últimos 45 dias', value: 1}] : [{label: `Registros anteriores a 45 dias ${lb_data_base_acionamento}`, value: 2}]}
                        defaultValue="Status"
                        callbackHandleChange={(option) => this.callbackListCallBackup(option.value)} 
                        isMulti={false}
                        maxMenuHeight={125}
                        closeMenuOnSelect={true}
                        className='SelectCob-input'
                        isDisabled={false}
                        isClearable={false}
                    />

                    <div className="Component-CheckboxCob-menu"> 

                        <input
                            id='hideResultColumn' type="checkbox" 
                            defaultChecked={this.state.checkHideResultColumn} 
                            onClick={this.handleHideResultColumn}
                        /> 

                        <label className="CheckboxCob-label" style={{ margin: '0 0 0 20px', position: 'absolute', left: '0px' }}>
                            Ocultar coluna resultado
                        </label>
                    </div>

                    <div id='divButton'>
                        <Button id='btnSearch' className={!this.state.buttonActive ? 'ButtonCob-panel-acionamento-primary buttonActive active' : 'ButtonCob-panel-acionamento-primary buttonActive'} onClick={(e) => {this.handleSearch(); this.h(e, 'Todos')}} name="Consultar" textButton='Consultar' />
                        <Button id='btnClean' className='ButtonCob-panel-acionamento-secondary' onClick={this.Clear} name="Limpar" textButton='Limpar Filtros' />      
                    </div>
                </Navbar.Collapse>

                <Button 
                    id='buttonExpandPanel'
                    onClick={this.handleClickPanel}
                    tagI={<><i className='ArrowCob-navcollapse'></i><i className='ArrowCob-navcollapse'></i></>}
                />

                <Navbar bg='light' fixed='top' id='divButtons' className='' style={{padding: '0px'}}> 
                    <Button textButton='Alô' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento-small buttonActive' onClick={(e) => {this.Search({type : 'Alo'}); this.h(e);}} name="Alo" id="Alo">Alô</Button> 
                    <Button textButton='CPC' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento-small buttonActive' onClick={(e) => {this.Search({type : 'CPC'}); this.h(e);}} name="CPC" id="CPC">CPC</Button> 
                    <Button textButton='Trabalhado' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' onClick={(e) => {this.Search({type : 'Trabalhado'}); this.h(e);}} name="Trabalhado" id="Trabalhado">Trabalhado</Button> 
                    <Button textButton='Agendamento' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' onClick={(e) => {this.Search({type : 'Agendamento'}); this.h(e);}} name="Agendamento" id="Agendamento">Agendamento</Button> 
                    <Button textButton='Recebimento SMS' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' onClick={(e) => {this.Search({type : 'RecebimentoSMS'}); this.h(e);}} name="RecebimentoSMS" id="RecebimentoSMS">RecebimentoSMS</Button> 
                    <Button textButton='Acordo Boleto' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' onClick={(e) => {this.Search({type : 'AcordoBoleto'}); this.h(e);}} name="AcordoBoleto" id="AcordoBoleto">Acordo Boleto</Button> 
                    <Button textButton='Promessa Pagamento' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento-promessa buttonActive' onClick={(e) => {this.Search({type : 'PromessaPagamento'}); this.h(e);}} name="PromessaPagamento" id="PromessaPagamento">Promessa Pagamento</Button> 
                    <Button textButton='Pesquisa' className='ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' onClick={(e) => {this.Search({type : 'Pesquisa'}); this.h(e);}} name="Pesquisa" id="Pesquisa">Pesquisa</Button>
                    <Button textButton='Todos' className={this.state.buttonActive ? 'ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive actived' : 'ButtonCob-navbar-primary ButtonCob-navbar-acionamento buttonActive' } onClick={(e) => {this.Search({type : 'Todos'}); this.h(e);}} name="Todos" id="Todos">Todos</Button> 
                </Navbar>

                {Paginator ? (
                    <Pager
                        totalRegistries={totalRegistries}
                        totalLimiter={this.props.acionamento.limiter}
                        groupLimiter={20}
                        listOfChecked={indexOption}
                        ressetPaginator={this.state.currentPage === 1 ? true : false}
                        callbackList={(listOfChecked, offset, callbackCurrentPage) => { reduceRowsGrid('acio'); this.setState({currentPage: callbackCurrentPage}); this.callbackListOf(listOfChecked, offset)}}
                    />
                ) : ('')}

                <div id='gridCalls' className={clsGrid}>
                    <div id='gridOverlay' onClick={this.handleClickPanel}></div>
                    <Grid 
                        headerGrid={Header} 
                        toggleAll={true}   
                        registries={Rows}
                        isToggleRow={true}
                        hasSubRow={true} 
                        isExpansible={true}
                        headerGridFixed={true}
                        totalRegistries={totalRegistries}
                        limiter={this.props.acionamento.limiter}
                        classNameNoneRegister='divCob-fontawesome-acionamento'
                        floatHeader={false}
                        prefixToToggleRow='acio'
                    />
                </div>
            </>
        )
    }
}

const mapStateToProps = (store) => ({
    application: store.application,
    loading: store.application.loading, 
    acionamento: store.acionamento,
    warning: store.application.warning,
    checkHideResultColumn : store.acionamento.checkHideResultColumn
})

const mapDispatchToProps = (dispatch) => {
    return {
        statusLoading: (params) => dispatch(statusLoading(params)),
        listCall: (params) => dispatch(listCall(params)),
        alertErroClose: () => dispatch(alertErroClose()),
        statusErro: (value) => dispatch(statusErro(value)), 
        hideResultColumnCalls : (value) => dispatch(hideResultColumnCalls(value)),
        saveParamsEvents: (params, route) => dispatch(saveParamsEvents(params, route)),
        loadActionPending: (action, route) => dispatch(loadActionPending(action, route)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Acionamento)