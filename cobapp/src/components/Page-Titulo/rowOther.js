import React, { Component } from "react";
import { formatSize, numberToReal, formatRate } from '../../utils'

export class RowOther extends Component {

  render() {
    const { recovery, bancoBV, bancoPAN, logBatimentoPAN, de_loja, bancoPANVeiculo, dadosSantander, dadosBradesco, CDGRUPOCLI, CDGRUPODEV, cd_regiao_abn, cd_causa_abn, STATE, AGENCIACONTABRADESCO, de_obs_loja, de_observacao } = this.props
    
    if(CDGRUPOCLI === '66'){
        return (
        <>
            <tr>
                <td><b>Operação SIR</b></td>
                <td><b>SAT</b></td>
                <td><b>SOP</b></td>
                <td><b>GRUPO</b></td>
            </tr>
            <tr>
                <td>{recovery.id_operacao_sir}</td>
                <td>{numberToReal(recovery.saldo_traspaso)}</td>
                <td>{numberToReal(recovery.saldo_operativo)}</td>
                <td>{recovery.grupo}</td>
            </tr>
            
            <tr>
                <td colSpan='4' className='TableCob-titulos'><b>Loja</b></td>
            </tr>
            <tr>
                <td colSpan='4'>{de_loja}&nbsp;</td>
            </tr>
        </>
        )
    } else if(CDGRUPOCLI === '142'){
        return (
        <>
            <tr>
                <td colSpan='5'><b>Carteira/Conta</b></td>
            </tr>
            <tr>
                <td colSpan='5'><b>{AGENCIACONTABRADESCO}</b></td>
            </tr>
            <tr>
                <td className='TableCob-titulos'><b>Loja</b></td>
            </tr>
            <tr>
                <td>{de_loja}&nbsp;</td>
            </tr>
        </>
        )
    } else if(CDGRUPOCLI === '47' || CDGRUPOCLI === '135'){
        if(dadosBradesco.cd_clpdd_finasa === 'S'){
            var contratoBradesco = <><span> {"CONTRATO EM PDD"} </span><br /></>
        } 

        var coefJuros = <React.Fragment key='1'><span>{'Coef Juros: ' + dadosBradesco.cd_coefjuros_finasa} </span><br /></React.Fragment>
        var taxaEfetivaMes =  <React.Fragment key='2'><span> {'Taxa efetiva mês: ' + dadosBradesco.cd_taxajuros_finasa} </span><br /></React.Fragment>

        return (
            <>
                <tr>
                    <td className='TableCob-titulos'><b>Loja</b></td>
                </tr>
                <tr>
                    <td>{de_loja}&nbsp;</td>
                </tr>
                <tr>
                    <td className='TableCob-titulos'><b>Dados Bradesco</b></td>
                </tr>
                <tr>
                    <td>{[contratoBradesco, coefJuros, taxaEfetivaMes]}</td>
                </tr>
            </>
        )
    } else if(CDGRUPOCLI === '4' || CDGRUPOCLI === '82' || CDGRUPOCLI === '86'){
        if(dadosSantander.subsegmento !== ''){
            var subsegmento = 'Subsegmento: ' + dadosSantander.subsegmento
        }

        var regiao = <React.Fragment key='1'> {'Região: ' + cd_regiao_abn} <br /> </React.Fragment>
        var causa = <React.Fragment key='2'>{'Código da causa: ' + cd_causa_abn} <br /> </React.Fragment>

        return (
            <>
                <tr>
                    <td className='TableCob-titulos'><b>Dados Santander</b></td>
                </tr>
                <tr>
                    <td>{[regiao, causa, subsegmento]}</td>
                </tr>

                <tr>
                    <td className='TableCob-titulos'><b>Loja</b></td>
                </tr>
                <tr>
                    <td>{de_loja}&nbsp;</td>
                </tr>
            </>
        )
    } else if(CDGRUPOCLI === '26' || CDGRUPOCLI === '48' || CDGRUPODEV === '26' || CDGRUPODEV === '48') {
        var auxDadosHtmlBV = ''
        if(de_obs_loja !== ''){
            auxDadosHtmlBV = de_obs_loja
        } else if (de_observacao !== '') {
            auxDadosHtmlBV = de_observacao
        }

        return (
            <>               
            <tr>
                <td width='15.3%'><b>Score</b></td>
                <td width='17.2%'><b>Valor Risco Cliente</b></td>
                <td width='18%'><b>Valor Mora</b></td>
                <td width='21.6%'><b>Valor Multa</b></td>
                <td><b>Dia recorrente de pagamento</b></td>
            </tr>
            <tr>
                <td>{bancoBV.cd_score}</td>
                <td>{bancoBV.vl_risco ? numberToReal(bancoBV.vl_risco) : 'R$ 0,00'}</td>
                <td>{bancoBV.vl_mora ? numberToReal(bancoBV.vl_mora) : 'R$ 0,00'}</td>
                <td>{bancoBV.vl_multa ? numberToReal(bancoBV.vl_multa) : 'R$ 0,00'}</td>
                <td>{bancoBV.nr_dia_recorrente ? bancoBV.nr_dia_recorrente : '0'}</td>
            </tr>

            <tr>
                <td><b>Taxa Juros</b></td>
                <td><b>Taxa CET</b></td>
                <td><b>Nr. Proposta</b></td>
                <td><b>Tipo Bem</b></td>
                <td><b>Modalidade</b></td>
            </tr>
            <tr>
                <td>{bancoBV.tx_juros ? formatRate(bancoBV.tx_juros) : '0,00'}</td>
                <td>{bancoBV.tx_cet ? formatRate(bancoBV.tx_cet) : '0,00'}</td>
                <td>{bancoBV.nr_proposta ? bancoBV.nr_proposta : ''}</td>
                <td>{bancoBV.cd_tipo_bem ? formatSize(0 + bancoBV.cd_tipo_bem, 3) + '/' + bancoBV.de_tipo_bem : '000/'}</td>
                <td>{bancoBV.cd_modalidade ? formatSize(0 + bancoBV.cd_modalidade, 3) + '/' + bancoBV.de_modalidade : '000/'}</td>
            </tr>

            <tr>
                <td><b>Produto</b></td>
                <td><b>Filial</b></td>
                <td><b>Empresa</b></td>
                <td><b>Região Cyber</b></td>
                <td><b>Região Nova</b></td>
            </tr>
            <tr>
                <td>{bancoBV.cd_produto ? formatSize(0 + bancoBV.cd_produto, 3) + '/' + bancoBV.de_produto : '000/'}</td>
                <td>{bancoBV.cd_filial ? formatSize(0 + bancoBV.cd_filial, 3) + '/' + bancoBV.de_filial : '000/'}</td>
                <td>{bancoBV.de_empresa}</td>
                <td>{bancoBV.cd_regiao ? formatSize(0 + bancoBV.cd_regiao, 3) + '/' + bancoBV.de_regiao : '000/'}</td>
                <td><span style={{whiteSpace: 'nowrap'}}>{formatSize(bancoBV.cd_regiao_nova, 5)}/{bancoBV.de_regiao_nova}</span></td>
            </tr>

            <tr>
                <td>{bancoBV.vl_bem !== "" ? <b>Valor Bem</b> : ''}</td>
                <td><b>{bancoBV.vl_contabil !== "" ? <b>Repasse pela Retomada</b> : ''}</b></td>
                <td><b>Valor Financiamento</b></td>
                <td><b>Motivo Contrato Financeiro</b></td>
                <td><b>BV Mais</b></td>
            </tr>
            <tr>
                <td className='letravermelhapequena'>{bancoBV.vl_bem !== '' ? numberToReal(bancoBV.vl_bem) : ''}</td>
                <td className='letravermelhapequena'>{bancoBV.vl_contabil !== '' ? numberToReal(bancoBV.vl_contabil) : ''}</td>
                <td>{bancoBV.vl_financiado !== '0' && bancoBV.vl_financiado !== "" ? numberToReal(bancoBV.vl_financiado) : <p></p>}</td>
                <td>{bancoBV.de_motivo_contrato_financeiro}</td>
                <td>{bancoBV.de_bvmais === 'S' ? <span>SIM</span> : <span>NÃO</span>}</td>
            </tr>
            
            <tr>
                <td><b>Loja</b></td>
                <td><b>Guarda Doc 5</b></td>
                <td colSpan='3'><b>Outros</b></td>
            </tr>
            <tr>
                <td>{bancoBV.de_loja ? bancoBV.de_loja : <p></p>}</td>
                <td>{bancoBV.de_bvdoc}</td>
                <td colSpan='3'><p className='letrabatimento'>{auxDadosHtmlBV}</p></td>
            </tr>
        
            {bancoBV.fl_suspenso === 'S' ? 
            <>
                <tr>
                    {bancoBV.motivo_bloqueio !== '31' && bancoBV.motivo_bloqueio !== '26' ? <td><b>Suspensão de Cobrança</b></td> : <td colSpan='4'><b>Suspensão de Cobrança</b></td>}
                    {bancoBV.motivo_bloqueio !== '31' && bancoBV.motivo_bloqueio !== '26' ? <td colSpan='4'><b>Motivo Suspensão</b></td> : null}
                </tr>
                <tr>
                    {bancoBV.motivo_bloqueio === '1' ? <td>Suspensão Permanente</td> : bancoBV.dt_bloqueio === '' ? <td>Suspenso</td> : <td>Suspenso até {bancoBV.dt_bloqueio}</td>}
                    {bancoBV.motivo_bloqueio !== '31' && bancoBV.motivo_bloqueio !== '26' ? 
                        bancoBV.motivo_bloqueio === '1' ? <td colSpan='4'>Determinaçao Judicial</td> : 
                        bancoBV.motivo_bloqueio === '3' ? <td colSpan='4'>Processo em renegociação</td> : 
                        bancoBV.motivo_bloqueio === '4' ? <td colSpan='4'>Entrega Amigável</td> :
                        bancoBV.motivo_bloqueio === '5' ? <td colSpan='4'>Processo de Cancelamento de Contrato</td> : 
                        bancoBV.motivo_bloqueio === '6' ? <td colSpan='4'>Acordo com Cheque Pré</td> : 
                        bancoBV.motivo_bloqueio === '7' ? <td colSpan='4'>Localizando pagamento</td> : 
                        bancoBV.motivo_bloqueio === '17' ? <td colSpan='4'>Ajuizamento Antecipado</td> : 
                        bancoBV.motivo_bloqueio === '18' ? <td colSpan='4'>Constatação de Fraude</td> : 
                        bancoBV.motivo_bloqueio === '19' ? <td colSpan='4'>Suspeita de Fraude - Inspetoria</td> : 
                        bancoBV.motivo_bloqueio === '20' ? <td colSpan='4'>Aguardando Confirmação de Repasse</td> : 
                        bancoBV.motivo_bloqueio === '21' ? <td colSpan='4'>Carta Pesquisa</td> : 
                        bancoBV.motivo_bloqueio === '22' ? <td colSpan='4'>Suspensão Vitalícia</td> : 
                        bancoBV.motivo_bloqueio === '23' ? <td colSpan='4'>Pagamento Cardif</td> : 
                        bancoBV.motivo_bloqueio === '24' ? <td colSpan='4'>Suspeita de Fraude</td> : 
                        bancoBV.motivo_bloqueio === '25' ? <td colSpan='4'>Cancelamento de Contrato</td> : 
                        bancoBV.motivo_bloqueio === '27' ? <td colSpan='4'>Retirada de Cobrança</td> :
                        bancoBV.motivo_bloqueio === '28' ? <td colSpan='4'>Alega Pagamento - Cobrança</td> :
                        bancoBV.motivo_bloqueio === '29' ? <td colSpan='4'>Pagamento Seguradora</td> :
                        bancoBV.motivo_bloqueio === '30' ? <td colSpan='4'>Parcela Paga Inversamente</td> : 
                        bancoBV.motivo_bloqueio === '33' ? <td colSpan='4'>Emissão de Boleto Itausig</td> :
                        bancoBV.motivo_bloqueio === '34' ? <td colSpan='4'>Óbito</td> :
                        bancoBV.motivo_bloqueio === '35' ? <td colSpan='4'>Pagamento Menor - Boleto Itausig</td> :
                        bancoBV.motivo_bloqueio === '36' ? <td colSpan='4'>PAGAMENTO EM JUÍZO</td> :
                        bancoBV.motivo_bloqueio === '37' ? <td colSpan='4'>Aguardando Processamento da Prestação de Contas</td> :
                        bancoBV.motivo_bloqueio === '38' ? <td colSpan='4'>Divergência no Contrato</td> :
                        bancoBV.motivo_bloqueio === '39' ? <td colSpan='4'>Entrega Amigável Adimplente</td> : null
                    : null} 
                </tr>
            </>
            : <></>}
        </>
        )
    } else if(CDGRUPOCLI === '11' || CDGRUPOCLI === '78'){
        var de_refin = ""
        var fl_seguro = ""
        var dt_seguro = ""
        var cd_tipo_refin = ""
        var de_notificacao = ""
        var dt_notificacao = ""
        var fl_elegivel_entrega = ""
        var fl_elegivel_parcelamento = ""
        var fl_score_ajuizado = ""
        // var de_fpd = ""
        var auxDadosHtml = ""
        var auxDadosHtmlBANCOPAN = ""
        var auxDadosHtmlBANCOPAN2 = ""
        // var de_cessionario = ""
        var qtd_acordo_quebrado = ""
        var dt_acordo_quebrado = ""
        var qtd_parc_acordo_quebrado = ""
        var dt_parc_acordo_quebrado = ""
        var nr_parcela_notificada = ""
        var dt_notificacao_aju = ""
        var vl_veiculo = ""
        var cd_veiculo = ""
        var nrplano = bancoPAN.Plano

        if(bancoPAN.fl_seguro === 'S'){
            fl_seguro = "SIM"
            dt_seguro = bancoPAN.dt_vigencia_seguro
        } else {
            fl_seguro = "NÃO"
            dt_seguro = ""
        }

        if( bancoPAN.cd_score2 > 0 && bancoPAN.fl_refin > 0){
            if(bancoPAN.fl_refin === 2){
               cd_tipo_refin = '2'  
               de_refin="SIM +12"
            }else{
               cd_tipo_refin='1'
               de_refin="SIM"
            }
        }

        if(bancoPAN.fl_elegivel_entrega > 0){
            fl_elegivel_entrega = " SIM "
        } else {
            fl_elegivel_entrega = " NÃO "
        }
        
        if(bancoPAN.fl_elegivel_parcelamento === '1'){
            fl_elegivel_parcelamento = " SIM "
        } else {
            fl_elegivel_parcelamento = " NÃO "
        }

        if(bancoPAN.de_fpd === 'F'){
            auxDadosHtmlBANCOPAN =  "CONTRATO: FPD" 
        } 
        if(bancoPAN.de_cessionario === 'CAIXA ECONOMICA'){
            auxDadosHtmlBANCOPAN2 = <span>CONTRATO: CEDIDO <br /> {bancoPAN.de_cessionario}</span> 
        }

        if(bancoPAN.fl_contrato_reneg === 1){
            auxDadosHtml = <font className='ficha_letravermelhapequena'>BASE RENEG</font>
        }

        if(bancoPAN.Qtd_acordo_quebrado > 0){
            qtd_acordo_quebrado = <font className='ficha_letravermelha'>{bancoPAN.Qtd_acordo_quebrado}</font>
            dt_acordo_quebrado = <font className='ficha_letravermelha'>{bancoPAN.dt_acordo_quebrado}</font>
        } else { 
            qtd_acordo_quebrado = ""
            dt_acordo_quebrado = ""
        }

        if(bancoPAN.Qtd_acordo_parc_quebrado > 0){
            qtd_parc_acordo_quebrado = <font className='ficha_letravermelha'>{bancoPAN.Qtd_acordo_parc_quebrado}</font>
            dt_parc_acordo_quebrado = <font className='ficha_letravermelha'>{bancoPAN.dt_acordo_parc_quebrado}</font>
        } else {
            qtd_parc_acordo_quebrado = ""
            dt_parc_acordo_quebrado = ""
        }

        if(bancoPAN.fl_score_ajuizado > 0){
            fl_score_ajuizado = " SIM "
        } else {
            fl_score_ajuizado = " NÃO "
        }

        if(bancoPAN.nr_parcela_notificada > 0){
            nr_parcela_notificada = <font className='ficha_letravermelha'>{bancoPAN.nr_parcela_notificada}</font>
            dt_notificacao_aju = <font className='ficha_letravermelha'>{bancoPAN.dt_notificacao_aju}</font>
        } else {
            nr_parcela_notificada = ""
            dt_notificacao_aju = ""
        }

        if(bancoPAN.vl_veiculo !== ''){
            vl_veiculo = numberToReal(bancoPAN.vl_veiculo)
        } else {
            vl_veiculo = ""
        }

        if(bancoPAN.cd_veiculo !== ''){
            cd_veiculo = bancoPAN.cd_veiculo
        } else {
            cd_veiculo = ""
        }

        if(bancoPAN.de_notificacao !== ''){
            de_notificacao = <font className='ficha_letravermelha'><b>{bancoPAN.de_notificacao}</b></font> 
            dt_notificacao = <font className='ficha_letravermelha'><b> {bancoPAN.dt_notificacao}</b></font>
        } else {
            de_notificacao = ""
            dt_notificacao = ""
        }
        
        if((cd_tipo_refin === '1' || cd_tipo_refin === '2') && nrplano > 0 ){
            auxDadosHtml = <><b>Refinanciamento em até {nrplano}x</b><br /></>
        } else if ((cd_tipo_refin === '1' || cd_tipo_refin === '2') && nrplano === 0) {
            auxDadosHtml = <><b>Refinanciamento em até {nrplano =+ 12}x</b><br /></>
        } else {
            auxDadosHtml = ""
        }
        
        if(STATE === "RPF"){
            auxDadosHtml = "PDD DOBRADO"
        }   

        return (
        <>
            <tr>
                <td><b>Loja</b></td>
                <td><b>Código Veículo Molicar</b></td>
                <td><b>Score</b></td>
                <td><b>Contrato Refin</b></td>
            </tr>
            <tr>
                <td>{de_loja}</td>
                <td>{bancoPANVeiculo ? bancoPANVeiculo.veiculocodigo : ''}&nbsp;</td>
                <td><font className='ficha_letravermelha'><b>{bancoPAN.de_score}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{de_refin}</b></font></td>
            </tr>

            <tr>
                <td><b>Seguro Prestamista</b></td>
                <td><b>Data Vigência Seguro</b></td>
                <td><b>Parcela Notificada</b></td>
                <td><b>Data Notificação Ajuizamento</b></td>
            </tr>
            <tr>
                <td><font className='ficha_letravermelha'><b>{fl_seguro}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{dt_seguro}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{nr_parcela_notificada}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{dt_notificacao_aju}</b></font></td>
            </tr>

            <tr>
                <td><b>Elegível Ajuizamento</b></td>
                <td><b>Data da Notificação</b></td>
                <td><b>Código Veículo</b></td>
                <td><b>Valor Veículo/Repasse</b></td>
            </tr>
            <tr>
                <td><font className='ficha_letravermelha'><b>{fl_score_ajuizado}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{dt_notificacao}</b></font></td>
                <td><b>{cd_veiculo}</b></td>
                <td>{vl_veiculo}</td>
            </tr>

            <tr>
                <td><b>Elegível Parcelamento</b></td>
                <td><b>Data do último acordo quebrado</b></td>
                <td><b>Acordos quebrados(últimos 90 dias)</b></td>
                <td><b>Opção de refinanciamento</b></td>
            </tr>
            <tr>
                <td><font className='ficha_letravermelha'><b>{fl_elegivel_parcelamento}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{dt_acordo_quebrado}</b></font></td>
                <td><font className='ficha_letravermelha'><strong>{qtd_acordo_quebrado}</strong></font></td>
                <td><font className='ficha_letravermelha'><strong>{auxDadosHtml}</strong></font></td>
            </tr>

            <tr>
                <td><b>Elegível Entrega Amigável</b></td>
                <td><b>Data do último acordo parcelado quebrado</b></td>
                <td><b>Acordos parcelados quebrados(últimos 180 dias)</b></td>
                <td><b>Notificação</b></td>
            </tr>
            <tr>
                <td><font className='ficha_letravermelha'><b>{fl_elegivel_entrega}</b></font></td>
                <td><font className='ficha_letravermelha'><b>{dt_parc_acordo_quebrado}</b></font></td>
                <td><font className='ficha_letravermelha'><strong>{qtd_parc_acordo_quebrado}</strong></font></td>
                <td><font className='ficha_letravermelha'><strong>{de_notificacao}</strong></font></td>
            </tr>

            <tr>
                <td colSpan='5'><b>Dados Banco PAN</b></td>
            </tr>

            <tr>
                <td colSpan='5'>{auxDadosHtmlBANCOPAN !== '' ? <p>{auxDadosHtmlBANCOPAN}</p> : <p>{auxDadosHtmlBANCOPAN2}</p>}</td>
            </tr>
        </>
        )
    } else if (logBatimentoPAN){
        if(logBatimentoPAN.NoResult){
            return (
            <>
                <tr>
                    <td colSpan='5'><b>Dados Arquivo Batimento</b></td>
                </tr>
                <tr>
                    <td className='letrabatimento'>{logBatimentoPAN.NoResult}</td>
                </tr>
            </>
            )
        }

        return (
        <>
            <tr>
                <td colSpan='5'><b>Dados Arquivo Batimento</b></td>
            </tr>
            <tr className='table-borderless'>
                <td colSpan='5' className='letrabatimento'>ENVIADO NO BATIMENTO : SIM </td>
            </tr>
            <tr className='TableCob-backgroundColor table-borderless'>
                <td className='TableCob-logbatimentoPAN'><span className='letrabatimento'>COBRANÇA</span></td>
                <td><span className='letrabatimento'>COBRANÇA</span></td>
                <td><span className='letrabatimento'>AJUIZAMENTO</span></td>
                <td colSpan='2'><span className='letrabatimento'>AJUIZAMENTO</span></td>
            </tr>
            <tr className='table-borderless'>
                <td className='TableCob-logbatimentoPAN'><span className='letrabatimento'>Data primeiro envio</span></td>
                <td><span className='letrabatimento'>Data último envio</span></td>
                <td><span className='letrabatimento'>Data primeiro envio</span></td>
                <td><span className='letrabatimento'>Data último envio</span></td>
                <td><span className='letrabatimento'>STATUS</span></td>
            </tr>

            <tr className='TableCob-backgroundColor table-borderless'>
                <td className='TableCob-logbatimentoPAN'><span className='letrabatimento'>{logBatimentoPAN.DATAPRIMEIRACOB}</span></td>
                <td><span className='letrabatimento'>{logBatimentoPAN.DATAULTIMACOB}</span></td>
                <td><span className='letrabatimento'>{logBatimentoPAN.DATAPRIMEIROAJU}</span></td>
                <td><span className='letrabatimento'>{logBatimentoPAN.DATAULTIMAAJU}</span></td>
                <td><span className='letrabatimento'>{logBatimentoPAN.STATUSPROCESSO}</span></td>
            </tr>
        </>
        )
    }
  }
}