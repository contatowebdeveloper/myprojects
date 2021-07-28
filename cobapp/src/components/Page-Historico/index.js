import React, { Component } from 'react'
import { connect } from 'react-redux'
import { cdProcesso, glbUsuario, codigoAcesso, codeSeg3120, codeSeg3121, codeSeg3122, codeSeg3123, codeSeg3124 } from '../../globals'
import { listOptionEvent, listStatus, listFase } from '../../APISchulze'
import { showModal, selectCheckbox, listEvents, listEventsToReport, checkEvent, updateEvent, deleteEvent, statusErro, alertSuccessClose, alertErroClose, alertWarningClose, handleHideDuplicatesRowEvents, saveParamsEvents, loadActionPending, statusLoading, deleteCookies } from '../../actions'
import { formatDate, unSelectAll, hideDuplicatesRowsByColumns, hideCollumnsOfRow, hideCollumnsOfHeader, checkPermissionInEvent, reduceRowsGrid, getDateById, setCookie } from '../../utils'
import { Navbar, Alert } from 'react-bootstrap'
import SelectInput from '../SelectInput'
import DateInput from '../DateInput'
import Grid from '../Grid'
import FormDialog from '../Form'
import ModalGridViewer from '../ModalGridViewer'
import Pager from '../Pager'
import Button from '../Button'

class Historico extends Component {
  constructor(props){
		super(props)
    this.state = {
      erro: null,
      showErro: false,
      inputValue: '',
      loading: false,
      modalShowEdit: false,
      modalShowDelete: false,
      modalShowReport: false,
      modalTitle: '',
      modalLabel: '',
      buttonSubmitLabel: '',
      modalOperation: 'edit',
      showFooter: true,
      events: [0],
      eventDetail: '',
      eventReason: '',
      userCode: '',
      userName: '',
      cdSec: null,
      cdProcesso : null,
      eventHash: '', 
      offSet: null,     
      totalEvents: 0,
      listOf: [0],
      listOfChecked: 'Todos os',
      listStatus: [0],
      listStatusChecked: [0],
      listFase: [0],
      listFaseChecked: [0],
      clearFase: true,
      checkHideDuplicatesRowsByColumnsIndex : false,
      hideDuplicatesRowsByColumnsIndex: [null],
      disabled : true,
      clearValueInput: false,
      isDisabledInputFase: true
    }
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClickPanel = this.handleClickPanel.bind(this)    
    this.handleDismissWarning = this.handleDismissWarning.bind(this)
    this.handleDismissSuccess = this.handleDismissSuccess.bind(this)
    this.modalCloseEdit = this.modalCloseEdit.bind(this)
    this.modalCloseDelete = this.modalCloseDelete.bind(this)
    this.Search = this.Search.bind(this)
    this.Clear = this.Clear.bind(this)
    this.callbackListOf = this.callbackListOf.bind(this)
    this.callbackListFase = this.callbackListFase.bind(this)    
    this.callbackSetDateEnd = this.callbackSetDateEnd.bind(this)
    this.callbackSetDateBegin = this.callbackSetDateBegin.bind(this)
    this.callbackCheckEventHash = this.callbackCheckEventHash.bind(this)
    this.callbackGetEvent = this.callbackGetEvent.bind(this)
    this.callbackUpdateEvent = this.callbackUpdateEvent.bind(this)
    this.callbackDeleteEvent = this.callbackDeleteEvent.bind(this)
    this.handleHideDuplicatesRows = this.handleHideDuplicatesRows.bind(this) 
  }

  handleDismissErro = () => { this.props.alertErroClose() }
  handleDismissWarning = () => { this.props.alertWarningClose() }
  handleDismissSuccess = () => ( this.props.alertSuccessClose() )
  handleClose = () => (	this.setState({ modalShowEdit: false, multiline: '' }) )

  handleClickOpen = (event) => {
    let modalName = event.target.attributes.name.value
    switch(event.target.attributes.modalname.value){
      case 'modalShowEdit':
        if(!document.getElementById('btnUpdate').disabled){
          this.props.statusLoading(true)
          setTimeout(()=>{
            this.setState({ 
              modalShowEdit: !this.state.modalShowEdit, 
              modalTitle: modalName, 
              buttonSubmitLabel: modalName
            })
            this.props.statusLoading(false)
          }, 1)
        }
        break;
      case 'modalShowDelete':
        if(!document.getElementById('btnDelete').disabled){
          this.props.statusLoading(true)
          setTimeout(()=>{
            this.setState({ 
              modalShowDelete: !this.state.modalShowDelete, 
              modalTitle: modalName, 
              buttonSubmitLabel: modalName
            })
            this.props.statusLoading(false)
          }, 1)
        }
        break;
      case 'modalShowReport':
        if(!document.getElementById('btnReport').disabled){
          this.handleClickPanel()
          this.callbackListToReport()
          setTimeout(()=>{
            this.props.showModal('modalShowReport', true)
          }, 1)
        }
        break;
      default:
        break;
    }
  }

  handleClickPanel = () => {
    if(document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility === 'visible'){
      document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility = 'hidden'
      document.getElementById("navCob").className = "DivCob-menu-collapse NavCob-collapse navbar-collapse collapse"
      document.getElementById("buttonExpandPanel").className = "ButtonCob-collapse Panel-closed-button fixed-top btn btn-sm"
      document.getElementById("divButtons").className = "HeaderCob-navbar Panel-closed-menu-buttons navbar navbar-expand navbar-light bg-light fixed-top"
      document.getElementById("gridOverlay").className = ""
    } else {
      document.getElementsByClassName('DivCob-menu-collapse')[0].style.visibility = 'visible'
      document.getElementById("navCob").className = "DivCob-menu-collapse NavCob-collapse navbar-collapse collapse show"
      document.getElementById("buttonExpandPanel").className = "ButtonCob-collapse Panel-opened-button fixed-top btn btn-sm"
      document.getElementById("divButtons").className = "HeaderCob-navbar Panel-opened-menu-buttons navbar navbar-expand navbar-light bg-light fixed-top"
      document.getElementById("gridOverlay").className = "loadingCob-overlay-grid"
    }
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

  callbackDeleteEvent = (value) => ( this.props.deleteEvent(this.props.eventHash, value).then( () => {
    this.callbackCheckEventHash(document.getElementById(this.props.eventRowId).value)
    this.modalCloseDelete() 
  }))

  UNSAFE_componentWillMount = () => {
    listOptionEvent('historico').then(
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
      this.setState({erro: error, showErro: true})
    })
  }
  
  componentDidMount = () => { 

    unSelectAll()
    this.disableButtons()
    this.handleClickPanel()

    setTimeout(()=>{
      listStatus('historico')
      .then( result => {
        this.setState({loading: false}) 
        if(result.error){
          this.setState({erro: result.message})
          throw Error(result.message)
        }
        var status = result.map((i) => ({value: i.statusCode, label: i.statusName})).sort(function(a, b) {
          return +(a.label > b.label) || +(a.label === b.label) - 1
        }) 
     
        this.setState({listStatus: status})

        if(this.props.application.route === 'historico' && this.props.application.pendingAction !== ''){
          this.props.loadActionPending(this.props.application.pendingAction, this.props.application.route)
        }else{
          this.callbackListOf(this.state.listOfChecked)
        }
      })
      .catch((error) => { this.setState({erro: error}) })

      this.setState({cdProcesso: cdProcesso, cdUser: glbUsuario, cdSec: codigoAcesso })
    }, 2000)
  }

  callbackListOf = ( listOfChecked, offset = null, reloadSearch = null, currentPage = null ) => {
    const { listEvents, saveParamsEvents } = this.props
    const { erro } = this.props.application.erro 
    var dt1 = getDateById('d3'), dt2 = getDateById('d4')
    const listFaseChecked = this.state.listFaseChecked
    const params = {
      index: listOfChecked, 
      cdProcesso: this.state.cdProcesso, 
      dataDe: dt1, 
      dataAte: dt2, 
      listStatus: this.state.listStatusChecked, 
      listFase: listFaseChecked.map((fase) => (fase && fase.value ? fase.value : null)),
      offset: offset,
      limiter: this.props.historico.limiter,
      reloadSearch: reloadSearch
    }

    saveParamsEvents(params, 'historico')

    if(this.props.application.route === 'historico' && this.props.application.pendingAction !== ''){
      this.props.loadActionPending(this.props.application.pendingAction, params, 'historico')
    }else{
      listEvents(params)      
    }

    if(erro){
      this.setState({erro: 'A aplicação está tendo problemas para exibir informações na tela: ' + erro, showErro: true})
    }

    this.setState({listOfChecked: listOfChecked, currentPage: currentPage, offset: offset})
  }

  Search = () => { 
    this.callbackListOf(this.state.listOfChecked, null, false, this.state.currentPage)
    this.handleClickPanel()
  }

  handleHideDuplicatesRows = () => {
    setTimeout(()=>{
      this.props.handleHideDuplicatesRowEvents(this.props.checkHideDuplicatesRowsByColumnsIndex)
      this.callbackListOf(this.state.listOfChecked, this.state.offset, true, this.state.currentPage)
    }, 1)    
  }

  callbackListToReport = ( ) => {
    const { listEventsToReport } = this.props
    const { erro } = this.props.application.erro    
    const params = {
      index: this.state.listOfChecked, 
      cdProcesso: this.state.cdProcesso, 
      dataDe: null, 
      dataAte: null, 
      listStatus: null, 
      listFase: null,
      offset: null,
      limiter: 2000000000
    }

    listEventsToReport(params)

    if(erro){
      this.setState({erro: 'A aplicação está tendo problemas para exibir informações na tela: ' + erro, showErro: true})
    }
  }

  disableButtons = () => {
    document.getElementById('btnUpdate').setAttribute('disabled', 'disabled')
    document.getElementById('btnDelete').setAttribute('disabled', 'disabled')
  }

  Clear = () => {
    reduceRowsGrid('hist')
    this.disableButtons()
    document.getElementById('hideDuplicatesRows').checked = ""
    setCookie('checkHideDuplicatesRowsByColumnsIndex', true, 1)
    setTimeout(()=>{
      this.setState({ 
        dataDe: [], 
        dataAte: [], 
        listFase: [null],
        listFaseChecked: [null],
        listStatusChecked: [null],
        clearFase: true,
        clearValueInput : true, 
        currentPage: 1,
        isDisabledInputFase: true
      })
      this.props.handleHideDuplicatesRowEvents(true)
      this.callbackListOf(30, null, true, 1)
    }, 100)
  }

  callbackListFase = ( cdStatus, clearValueInputSelect ) => {     
    if(cdStatus === null || cdStatus.length === 0){
      this.setState({
        listFase: [0],
        listFaseChecked: [0],
        listStatusChecked: [0],
        clearFase: true,
        isDisabledInputFase: true
      })
    }else{
      listFase(cdStatus, 'historico')
      .then( (data) => {
        this.setState({
          listFase: data.map((fase) => ({value: fase.faseCode, label: fase.faseName})),          
          listStatusChecked: cdStatus.map((status) => (status)),
          loading: false,
          clearValueInput: clearValueInputSelect,
          isDisabledInputFase: false
        })
      })
      .catch((error) => {console.log(error)
      })
    }
  }

  callbackCheckEventHash = ( value ) => {
    const permisions = checkPermissionInEvent(value, codeSeg3120, codeSeg3121, codeSeg3122, codeSeg3123, codeSeg3124, glbUsuario)
    !permisions.update ? document.getElementById('btnUpdate').setAttribute('disabled', 'disabled') : document.getElementById('btnUpdate').removeAttribute('disabled')
    !permisions.delete ? document.getElementById('btnDelete').setAttribute('disabled', 'disabled') : document.getElementById('btnDelete').removeAttribute('disabled')    
    !permisions.update ? document.getElementById('btnUpdate').setAttribute('class', 'ButtonCob-navbar-primary disabled') : document.getElementById('btnUpdate').setAttribute('class', 'ButtonCob-navbar-primary')
    !permisions.delete ? document.getElementById('btnDelete').setAttribute('class', 'ButtonCob-navbar-danger disabled') : document.getElementById('btnDelete').setAttribute('class', 'ButtonCob-navbar-danger')
  }

  callbackGetEvent = () => {
    const { checkEvent } = this.props
    var eventHash = '', eventRowId = ''

    if(this.props.checkHideDuplicatesRowsByColumnsIndex === true){
      const navigateEventHash = document.querySelectorAll('input:checked')
      eventHash = navigateEventHash[1].value
      eventRowId = navigateEventHash[1].id
    } else {
      eventHash = document.querySelector('input:checked').value
      eventRowId = document.querySelector('input:checked').id
    }
    
    if(this.props.application.route === 'historico' && this.props.application.pendingAction !== ''){
      this.props.loadActionPending('checkEvent', eventHash, 'historico')
    }else{
      checkEvent(eventHash, eventRowId)
    }

  }

  callbackUpdateEvent = (value) => {
    const { updateEvent, eventId, eventCode, eventName, eventHash } = this.props
    const event = {
      eventId: eventId,
      eventCode: eventCode,
      eventName: eventName,
      eventHash: eventHash, 
      eventDetail: value
    }
    
    updateEvent(event)
  
  } 

  modalCloseEdit = () => {
    this.setState({ modalShowEdit: false })
    document.getElementById(this.props.eventRowId).checked = true
  }

  modalCloseDelete = () => {
    this.setState({ modalShowDelete: false })
    document.getElementById(this.props.eventRowId).checked = true        
  }

  toggleAll = () => {	
		let rows = this.props.prefixToToggleRow ? document.getElementsByClassName(this.props.prefixToToggleRow) : document.getElementsByClassName("Clickable")

		for (var i = 0; i < rows.length; i++) {
			let nfileds = rows[i].childNodes.length - 1 > -1 ? rows[i].childNodes.length - 1 : 0;
			rows[i].children[nfileds].children[0].textContent = this.state.toggleAll ? '+' : '-';
		}

		this.setState({toggleAll : !this.state.toggleAll})
	}

  formatRegistries = (base, noResult = null) => {

    const hideCollumnsOfRowByIndex = null
    const hideDuplicatesRowsByColumnsIndex = this.props.checkHideDuplicatesRowsByColumnsIndex ? [6] : null
    let Rows = []

    if(base && noResult === null){
    
      //Se marcado a opção de ocultar duplicados 
      let registries = hideDuplicatesRowsByColumnsIndex ? hideDuplicatesRowsByColumns(base, hideDuplicatesRowsByColumnsIndex) : base

      registries.map((registry, index) => {
        Rows.push(
          {
            columns : [
              {text: registry.eventDate, align: '', className: 'Column-historico-data Column-text-bold'},
              {text: registry.eventCode + '  - ' + registry.eventName, align: '', className: 'Column-historico-name Column-text-bold'},
              ],
            subColumns: [
              {text: '', align: '', width: '', className: '',  style: {width: '5%', minWidth: '107px', margin: '0 0 0 5px'}},
              {text: registry.eventDetail, align: 'right', width: '', className: 'formatText'},
              {
                text: 
                  <>
                    <div className={'Column-createdBy'}>
                      <b>Criado por:</b> {registry.userName + ' - FILIAL: ' + registry.userCompany} <br /> 
                      <b>Data/Hora:</b> {registry.timestamp ? formatDate(registry.timestamp, 'timestamp') : ''}
                    </div>
                    {registry.userNameUpdated !== '' ? 
                    <div className={'Column-createdBy'}>
                      <b>Alterado por:</b> {registry.userNameUpdated} <br /> 
                      <b>Data/Hora:</b> {registry.eventDateUpdated ? formatDate(registry.eventDateUpdated, 'timestamp') : ''}
                    </div> : '' }
                  </>														
                , align: 'right', width: '', className: 'Column-createdBy', colspan: 2},
              ],
            eventHash: registry.eventHash
          }
        )
        return Rows
      })

      Rows = hideCollumnsOfRowByIndex ? hideCollumnsOfRow(Rows, hideCollumnsOfRowByIndex) : Rows
    } else {
      Rows = { noResult : 'Nenhum registro encontrado' }
    }

    return Rows
  }
  
  render() { 
    const { eventDate, eventCode, eventName, eventDetail, userCode, userName, timestamp, eventReason, checkHideDuplicatesRowsByColumnsIndex } = this.props
    const { listStatus, listFase, listStatusChecked, listFaseChecked, clearFase, panelOpen, modalShowEdit, buttonSubmitLabel, modalShowDelete, modeReport, clearValueInput, isDisabledInputFase } = this.state
    const hideCollumnsOfHeaderByIndex = null, indexOption = this.state.listOfChecked, modalLabelEdit = { item: 'Fase', value : eventCode + ' - ' + eventName, className : 'faseCob-modal-edit LiCob-modal' }    
    const modalLabelDelete = [
      { 
        modalLabelDeleteObj1 : [
          { item: 'Ficha', value : cdProcesso, className : 'fichaCob-modal LiCob-modal' },
          { item: 'Data', value : eventDate, className : 'dataCob-modal LiCob-modal' },
          { item: 'Fase', value : eventCode + ' - ' + eventName, className : 'faseCob-modal LiCob-modal' }
        ]
      },
      { 
        modalLabelDeleteObj2 : [
          { item: 'Data criação', value : formatDate(timestamp, 'timestamp'), className : 'dataCriacao-modal LiCob-modal' },
          { item: 'Criado por', value : userCode + ' - ' + userName, className : 'criadorPor-modal LiCob-modal' }
        ]
      },
      { 
        modalLabelDeleteObj3 : { itemDescricao: 'Descrição', valueDescricao : eventDetail, className : 'textareaCob-Descricao LiCob-modal' }
      }
    ]

    let totalRegistries = this.props.historico.recordCount, Rows = [], RowsReport = [], Header = [      
      {text: 'Data', align: '', style: {width: '5%', minWidth: '105px', margin: '0 0 0 5px'}, className: ''},
      {text: 'Descrição', align: '', style: {width: '93%', margin: '0 0 0 5px'}, className: ''},
    ]

    if(this.props.historico.events){
      Rows = this.formatRegistries(this.props.historico.events, null)
    } else if(this.props.historico.noResult) {
      Rows = this.formatRegistries('', null)
    }
  
    if(this.props.historico.eventsReport){
      RowsReport = this.formatRegistries(this.props.historico.eventsReport, null)
    }
  
    Header = hideCollumnsOfHeaderByIndex ? hideCollumnsOfHeader(Header, hideCollumnsOfHeaderByIndex) : Header

    let Paginator = false

    let clsGrid = 'marginWithoutPaginator';

    if((this.props.historico.recordCount > this.props.historico.limiter) && typeof this.props.historico.listOfChecked === "string" && this.props.historico.events.length > 0){
      Paginator = true
      clsGrid = 'marginWithPaginator'      
    }

    var buttonDisabledUpdate = document.getElementById('btnUpdate') !== null ? document.getElementById('btnUpdate').disabled : ''
    var buttonDisabledDelete = document.getElementById('btnDelete') !== null ? document.getElementById('btnDelete').disabled : ''
    
    return (
      <>
        <Navbar.Collapse id='navCob' className='DivCob-menu-collapse NavCob-collapse' style={{ visibility: 'visible' }} >
          <DateInput 
            id="d3" 
            placeholder="Data de" 
            callbackHandleChange={(value, clearValueInputDate) => this.callbackSetDateBegin(value, clearValueInputDate)}             
            clearValueDate={clearValueInput} 
          />
          <DateInput 
            id="d4" 
            placeholder="Data até" 
            callbackHandleChange={(value, clearValueInputDate) => this.callbackSetDateEnd(value, clearValueInputDate)}             
            clearValueDate={clearValueInput} 
          />
          
          <SelectInput 
            id="selectInputStatus"
            placeholder="Selecione o(s) Status"
            listValue={listStatus}
            listValueChecked={listStatusChecked}
            defaultValue="Status"
            callbackHandleChange={(value, clearValueInputSelect) => this.callbackListFase(value, clearValueInputSelect)}
            isMulti={true}
            maxMenuHeight={240}
            closeMenuOnSelect={false}
            className='SelectCob-input'
            clearValueSelect={clearValueInput}
            isDisabled={false}
          />

          <SelectInput 
            id="selectInputFase"
            placeholder="Selecione a(s) Fase(s)"
            listValue={listFase}
            listValueChecked={listFaseChecked}
            defaultValue="Fase"
            callbackHandleChange={(value, clearValueInputSelect) => this.callbackCheckFase(value, clearValueInputSelect)}
            isMulti={true}
            clear={clearFase}
            maxMenuHeight={240}
            closeMenuOnSelect={false}
            className='SelectCob-input'
            clearValueSelect={clearValueInput}
            isDisabled={isDisabledInputFase}
          />

          <div className="Component-CheckboxCob-menu">
              <input 
                id='hideDuplicatesRows' 
                type="checkbox" 
                defaultChecked={checkHideDuplicatesRowsByColumnsIndex} 
                onChange={this.handleHideDuplicatesRows} 
              />
              <label className="CheckboxCob-label" style={{ margin: '0 0 0 20px', position: 'absolute', left: '0px' }}>
                Ocultar repetidos
              </label>
          </div>

          <div className="ButtonCob-navbar-events-align-left">
            <Button 
              id='btnReport' 
              className='ButtonCob-navbar-events-primary ButtonCob-navbar-historico-todos-registros' 
              variant="primary" size="sm" 
              onClick={this.handleClickOpen} 
              name="Relatorio" 
              modalname="modalShowReport"
              textButton='Todos os Registros' 
            />
          </div>
          
          <Button id='btnSearch' className='ButtonCob-navbar-events-primary' onClick={this.Search} textButton='Consultar' />
          <Button id='btnClean' className='ButtonCob-navbar-events-secondary' onClick={this.Clear} textButton='Limpar Filtros' />
        </Navbar.Collapse>

        <Button 
          id='buttonExpandPanel'
          onClick={this.handleClickPanel}
          tagI={<><i className='ArrowCob-navcollapse'></i><i className='ArrowCob-navcollapse'></i></>}
        />

        <Navbar bg='light' fixed='top' id='divButtons'>
          <Button id='btnUpdate' className={buttonDisabledUpdate ? 'ButtonCob-navbar-primary disabled' : 'ButtonCob-navbar-primary'} onClick={this.handleClickOpen} name="Editar" modalname="modalShowEdit" textButton='Editar' />
          <Button id='btnDelete' className={buttonDisabledDelete ? 'ButtonCob-navbar-danger disabled' : 'ButtonCob-navbar-danger'} onClick={this.handleClickOpen} name="Excluir" modalname="modalShowDelete" textButton='Excluir' />     
        </Navbar>

        {this.props.application.alertShowErro && (
          <div className='DivCob-alert'>
            <Alert variant='danger' onClose={this.handleDismissErro} dismissible >
              <Alert.Heading className='TextCob-alert'>Atenção!</Alert.Heading>
              <p className='TextCob-alert'>{this.props.application.erro}.<br />
                Acesse novamente essa tela e caso o problema persista entre em contato com o setor de TI através de abertura de chamado no SE.
              </p>
              <Button id='btnAlertReload' className='ButtonCob-navbar-danger' name="btnAlertReload" textButton='OK Acionamento' 
                onClick={ (event) => { event.preventDefault(); this.handleDismissErro(); this.Search(); } }
              />
            </Alert>
          </div>
        )}

        {this.props.application.alertShowSuccess && (
          <div className='DivCob-alert'>
            <Alert className='AlertCob-success' variant='success' onClose={this.handleDismissSuccess} dismissible >
              <Alert.Heading className='TextCob-alertHeader-Success'>Atenção! </Alert.Heading>
              <p className='TextCob-alert-Success'>{this.props.warning}</p>
            </Alert>
          </div>
        )}

        <FormDialog
          modalShow={modalShowEdit} 
          onEnter={this.callbackGetEvent}
          onHide={this.modalCloseEdit} 
          modalTitle='Alterar histórico'
          modalLabelEdit={modalLabelEdit}
          label='Descrição'
          enforceFocus={true}
          id='modalEdit'
          screen="historicoEventDetail"
          value={eventDetail}
          maxLengthValue="500"
          buttonSubmitLabel={buttonSubmitLabel}
          callbackClickSubmit={this.callbackUpdateEvent}
          warningConfirm={true}
          warningConfirmText="Você realmente deseja alterar esse histórico?"
          variant="primary"
          typeModal='edit'
          required={true}
          className="ModalCobEdit-form"
          title="ModalCob-title-edit"
          textExclusion='Informe a descrição do histórico'
          classNameButton="primary"
        />

        <FormDialog 
          modalShow={modalShowDelete} 
          onEnter={this.callbackGetEvent}
          onHide={this.modalCloseDelete} 
          enforceFocus={true}
          modalTitle='Excluir histórico'
          label='Informe o motivo da exclusão'
          modalLabelDelete={modalLabelDelete}
          screen="historicoEventDetail"
          value={eventReason}
          maxLengthValue="150"
          buttonSubmitLabel={buttonSubmitLabel}
          callbackClickSubmit={this.callbackDeleteEvent}
          warningConfirm={true}
          warningConfirmText="Você realmente deseja excluir esse histórico?"
          id='modalDelete'
          typeModal='delete'
          required={true}
          className="ModalCobDelete-form"
          title="ModalCob-title-delete"
          textExclusion='Informe o motivo da exclusão'
          classNameButton="primary"
        />

        <ModalGridViewer 
          title="Todos os registros"
          showModal={modeReport} 
          Header={Header}
          Rows={RowsReport}
          className='ModalCob-title-all-registers'
          modeReport={true}                
        />

        {Paginator ? (
          <Pager
            totalRegistries={totalRegistries}
            totalLimiter={this.props.historico.limiter}
            groupLimiter={20}
            listOfChecked={indexOption}
            callbackList={(listOfChecked, offset, reloadSearch, currentPage) => { reduceRowsGrid('hist'); this.disableButtons(); this.callbackListOf(listOfChecked, offset, null, currentPage)}}
          />
        ) : ('')}
  
        <div id='gridEvents' className={clsGrid}>
          <div id='gridOverlay' onClick={this.handleClickPanel}></div>
            <Grid
              headerGrid={Header}
              callbackEventChecked={(value) => this.callbackCheckEventHash(value)}
              isMultiSelect={false}
              registries={Rows}
              isCheckable={true}
              toggleAll={true}
              isToggleRow={true}
              hasSubRow={true}
              isExpansible={true}
              panelOpen={panelOpen}
              totalRegistries={totalRegistries}
              limiter={this.props.historico.limiter}
              classNameNoneRegister='divCob-fontawesome'
              floatHeader={false}
              prefixToToggleRow='hist'
            />
        </div>
      </>
    )
  }
}

const mapStateToProps = (store, ownProps) => ({ 
  application:    store.application,  
  loading:        store.application.loading,  
  eventHash:      store.historico.eventHash, 
  eventRowId:      store.historico.eventRowId, 
  eventId:        store.historico.eventId,
  eventCode:      store.historico.eventCode,
  eventName:      store.historico.eventName, 
  eventDetail:    store.historico.eventDetail, 
  eventDate:      store.historico.eventDate, 
  timestamp:      store.historico.timestamp, 
  eventReason:    store.historico.eventReason, 
  userCode:       store.historico.userCode, 
  userName:       store.historico.userName, 
  userCompany:    store.historico.userCompany, 
  modalShowEdit:  store.application.modalShowEdit,
  modalTitle:     store.application.modalTitle,
  modalShow:      store.application.modeReport, 
  modalLabel:     store.application.modalLabel,
  warning:        store.application.warning,  
  historico:      store.historico,
  totalEvents:    store.historico.totalEvents,
  checkHideDuplicatesRowsByColumnsIndex: store.historico.checkHideDuplicatesRowsByColumnsIndex
})

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (element, modalShow) => dispatch(showModal(element,modalShow)),
    selectCheckbox: (value) => dispatch(selectCheckbox(value)),
    listEvents: (params) => dispatch(listEvents(params)),
    listEventsToReport: (params) => dispatch(listEventsToReport(params)),
    updateEvent: (eventHash) => dispatch(updateEvent(eventHash)),
    deleteEvent: (eventHash, eventReason) => dispatch(deleteEvent(eventHash, eventReason)),
    checkEvent: (eventHash, eventRowId) => dispatch(checkEvent(eventHash, eventRowId)),
    statusErro: (value) => dispatch(statusErro(value)), 
    statusLoading: (value) => dispatch(statusLoading(value)), 
    alertSuccessClose: () => dispatch(alertSuccessClose()),
    alertErroClose: () => dispatch(alertErroClose()),
    alertWarningClose: () => dispatch(alertWarningClose()),
    handleHideDuplicatesRowEvents: (value) => dispatch(handleHideDuplicatesRowEvents(value)),
    saveParamsEvents: (params, route) => dispatch(saveParamsEvents(params, route)),
    loadActionPending: (action, route) => dispatch(loadActionPending(action, route)),
    deleteCookies: () => dispatch(deleteCookies())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Historico)
