import React, { Component } from "react";
import { numberToReal, date_diff, formatDate } from '../../utils'

export class RowInfo extends Component {

  render() {
    const { contractInfo, marking, contractInfo2, MARCACAO } = this.props
    
    if(contractInfo){
      const corStatusTitulo = 'letravermelhapequena'
      return (
        <>
          <tr>
            <td><b>Data Cadastro</b></td>
            <td><b>Data Vencimento</b></td>
            <td><b>Parcelas em Aberto</b></td>
            <td><b>Valor Parcelas Aberto</b></td>
            <td><b>Valor Risco</b></td>
          </tr>
          <tr>
            <td><font className='ficha_letraverdepequena'><b>{formatDate(contractInfo.DataCadastro)}</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{formatDate(contractInfo.DataVencimento)}</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{contractInfo.ParcelasVencida}</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{numberToReal(contractInfo.ValorAberto)}</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{numberToReal(contractInfo.ValorRisco)}</b></font></td>
          </tr>
          <tr>
            <td><b>Dias Cadastro</b></td>
            <td><b>Atraso</b></td>
            <td><b>Parcela em Atraso/Plano</b></td>
            <td colSpan="2"><b>Valor Parcela</b></td>
          </tr>
          <tr>
            <td><font className='ficha_letraverdepequena'><b>{date_diff(contractInfo.DataCadastro)} dias</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{contractInfo.Atraso} dias</b></font></td>
            <td><font className={`${corStatusTitulo}`}><b>{contractInfo.Parcela}/{contractInfo.Plano}</b></font></td>
            <td colSpan="2"><font className={`${corStatusTitulo}`}><b>{numberToReal(contractInfo.ValorParcela)}</b></font></td>
          </tr>
          {marking ? 
          <>
            <tr>
              <td><b>Marcação</b></td>
              <td><b>Rating</b></td>
              <td><b>Espécie</b></td>
              <td colSpan="2"><b>State</b></td>
            </tr>
            <tr>
            {MARCACAO === "" ? <td><font className='ficha_letravermelhapequena'>SEM MARCAÇÃO</font></td> : <td><font className='ficha_letravermelhapequena'>{MARCACAO}</font></td>}
              <td><font className='ficha_letraazulpequena'>{marking.cd_rating}</font></td>
              <td><font className='ficha_letravermelhapequena'>{marking.cd_especie}</font></td>
              <td colSpan="2"><font className='ficha_letraazulpequena'>{marking.cd_state}</font></td>
            </tr>
            <tr>
              <td><b>% Pago do Contrato</b></td>
              <td><b>Status Produto</b></td>
              <td><b>Status Cliente</b></td>
              <td><b>Grupo Produto</b></td>
              <td><b>Grupo Produto1</b></td>
            </tr>
            <tr>
              <td><font className='ficha_letravermelhapequena'>{marking.PcPago}%</font></td> 
              <td><font className='ficha_letraazulpequena'>{marking.StatusProduto}</font></td>
              <td><font className='ficha_letraazulpequena'>{marking.StatusCliente}</font></td>
              <td><font className='ficha_letraazulpequena'>{marking.GrupoProduto}</font></td>
              <td><font className='ficha_letraazulpequena'>{marking.GrupoProduto1}</font></td>
            </tr>
          </>
          : undefined} 
        </>
      );
    } else if(contractInfo2){
      const corStatusTitulo = 'letraverdepequena'

      const qtdeParcelasAbertas = "0"
			//PARCELA PLANO
			const qtdeParcelasAtraso = "0/" + contractInfo2.Plano     
			//VALOR PARCELA
			const vlParcela = numberToReal(contractInfo2.ValorParcela)
		  //VALOR TOTAL ABERTO
			const tlAberto = numberToReal(0, 2)
			//VALOR RISCO
			const vlRisco = numberToReal(contractInfo2.ValorRisco)
      
      return (
        <>
        <tr>
          <td><b>Data Cadastro</b></td>
          <td><b>Data Vencimento</b></td>
          <td><b>Parcelas em Aberto</b></td>
          <td><b>Valor Parcelas Aberto</b></td>
          <td><b>Valor Risco</b></td>
        </tr>
        <tr>
          <td><font className='ficha_letraverdepequena'><b>{formatDate(contractInfo2.DataCadastro)}</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{formatDate(contractInfo2.DataVencimento)}</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{qtdeParcelasAbertas}</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{tlAberto}</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{vlRisco}</b></font></td>
        </tr>
        <tr>
          <td><b>Dias Cadastro</b></td>
          <td><b>Atraso</b></td>
          <td><b>Parcela em Atraso/Plano</b></td>
          <td colSpan="2"><b>Valor Parcela</b></td>
        </tr>
        <tr>
          <td><font className={`${corStatusTitulo}`}><b>{date_diff(contractInfo2.DataCadastro)} dias</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{contractInfo2.Atraso} dias</b></font></td>
          <td><font className={`${corStatusTitulo}`}><b>{qtdeParcelasAtraso}</b></font></td>
          <td colSpan="2"><font className={`${corStatusTitulo}`}><b>{vlParcela}</b></font></td>
        </tr>
        {marking ?
          <>
            <tr>
              <td><b>Marcação</b></td>
              <td><b>Rating</b></td>
              <td><b>Espécie</b></td>
              <td colSpan="2"><b>State</b></td>
            </tr>
            <tr>
              {MARCACAO === "" ? <td><font className='ficha_letravermelhapequena'>SEM MARCAÇÃO</font></td> : <td><font className='ficha_letravermelhapequena'>{MARCACAO}</font></td>}
                <td><font className='ficha_letraazulpequena'>{marking.cd_rating}</font></td>
                <td><font className='ficha_letravermelhapequena'>{marking.cd_especie}</font></td>
                <td colSpan="2"><font className='ficha_letraazulpequena'>{marking.cd_state}</font></td>
            </tr>
            <tr>
              <td><b>% Pago do Contrato</b></td>
              <td><b>Status Produto</b></td>
              <td><b>Status Cliente</b></td>
              <td><b>Grupo Produto</b></td>
              <td><b>Grupo Produto1</b></td>
            </tr>
            <tr>
              <td><font className='ficha_letravermelhapequena'>{marking.PcPago}%</font></td> 
              <td><font className='ficha_letraazulpequena'>{marking.StatusProduto}</font></td>
              <td><font className='ficha_letravermelhapequena'>{marking.StatusCliente}</font></td>
              <td><font className='ficha_letraazulpequena'>{marking.GrupoProduto}</font></td>
              <td><font className='ficha_letraazulpequena'>{marking.GrupoProduto1}</font></td>
            </tr>
          </>
          : undefined} 
        </>
      )
    } else { // Ajustar os casos onde não tem informações da ficha.
      return (
        <>
          <tr>
            <td><b>Data Cadastro</b></td>
            <td><b>Data Vencimento</b></td>
            <td><b>Parcelas em Aberto</b></td>
            <td><b>Valor Parcelas Aberto</b></td>
            <td><b>Valor Risco</b></td>
          </tr>
          <tr>
            <td><p></p></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td><b>Dias Cadastro</b></td>
            <td><b>Atraso</b></td>
            <td><b>Parcela em Atraso/Plano</b></td>
            <td colSpan='2'><b>Valor Parcela</b></td>
          </tr>
          <tr>
            <td></td>
            <td>N/D</td>
            <td></td>
            <td colSpan='2'></td>
          </tr>
        </>
      )
    }
  }
}