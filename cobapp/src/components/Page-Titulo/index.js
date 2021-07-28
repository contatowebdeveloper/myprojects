import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Tab, Tabs, Alert } from 'react-bootstrap'
import { getContract, saveParamsEvents, loadActionPending } from '../../actions'
import { RowData } from './rowData'
import { RowInfo } from './rowInfo'
import { RowOther } from './rowOther'
import { numberToReal, formatDate } from '../../utils/index'
import { cdProcesso, codigoAuxClienteHTML } from '../../globals'
import { GoInfo } from 'react-icons/go';

class Titulo extends Component  {
    constructor(props){
        super(props)
        this.state = {
            cdProcesso: cdProcesso,
            getContractInfo: '',
            notice: '',
            marking: '',
            cityHoliday: '',
            getContractInfo2: '',
            recovery: '',
            bancoBV: '',
            bancoPAN: '',
            bancoPANVeiculo: '',
            logBatimentoPAN: '',
            dadosSantander: '',
            dadosBradesco: '',
            dadosParcela: '',
            dadosGarantia: '',
            dadosDespesa: '',
            dadosSomaDespesa: '',
            dadosDespesaVencer: '',
            AGENCIACONTABRADESCO: '',
            AVALISTA: '',
            CDGRUPOCLI: '',
            CDGRUPODEV: '',
            CLIENTE: '',
            COBRADOR1: '',
            COBRADOR2: '',
            COBRADOR3: '',
            CPFCNPJAVALISTA: '',
            CPFCNPJDEVEDOR: '',
            CTUBB: '',
            DEVEDOR: '',
            EACAOCONTRA: '',
            ENDERECODEVEDOR: '',
            ENDERECODEVEDORMASCARA: '',
            GRUPOCLIENTENOME: '',
            MARCACAO: '',
            STATE: '',
            cd_alerta: '',
            cd_avalista: '',
            cd_causa_abn: '',
            cd_cliente: '',
            cd_cobrador: '',
            cd_cobrador2: '',
            cd_cobrador_auxiliar: '',
            cd_devedor: '',
            cd_rating_pan: '',
            cd_regiao_abn: '',
            de_bvdoc: '',
            de_bvmais: '',
            de_dados_sicoob: '',
            de_loja: '',
            de_obs_loja: '',
            de_observacao: '',
            dt_cadastro: '',
            dt_judicial: '',
            fl_calculo_geral: '',
            fl_cedidos_bv: '',
            fl_revisional: '',
            nr_codigo_cliente: '',
            ENDERECOCLIENTE: '',
            CPFCNPJCLIENTE: '',
            NOMEDEVEDORMASCARA: '',
            NOMECLIENTEMASCARA: ''
        }

        this.getInfoContract = this.getInfoContract.bind(this)
    }

    getInfoContract = () => {
        const { getContract, saveParamsEvents, loadActionPending } = this.props
        const params = {
            cdProcesso: cdProcesso,
            nMostarEnderecoCliente: codigoAuxClienteHTML
        }

        saveParamsEvents(params, 'titulo')

        if(this.props.application.route === 'titulo' && this.props.application.pendingAction === 'getContract'){
            loadActionPending(this.props.application.pendingAction, params, 'titulo')                        
        }else{      
            getContract(params)
            .then(() => {
                const { getContractInfo, notice, marking, cityHoliday, getContractInfo2, recovery, bancoBV, bancoPAN, bancoPANVeiculo, logBatimentoPAN, dadosSantander, dadosBradesco, dadosParcela, dadosGarantia, dadosDespesa, dadosSomaDespesa, dadosDespesaVencer, AGENCIACONTABRADESCO , AVALISTA, CDGRUPOCLI, CDGRUPODEV, CLIENTE, COBRADOR1, COBRADOR2, COBRADOR3, CPFCNPJAVALISTA, CPFCNPJDEVEDOR, CTUBB, DEVEDOR, EACAOCONTRA, ENDERECODEVEDOR, ENDERECODEVEDORMASCARA, GRUPOCLIENTENOME, MARCACAO, STATE, cd_alerta, cd_avalista, cd_causa_abn, cd_cliente, cd_cobrador, cd_cobrador2, cd_cobrador_auxiliar, cd_devedor, cd_rating_pan, cd_regiao_abn, de_bvdoc, de_bvmais, de_dados_sicoob, de_loja, de_obs_loja, de_observacao, dt_cadastro, dt_judicial, fl_calculo_geral, fl_cedidos_bv, fl_revisional, nr_codigo_cliente, ENDERECOCLIENTE, CPFCNPJCLIENTE, NOMECLIENTEMASCARA, NOMEDEVEDORMASCARA, CPFCNPJDEVEDORMASCARA } = this.props.titulo
                this.setState({
                    DEVEDOR: DEVEDOR,
                    CPFCNPJDEVEDOR: CPFCNPJDEVEDOR,
                    NOMEDEVEDORMASCARA: NOMEDEVEDORMASCARA,
                    NOMECLIENTEMASCARA: NOMECLIENTEMASCARA,
                    CPFCNPJDEVEDORMASCARA: CPFCNPJDEVEDORMASCARA,
                    getContractInfo: getContractInfo,
                    notice: notice,
                    marking: marking,
                    cityHoliday: cityHoliday,
                    getContractInfo2: getContractInfo2,
                    recovery: recovery,
                    bancoBV: bancoBV,
                    bancoPAN: bancoPAN,
                    bancoPANVeiculo: bancoPANVeiculo,
                    logBatimentoPAN: logBatimentoPAN,
                    dadosSantander: dadosSantander,
                    dadosBradesco: dadosBradesco,
                    dadosParcela: dadosParcela,
                    dadosGarantia: dadosGarantia,
                    dadosDespesa: dadosDespesa,
                    dadosSomaDespesa: dadosSomaDespesa,
                    dadosDespesaVencer: dadosDespesaVencer,
                    AGENCIACONTABRADESCO: AGENCIACONTABRADESCO,
                    AVALISTA: AVALISTA,
                    CDGRUPOCLI: CDGRUPOCLI,
                    CDGRUPODEV: CDGRUPODEV,
                    CLIENTE: CLIENTE,                    
                    COBRADOR1: COBRADOR1,
                    COBRADOR2: COBRADOR2,
                    COBRADOR3: COBRADOR3,
                    CPFCNPJAVALISTA: CPFCNPJAVALISTA,                    
                    CTUBB: CTUBB,                    
                    EACAOCONTRA: EACAOCONTRA,
                    ENDERECODEVEDOR: ENDERECODEVEDOR,
                    ENDERECODEVEDORMASCARA: ENDERECODEVEDORMASCARA,
                    GRUPOCLIENTENOME: GRUPOCLIENTENOME,
                    MARCACAO: MARCACAO,
                    STATE: STATE,
                    cd_alerta: cd_alerta,
                    cd_avalista: cd_avalista,
                    cd_causa_abn: cd_causa_abn,
                    cd_cliente: cd_cliente,
                    cd_cobrador: cd_cobrador,
                    cd_cobrador2: cd_cobrador2,
                    cd_cobrador_auxiliar: cd_cobrador_auxiliar,
                    cd_devedor: cd_devedor,
                    cd_rating_pan: cd_rating_pan,
                    cd_regiao_abn: cd_regiao_abn,
                    de_bvdoc: de_bvdoc,
                    de_bvmais: de_bvmais,
                    de_dados_sicoob: de_dados_sicoob,
                    de_loja: de_loja,
                    de_obs_loja: de_obs_loja,
                    de_observacao: de_observacao,
                    dt_cadastro: dt_cadastro,
                    dt_judicial: dt_judicial,
                    fl_calculo_geral: fl_calculo_geral,
                    fl_cedidos_bv: fl_cedidos_bv,
                    fl_revisional: fl_revisional,
                    nr_codigo_cliente: nr_codigo_cliente,
                    ENDERECOCLIENTE: ENDERECOCLIENTE,
                    CPFCNPJCLIENTE: CPFCNPJCLIENTE
                })
            })
            .catch((error) => { this.setState({erro: error}) })
        }      
    }

    componentDidMount = () => {
        this.getInfoContract()
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        const { getContractInfo, getContractInfo2, notice, marking, cityHoliday, recovery, bancoBV, bancoPAN, bancoPANVeiculo, logBatimentoPAN, dadosSantander, dadosBradesco, dadosParcela, dadosGarantia, dadosDespesa, dadosSomaDespesa, dadosDespesaVencer, AGENCIACONTABRADESCO , AVALISTA, CDGRUPOCLI, CDGRUPODEV, CLIENTE, COBRADOR1, COBRADOR2, COBRADOR3, CPFCNPJAVALISTA, CPFCNPJDEVEDOR, CTUBB, DEVEDOR, EACAOCONTRA, ENDERECODEVEDOR, ENDERECODEVEDORMASCARA, GRUPOCLIENTENOME, MARCACAO, STATE, cd_alerta, cd_avalista, cd_causa_abn, cd_cliente, cd_cobrador, cd_cobrador2, cd_cobrador_auxiliar, cd_devedor, cd_rating_pan, cd_regiao_abn, de_bvdoc, de_bvmais, de_dados_sicoob, de_loja, de_obs_loja, de_observacao, dt_cadastro, dt_judicial, fl_calculo_geral, fl_cedidos_bv, fl_revisional, nr_codigo_cliente, ENDERECOCLIENTE, CPFCNPJCLIENTE, NOMECLIENTEMASCARA, NOMEDEVEDORMASCARA, CPFCNPJDEVEDORMASCARA, BloqueioDiscagemTemporario } = nextProps.titulo

        this.setState({
            DEVEDOR: DEVEDOR,
            CPFCNPJDEVEDOR: CPFCNPJDEVEDOR,
            NOMECLIENTEMASCARA: NOMECLIENTEMASCARA,
            NOMEDEVEDORMASCARA: NOMEDEVEDORMASCARA,
            CPFCNPJDEVEDORMASCARA: CPFCNPJDEVEDORMASCARA,
            getContractInfo: getContractInfo,
            getContractInfo2: getContractInfo2,
            notice: notice,
            marking: marking,
            cityHoliday: cityHoliday,            
            recovery: recovery,
            bancoBV: bancoBV,
            bancoPAN: bancoPAN,
            bancoPANVeiculo: bancoPANVeiculo,
            logBatimentoPAN: logBatimentoPAN,
            dadosSantander: dadosSantander,
            dadosBradesco: dadosBradesco,
            dadosParcela: dadosParcela,
            dadosGarantia: dadosGarantia,
            dadosDespesa: dadosDespesa,
            dadosSomaDespesa: dadosSomaDespesa,
            dadosDespesaVencer: dadosDespesaVencer,
            AGENCIACONTABRADESCO: AGENCIACONTABRADESCO,
            AVALISTA: AVALISTA,
            CDGRUPOCLI: CDGRUPOCLI,
            CDGRUPODEV: CDGRUPODEV,
            CLIENTE: CLIENTE,
            COBRADOR1: COBRADOR1,
            COBRADOR2: COBRADOR2,
            COBRADOR3: COBRADOR3,
            CPFCNPJAVALISTA: CPFCNPJAVALISTA,            
            CTUBB: CTUBB,            
            EACAOCONTRA: EACAOCONTRA,
            ENDERECODEVEDOR: ENDERECODEVEDOR,
            ENDERECODEVEDORMASCARA: ENDERECODEVEDORMASCARA,
            GRUPOCLIENTENOME: GRUPOCLIENTENOME,
            MARCACAO: MARCACAO,
            STATE: STATE,
            cd_alerta: cd_alerta,
            cd_avalista: cd_avalista,
            cd_causa_abn: cd_causa_abn,
            cd_cliente: cd_cliente,
            cd_cobrador: cd_cobrador,
            cd_cobrador2: cd_cobrador2,
            cd_cobrador_auxiliar: cd_cobrador_auxiliar,
            cd_devedor: cd_devedor,
            cd_rating_pan: cd_rating_pan,
            cd_regiao_abn: cd_regiao_abn,
            de_bvdoc: de_bvdoc,
            de_bvmais: de_bvmais,
            de_dados_sicoob: de_dados_sicoob,
            de_loja: de_loja,
            de_obs_loja: de_obs_loja,
            de_observacao: de_observacao,
            dt_cadastro: dt_cadastro,
            dt_judicial: dt_judicial,
            fl_calculo_geral: fl_calculo_geral,
            fl_cedidos_bv: fl_cedidos_bv,
            fl_revisional: fl_revisional,
            nr_codigo_cliente: nr_codigo_cliente,
            ENDERECOCLIENTE: ENDERECOCLIENTE,
            CPFCNPJCLIENTE: CPFCNPJCLIENTE,
            BloqueioDiscagemTemporario: BloqueioDiscagemTemporario
        })
    }

    render() {
        const { getContractInfo, getContractInfo2, cdProcesso, cityHoliday, notice, marking, recovery, bancoBV, bancoPAN, bancoPANVeiculo, logBatimentoPAN, dadosSantander, dadosBradesco, dadosParcela, dadosGarantia, dadosDespesa, dadosSomaDespesa, dadosDespesaVencer, AGENCIACONTABRADESCO, AVALISTA, CDGRUPOCLI, CDGRUPODEV, CLIENTE, COBRADOR1, COBRADOR2, COBRADOR3, CPFCNPJAVALISTA, CPFCNPJDEVEDOR, /*CTUBB,*/ DEVEDOR,/*EACAOCONTRA,*/ ENDERECODEVEDOR, ENDERECODEVEDORMASCARA, GRUPOCLIENTENOME, MARCACAO, STATE, /*cd_alerta,*/ cd_avalista, cd_causa_abn, cd_cliente, cd_cobrador, cd_cobrador2, cd_cobrador_auxiliar, cd_devedor, /*cd_rating_pan,*/cd_regiao_abn, de_bvdoc, de_bvmais,/*de_dados_sicoob,*/de_loja, de_obs_loja, de_observacao, /*dt_cadastro, dt_judicial, fl_calculo_geral, fl_cedidos_bv, fl_revisional,*/ nr_codigo_cliente, ENDERECOCLIENTE, CPFCNPJCLIENTE, NOMECLIENTEMASCARA, NOMEDEVEDORMASCARA, CPFCNPJDEVEDORMASCARA, EACAOCONTRA, BloqueioDiscagemTemporario } = this.state

        if(dadosParcela){
            //função pra separar o array de objetos das parcelas em aberto retornados do back end em 3 partes, para assim montar a tabela corretamente
            const separar = (itens, maximo) => {
                return itens.reduce((acumulador, item, indice) => {
                    const grupo = Math.floor(indice / maximo);
                    acumulador[grupo] = [...(acumulador[grupo] || []), item];
                    return acumulador;
                }, [])
            }
            
            const itens = dadosParcela;
            const itensFormatados = separar(itens, dadosParcela.length / 3 !== 0 ? dadosParcela.length / 3 : dadosParcela.length / 3); //chama a função e passa como parametro os itens(array de objetos) e a quantidade total de parcelas divido por 3 pra separar o array
            var tableParcela1 = itensFormatados[0] 
            var tableParcela2 = itensFormatados[1]
            var tableParcela3 = itensFormatados[2]
        }
        
        var auxDadosHtml = ''
        if(de_obs_loja !== ''){
            auxDadosHtml = de_obs_loja
        } else if (de_observacao !== '') {
            auxDadosHtml = de_observacao
        }
        
        if(getContractInfo === '' || getContractInfo2 === '') {
            return(
                <p></p>
            )
        } else {
            return (
                <>
                    {this.props.application.alertShowErro && (
                        <div className='DivCob-alert'>
                            <Alert variant='danger' >
                                <Alert.Heading className='TextCob-alert'>Atenção!</Alert.Heading>
                                <p className='TextCob-alert'>{this.props.application.erro}.<br />
                                Acesse novamente essa tela e caso o problema persista entre em contato com o setor de TI através de abertura de chamado no SE.</p>
                            </Alert>
                        </div>
                    )}
                    {cityHoliday ?  //verifica se é feriado na cidade do contrato ou se é feriado nacional e exibe aviso
                        cityHoliday.Feriado === '1' ?
                        <>
                            <p align='center'><b><font className='letravermelha'>Atenção!!!</font></b></p>
                            <p align='center'><b><font className='letravermelha'>Hoje é feriado na cidade do contrato. Em virtude da Lei 15.426/SP não é permitido acionar este contrato nesta data.</font></b></p>
                        </>
                        : cityHoliday.Feriado === '2' ? 
                        <>
                            <p align='center'><b><font className='letravermelha'>Atenção!!!</font></b></p>
                            <p align='center'><b><font className='letravermelha'>Hoje é feriado nacional. Em virtude da Lei 15.426/SP não é permitido acionar contratos do estado de São Paulo.</font></b></p>    
                        </>
                        : ''
                    : <></> } 
                    <Tabs defaultActiveKey='contrato' className='headerCob-tab'>
                        <Tab eventKey='contrato' title={<span className='text-contrato'>Contrato</span>} className='tab-content-contrato'>
                            {notice ? //verifica se a ficha possui avisos/notícias
                                <Table className='GridCob-Titulo-aviso' size="sm" responsive>
                                    <thead>
                                        <tr className="TableCob-header-titulo">
                                            <th colSpan="4" className='thead-none-border-top'><span className='alignTextHeader-titulo-aviso'>Avisos</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notice.map((index) => {
                                            return(
                                                <React.Fragment key={index}> 
                                                    <tr>
                                                        <td>
                                                            {index.Aviso}<br />
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody> 
                                </Table>
                            : <></>} 
        
                            <Table className='GridCob-Titulo' size="sm" responsive striped>
                                <thead>
                                    <tr className="TableCob-header-titulo"> 
                                        {notice ? <th colSpan="5" className='thead-none-border-top'><span className='alignTextHeader-titulo'>Dados do contrato</span></th> : <th colSpan="5" className='thead-none-border-top'><span className='alignTextHeader-titulo'>Dados do contrato</span></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    <RowData
                                        cdProcesso={cdProcesso}
                                        DEVEDOR={DEVEDOR}
                                        CPFCNPJDEVEDOR={CPFCNPJDEVEDOR}
                                        NOMECLIENTEMASCARA={NOMECLIENTEMASCARA}
                                        NOMEDEVEDORMASCARA={NOMEDEVEDORMASCARA}
                                        CPFCNPJDEVEDORMASCARA={CPFCNPJDEVEDORMASCARA}
                                        getContractInfo={getContractInfo}
                                        getContractInfo2={getContractInfo2}
                                        ENDERECOCLIENTE={ENDERECOCLIENTE}
                                        CPFCNPJCLIENTE={CPFCNPJCLIENTE}
                                        nr_codigo_cliente={nr_codigo_cliente}                                        
                                        GRUPOCLIENTENOME={GRUPOCLIENTENOME}
                                        cd_cliente={cd_cliente}
                                        CLIENTE={CLIENTE}
                                        cd_devedor={cd_devedor}                                        
                                        ENDERECODEVEDOR={ENDERECODEVEDOR}
                                        ENDERECODEVEDORMASCARA={ENDERECODEVEDORMASCARA}
                                        cd_avalista={cd_avalista}
                                        AVALISTA={AVALISTA}
                                        CPFCNPJAVALISTA={CPFCNPJAVALISTA}
                                        cd_cobrador={cd_cobrador}
                                        COBRADOR1={COBRADOR1}
                                        cd_cobrador2={cd_cobrador2}
                                        COBRADOR2={COBRADOR2}
                                        cd_cobrador_auxiliaR={cd_cobrador_auxiliar}
                                        COBRADOR3={COBRADOR3}
                                        EACAOCONTRA={EACAOCONTRA}
                                    />
                                </tbody> 
                            </Table>

                            {BloqueioDiscagemTemporario && BloqueioDiscagemTemporario.length > 0 && (                            
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr>
                                            <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Restrições</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><b>Data Cadastro</b></td>
                                            <td><b>Expiração</b></td>                                            
                                            <td><b>Descrição</b></td>
                                        </tr>
                                        {BloqueioDiscagemTemporario.map((restricao, index) => (
                                            <tr key={`Restricao_${index}`}>
                                                <td>{formatDate(restricao.dt_criacao, 'timestampUpdated')}</td>
                                                <td>{formatDate(restricao.dt_bloqueio)}</td>                                                
                                                <td>{restricao.de_origem_bloqueio}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
        
                            <Table className='GridCob-Titulo' size="sm" responsive striped>
                                <thead>
                                    <tr>
                                        <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Informações</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <RowInfo
                                        marking={marking}
                                        contractInfo={getContractInfo}
                                        contractInfo2={getContractInfo2}
                                        MARCACAO={MARCACAO}
                                    />
                                </tbody>
                            </Table> 
                            {bancoPAN ? //verifica se é banco PAN, se for, cria a tabela detalhes do Contrato
                            <>
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr>
                                            <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Detalhes do Contrato</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <RowOther
                                            bancoPAN={bancoPAN}
                                            bancoPANVeiculo={bancoPANVeiculo}
                                            de_obs_loja={de_obs_loja}
                                            de_observacao={de_observacao}
                                            CDGRUPOCLI={CDGRUPOCLI}
                                            CDGRUPODEV={CDGRUPODEV}
                                            de_loja={de_loja}
                                            STATE={STATE}
                                        />
                                    </tbody>
                                </Table>
        
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr>
                                            <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Outros dados</span></th>
                                        </tr>
                                    </thead>
                                    <tbody> 
                                        <RowOther
                                            logBatimentoPAN={logBatimentoPAN}
                                        />
                                    </tbody>
                                </Table> 
                                
                                {de_observacao || de_obs_loja ?  //verifica se a ficha tem dados complementares
                                    <Table className='GridCob-Titulo' size="sm" responsive striped>
                                        <thead>
                                            <tr>
                                                <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Dados Complementares</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan='5'><b>Outros</b></td>
                                            </tr>
                                            <tr>
                                                <td colSpan='5'><p className='letrabatimento'>{auxDadosHtml}</p></td>
                                            </tr>
                                        </tbody>
                                    </Table> 
                                : <></>}
                            </>
                            : <></>}
                            
                            {bancoBV || recovery || AGENCIACONTABRADESCO || dadosSantander || dadosBradesco ? 
                            //verifica se é os demais bancos
                            <Table className='GridCob-Titulo' size="sm" responsive striped>
                                <thead>
                                    <tr>
                                        <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Outros dados</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <RowOther
                                        recovery={recovery}
                                        bancoBV={bancoBV}
                                        AGENCIACONTABRADESCO={AGENCIACONTABRADESCO}
                                        dadosSantander={dadosSantander}
                                        dadosBradesco={dadosBradesco}
                                        cd_causa_abn={cd_causa_abn}
                                        cd_regiao_abn={cd_regiao_abn}
                                        CDGRUPOCLI={CDGRUPOCLI}
                                        CDGRUPODEV={CDGRUPODEV}
                                        de_obs_loja={de_obs_loja}
                                        de_observacao={de_observacao}
                                    />
                                    {CDGRUPOCLI !== '26' && CDGRUPOCLI !== '48' && CDGRUPODEV !== '26' && CDGRUPODEV !== '48' ?
                                    <>
                                        <tr>
                                            <td colSpan='5'><b>Outros</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan='5'><p className='letrabatimento'>{auxDadosHtml}</p></td>
                                        </tr>
                                    </>
                                    : <></>}
                                </tbody>
                            </Table> 
                            : CDGRUPODEV === '26' ?
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr>
                                            <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Outros dados</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='TableCob-titulos'><b>Guarda Doc</b></td>
                                            <td className='TableCob-titulos'><b>BV Mais</b></td>
                                            <td className='TableCob-titulos'><b>Loja</b></td>
                                        </tr>
                                        <tr>
                                            <td>{de_bvdoc}&nbsp;</td>
                                            <td>{de_bvmais === 'S' ? 'SIM' : 'NÃO'}&nbsp;</td>
                                            <td colSpan='2'>{de_loja}&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colSpan='5'><b>Outros</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan='5'><p className='letrabatimento'>{auxDadosHtml}</p></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            : bancoPAN === undefined ? 
                            <>
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr>
                                            <th colSpan='5' className='TableCob-header-titulo thead-none-border-top'><span className='alignTextHeader-titulo'>Outros dados</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='TableCob-titulos'><b>Loja</b></td>
                                        </tr>
                                        <tr>
                                            <td>{de_loja}&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colSpan='5'><b>Outros</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan='5'><p className='letrabatimento'>{auxDadosHtml}</p></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </> : null}
                        </Tab>
                        <Tab eventKey='parcelas' title={<div className="icon-container" numero={dadosParcela ? dadosParcela.length : '0'}><span className='text-parcelas'>Parcelas</span> </div>} className={dadosParcela !== undefined ? 'tab-content-parcela' : ''} > 
                            {dadosParcela ? 
                            <>
                                <Table className='GridCob-Titulo' size="sm" responsive striped>
                                    <thead>
                                        <tr className="TableCob-header-titulo TableCob-header-center"> 
                                            <th className='thead-none-border-top'>Parcelas em aberto</th>
                                        </tr>
                                    </thead>
                                </Table>
                                
                                <Table className={tableParcela2 && tableParcela3 ? 'tableCob-Parcela-primary' : tableParcela2 && !tableParcela3 ? 'tableCob-Parcela-with-two-tables' : 'tableCob-Parcela-with-one-table'} size="sm" striped hover>
                                    <thead className='theadCob-Parcela'>
                                        <tr>
                                            <td><b>Parcela</b></td>
                                            <td><b>Vencimento</b></td>
                                            <td><b>Atraso(dias)</b></td>
                                            <td><b>Valor</b></td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableParcela1.map((index, key) => {
                                            return (
                                                <React.Fragment key={key}>
                                                    <tr>
                                                        <td><font className='ficha_letravermelhapequena'>{index ? index.cd_parcela + '/' + index.nr_total_parcelas : <></>}</font></td>
                                                        <td><font className='ficha_letrapequena'>{index ? index.dt_vencimento : <></>}</font></td>
                                                        <td><font className='ficha_letravermelhapequena'>{index ? index.dias_atraso : <></>}</font></td>
                                                        <td><font className='ficha_letrapequena'>{index ? numberToReal(index.vl_titulo) : <></>}</font></td>
                                                    </tr> 
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                
                                {tableParcela2 && (
                                    <Table className={tableParcela3 ? 'tableCob-Parcela-secondary' : 'tableCob-Parcela-with-two-tables-margin-left'} size="sm" striped>
                                        <thead className='theadCob-Parcela'>
                                            <tr>
                                                <td><b>Parcela</b></td>
                                                <td><b>Vencimento</b></td>
                                                <td><b>Atraso(dias)</b></td>
                                                <td><b>Valor</b></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableParcela2 !== undefined ? tableParcela2.map((index, key) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr>
                                                            <td><font className='ficha_letravermelhapequena'>{index ? index.cd_parcela + '/' + index.nr_total_parcelas : <></>}</font></td>
                                                            <td><font className='ficha_letrapequena'>{index ? index.dt_vencimento : <></>}</font></td>
                                                            <td><font className='ficha_letravermelhapequena'>{index ? index.dias_atraso : <></>}</font></td>
                                                            <td><font className='ficha_letrapequena'>{index ? numberToReal(index.vl_titulo) : <></>}</font></td>
                                                        </tr> 
                                                    </React.Fragment>
                                                )
                                            }) : null}
                                        </tbody>
                                    </Table>
                                )} 
                                
                                {tableParcela3 && (
                                    <Table className='tableCob-Parcela-tertiary' size="sm" striped>
                                        <thead className='theadCob-Parcela'>
                                            <tr>
                                                <td><b>Parcela</b></td>
                                                <td><b>Vencimento</b></td>
                                                <td><b>Atraso(dias)</b></td>
                                                <td><b>Valor</b></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableParcela3 !== undefined ? tableParcela3.map((index, key) => {
                                                return (
                                                    <React.Fragment key={key}>
                                                        <tr>
                                                            <td><font className='ficha_letravermelhapequena'>{index ? index.cd_parcela + '/' + index.nr_total_parcelas : <></>}</font></td>
                                                            <td><font className='ficha_letrapequena'>{index ? index.dt_vencimento : <></>}</font></td>
                                                            <td><font className='ficha_letravermelhapequena'>{index ? index.dias_atraso : <></>}</font></td>
                                                            <td><font className='ficha_letrapequena'>{index ? numberToReal(index.vl_titulo) : <></>}</font></td>
                                                        </tr> 
                                                    </React.Fragment>
                                                )
                                            }) : null}
                                        </tbody>
                                    </Table>
                                )} 
                            </>
                            : 
                            <div className='divCob-fontawesome'>
                                <div className='divCob-fontawesome-icon'>
                                    <GoInfo className='iconInfo-titulo' /> 
                                </div>

                                <div className='divCob-fontawesome-text'>
                                    <font className='fontCob-awesome-not-register'>Não há parcelas em aberto.</font>
                                </div>
                            </div>
                            }
                        </Tab>
                        <Tab eventKey='garantias' title={<div className="icon-container" numero={dadosGarantia ? dadosGarantia.length : '0'}>Garantias </div>} className={dadosGarantia ? dadosGarantia.length > 0 ? 'tab-content-garantia' : '' : ''} >
                            {dadosGarantia ? 
                                <Table className='GridCob-Titulo-garantia' size="sm" responsive striped hover>
                                <thead className='theadCob-Garantia'>
                                    <tr className="TableCob-header-titulo TableCob-header-center">
                                        <th className='thead-none-border-top' colSpan="10">Garantias</th>
                                    </tr>

                                    {dadosGarantia ? //verifica se tem alguma garantia, se tiver, cria o cabeçalho e faz o map no array pra exibir as informações
                                        <tr>
                                            <td><b>Tipo Bem</b></td>
                                            <td><b>Marca</b></td>
                                            <td><b>Modelo</b></td>
                                            <td><b>Renavam</b></td>
                                            <td><b>Chassi</b></td>
                                            <td><b>Cod.Molicar</b></td>
                                            <td><b>Cor</b></td>
                                            <td><b>Placa</b></td>
                                            <td><b>Ano/Modelo</b></td>
                                        </tr>
                                    : <></>}
                                </thead>
                                <tbody>
                                    {dadosGarantia.map((index) => {
                                        return (
                                        <React.Fragment key={index.nr_bem}>
                                            <tr>
                                                <td>{index.de_tipo_bem}</td>
                                                <td>{index.de_veiculo_marca}</td>
                                                <td>{index.de_veiculo_modelo}</td>
                                                <td>{index.nr_renavam}</td>
                                                <td>{index.de_chassi}</td>
                                                <td>{index.cd_codigo_molicar}</td>
                                                <td>{index.de_veiculo_cor}</td>
                                                <td>{index.de_veiculo_placa}</td>
                                                <td>{index.de_ano_modelo ? index.de_ano_fabricacao + '/' + index.de_ano_modelo : index.de_ano_fabricacao}</td>
                                            </tr>
                                        </React.Fragment>
                                        )
                                    })}
                                </tbody> 
                            </Table>
                            :
                            <div className='divCob-fontawesome'>
                                <div className='divCob-fontawesome-icon'>
                                    <GoInfo className='iconInfo-titulo' /> 
                                </div>

                                <div className='divCob-fontawesome-text'>
                                    <font className='fontCob-awesome-not-register'>Não há garantias para esse contrato.</font>
                                </div>
                            </div>
                            }
                        </Tab>
                        <Tab eventKey='despesas' title={<div className="icon-container" numero={dadosDespesa ? dadosDespesa.length : '0'}>Despesas </div>} className={dadosDespesa ? dadosDespesa.length > 0 ? 'tab-content-despesa' : '' : ''}>
                            {dadosDespesa ? 
                            <Table className='GridCob-Titulo-despesa' size="sm" responsive striped hover>
                                <thead className='theadCob-Garantia'>
                                    <tr className="TableCob-header-titulo TableCob-header-center">
                                        <th className='thead-none-border-top' colSpan="10">Despesas</th>
                                    </tr>

                                    {dadosDespesa ? //verifica se a ficha tem alguma despesa, caso tiver, cria cabeçalho e faz o map no array para exibir informações
                                        <tr>
                                            <td className='WidthCob-despesas'><b>Descrição</b></td>
                                            <td className='WidthCob-despesas AlignCob-data-cadastro-header'><b>Data Cadastro</b></td>
                                            <td className='AlignCob-valor-header'><b>Valor</b></td>
                                        </tr>
                                    :  <></>}
                                </thead>
                                <tbody>
                                    {dadosDespesa.map((index, key) => {
                                        return (
                                        <React.Fragment key={key}>
                                            <tr>
                                                <td className='WidthCob-despesas-primary-column'><font className='ficha_letrapequena'>{index.de_custas}</font></td>
                                                <td className='WidthCob-despesas AlignCob-data-cadastro'><font className='ficha_letrapequena-despesa'>{formatDate(index.dt_cadastro)}</font></td>
                                                <td className='AlignCob-valor'><font className='ficha_letrapequena'>{index.dt_reembolso === '' ? '**' + numberToReal(index.vl_valor) : numberToReal(index.vl_valor)}</font></td>
                                            </tr>
                                        </React.Fragment>
                                        )
                                    })}
                                    {dadosDespesa ? 
                                        <tr>
                                            <td colSpan='2'><font className='ficha_letravermelhapequena'>VALOR TOTAL EM ABERTO</font></td>
                                            <td className='AlignCob-valor'><font className='ficha_letravermelhapequena'><b>{numberToReal(dadosSomaDespesa)}</b></font></td>
                                        </tr>
                                    :  <></>}
                                    {dadosDespesaVencer !== '' ?
                                        <tr>
                                            <td colSpan='3'>
                                                <font className='ficha_letravermelhapequena'>
                                                    {dadosDespesaVencer.dt_cadastro ? 'Existem despesas a vencer no dia ' + dadosDespesaVencer.dt_cadastro : ''} {dadosDespesaVencer.vl_valor ? ', no valor de ' + dadosDespesaVencer.vl_valor : ''}
                                                </font>
                                            </td>
                                        </tr>
                                    : <></>}
                                </tbody> 
                            </Table>
                            : 
                            <>
                                <div className='divCob-fontawesome'>
                                    <div className='divCob-fontawesome-icon'>
                                        <GoInfo className='iconInfo-titulo' /> 
                                    </div>

                                    <div className='divCob-fontawesome-text'>
                                        <font className='fontCob-awesome-not-register'>Não há despesas em aberto.</font>
                                    </div>
                                </div>
                            </>
                            } 
                        </Tab>
                    </Tabs>
                </>
            )
        }
    }
}

const mapStateToProps = (store) => ({ 
    application: store.application,
    titulo: store.titulo
})

const mapDispatchToProps = (dispatch) => {
    return {
        getContract: (params) => dispatch(getContract(params)),    
        saveParamsEvents: (params, route) => dispatch(saveParamsEvents(params, route)),
        loadActionPending: (action, route) => dispatch(loadActionPending(action, route)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Titulo)