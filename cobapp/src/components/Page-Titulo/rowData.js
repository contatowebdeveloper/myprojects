import React, { Component } from "react";
import { formatSize, copyTextToClipboard, getNumbers } from '../../utils'
import { codeSeg8916, codigoAuxClienteHTML } from '../../globals'

import { 
  FaEye as FaEyeNomeCliente, FaEye as FaEyeNomeDevedor, FaRegCopy as FaRegCopyNomeDevedor,  
  FaEye as FaEyeCpfCnpjDevedor, FaRegCopy as FaRegCopyCpfCnpjDevedor,  
  FaEye as FaEyeEnderecoDevedor, FaRegCopy as FaRegCopyEnderecoDevedor,  
  FaRegCopy as FaRegCopyFichaDevedor,   FaRegCopy as FaRegCopyContratoLegadoDevedor,  
  FaRegCopy as FaRegCopyContratoGestaroDevedor
} from 'react-icons/fa'

export class RowData extends Component {
  constructor(props){
    super(props)
    this.state = { 
      nomeCliente: '',
      nomeDevedor: '',
      cpfCnpjDevedor: '',
      enderecoDevedor: '',
      enderecoColorIcon: '#3e5dc4',
      nomeColorIcon: '#3e5dc4',
      cpfCnpjColorIcon: '#3e5dc4',
      fichaColorIcon: '#3e5dc4',
      contratoColorIcon: '#3e5dc4',
      contratoGestaoColorIcon: '#3e5dc4',
      copiedNomeDevedor: false,
      copiedCpfCnpjDevedor: false,
      copiedFichaDevedor: false,
      copiedEnderecoDevedor: false,
      copiedContratoDevedor: false,
      copiedContratoGestaoDevedor: false,
      idViewNomeCliente: 'idViewNomeCliente',
      idViewNomeDevedor: 'idViewNomeDevedor',
      idViewCpfCnpjDevedor: 'idViewCpfCnpjDevedor',
      idViewEnderecoDevedor: 'idViewEnderecoDevedor',
      idCopyNomeDevedor: 'idCopyNomeDevedor',
      idCopyCpfCnpjDevedor: 'idCopyCpfCnpjDevedor',
      idCopyEnderecoDevedor: 'idCopyEnderecoDevedor',
      idCopyFichaDevedor: 'idCopyFichaDevedor',
      idCopyContratoLegadoDevedor: 'idCopyContratoLegadoDevedor',
      idCopyContratoGestaoDevedor: 'idCopyContratoGestaoDevedor',
    }
  }

  componentDidMount = () => { 
    let codigoCliente = this.props.getContractInfo ? formatSize(0 + this.props.cd_cliente, 10) : this.props.cd_cliente
    let codigoDevedor = this.props.getContractInfo ? formatSize(0 + this.props.cd_devedor, 10) : this.props.cd_devedor
    this.setState({
      nomeCliente: this.props.EACAOCONTRA ? this.props.NOMECLIENTEMASCARA : this.props.CLIENTE,
      nomeDevedor: this.props.NOMEDEVEDORMASCARA,
      codigoCliente: codigoCliente,
      codigoDevedor: codigoDevedor,
      cpfCnpjDevedor: this.props.CPFCNPJDEVEDORMASCARA,
      enderecoDevedor: this.props.ENDERECODEVEDORMASCARA
    })
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({copied: false})
  }

  render() {
    const { nomeCliente, nomeDevedor, codigoCliente, codigoDevedor } = this.state
    const { cdProcesso, getContractInfo2, CPFCNPJCLIENTE, ENDERECOCLIENTE, nr_codigo_cliente, CPFCNPJDEVEDOR, GRUPOCLIENTENOME, CLIENTE, DEVEDOR, ENDERECODEVEDOR, ENDERECODEVEDORMASCARA, cd_avalista, AVALISTA, CPFCNPJAVALISTA, cd_cobrador, COBRADOR1, cd_cobrador2, COBRADOR2, cd_cobrador_auxiliar, COBRADOR3, CPFCNPJDEVEDORMASCARA, NOMECLIENTEMASCARA, NOMEDEVEDORMASCARA, EACAOCONTRA } = this.props

    return ( 
      <>
        <tr>
          <td width="47%" colSpan='2'>
            <b>Grupo Cliente</b>
          </td>
          <td width="34%" colSpan='2'><b>Devedor / Réu</b></td>
          {CPFCNPJDEVEDOR.replace(/(-|\.)/g, "").length === 11 ? <td width="19%"><b>CPF</b></td> : <td width="19%"><b>CNPJ</b></td>}
        </tr>
        <tr>
          <td colSpan='2'>
            <font className='ficha_letraazulpequena'>{GRUPOCLIENTENOME}</font>
          </td>
          <td colSpan='2'>
            <FaEyeNomeDevedor
              id={this.state.idViewNomeDevedor}
              style={{float: 'left', marginRight: '3px'}}
              size="1rem"
              fill="#3e5dc4"
              onMouseLeave={() => {
                document.getElementById(this.state.idViewNomeDevedor).style.cursor = 'default'
                this.setState({nomeDevedor: NOMEDEVEDORMASCARA })
              }}
              onMouseOver={() => {
                document.getElementById(this.state.idViewNomeDevedor).style.cursor = 'pointer'
              }}
              onClick={() => {
                this.setState({nomeDevedor: DEVEDOR})
              }}
              title="Visualizar campo"
            >
            </FaEyeNomeDevedor>
            {(codeSeg8916) ? (
              <FaRegCopyNomeDevedor 
              id={this.state.idCopyNomeDevedor}
              style={{float: 'left'}}
              size="1rem"
              fill={this.state.nomeColorIcon}
              onClick={() => {
                let Devedor = this.state.codigoDevedor + ' - ' + DEVEDOR
                copyTextToClipboard(Devedor)
                this.setState({copiedNomeDevedor: true, nomeColorIcon: 'green'})
                setTimeout(()=>{
                  this.setState({copiedNomeDevedor: false, nomeColorIcon: '#3e5dc4'})
                }, 1500)}
              }
              onMouseOver={() => {
                document.getElementById(this.state.idCopyNomeDevedor).style.cursor = 'pointer'
              }}
              title="Clique aqui para copiar para a área de transferência"
            ></FaRegCopyNomeDevedor>
            ) : ('')}
            <div style={{float: 'left'}}>
              <font className='ficha_letravermelhapequena'>
                &nbsp;{codigoDevedor} - <b>{nomeDevedor}</b>
              </font>
            </div>
          </td>
          <td>
            <FaEyeCpfCnpjDevedor
              id={this.state.idViewCpfCnpjDevedor}
              style={{float: 'left', marginRight: '3px'}}
              size="1rem"
              fill="#3e5dc4"
              onMouseLeave={() => {
                document.getElementById(this.state.idViewCpfCnpjDevedor).style.cursor = 'default'
                this.setState({cpfCnpjDevedor: CPFCNPJDEVEDORMASCARA})
              }}
              onMouseOver={() => {
                document.getElementById(this.state.idViewCpfCnpjDevedor).style.cursor = 'pointer'
              }}
              onClick={() => {
                this.setState({cpfCnpjDevedor: CPFCNPJDEVEDOR})
              }}
              title="Visualizar Campo"
              >
            </FaEyeCpfCnpjDevedor>
            <FaRegCopyCpfCnpjDevedor
              id={this.state.idCopyCpfCnpjDevedor}
              style={{float: 'left', marginRight: '3px'}}
              size="1rem"
              fill={this.state.cpfCnpjColorIcon}
              onClick={() => {
                copyTextToClipboard(getNumbers(CPFCNPJDEVEDOR))
                this.setState({copiedCpfCnpjDevedor: true, cpfCnpjColorIcon: 'green'})
                setTimeout(()=>{
                  this.setState({copiedCpfCnpjDevedor: false, cpfCnpjColorIcon: '#3e5dc4'})
                }, 1500)}}
              onMouseOver={() => {
                document.getElementById(this.state.idCopyCpfCnpjDevedor).style.cursor = 'pointer'
              }}
              title="Copiar para a área de transferência"
              >
            </FaRegCopyCpfCnpjDevedor>
            <div style={{float: 'left'}}>
              <font className='ficha_letravermelhapequena'>{this.state.cpfCnpjDevedor}</font>
            </div>
          </td>
        </tr>
        <tr id='dados_contrato'>
          {codigoAuxClienteHTML ? (
            <td><b>Cliente / Autor</b></td>
          ):(
            <td colSpan="2"><b>Cliente / Autor</b></td>
          )}
          {codigoAuxClienteHTML && (
            <td><b>CPF / CNPJ</b></td>
          )}
          <td colSpan="3"><b>Endereço Principal do Devedor / Réu</b></td>
        </tr>

        <tr>          
          {codigoAuxClienteHTML ? (
            <td >
              {EACAOCONTRA === true && (
                <FaEyeNomeCliente
                  id={this.state.idViewNomeCliente}
                  style={{float: 'left', marginRight: '3px'}}
                  size="1rem"
                  fill="#3e5dc4"
                  onMouseLeave={() => {
                    document.getElementById(this.state.idViewNomeCliente).style.cursor = 'dafault'
                    this.setState({nomeCliente: NOMECLIENTEMASCARA})
                  }}
                  onMouseOver={() => {
                    document.getElementById(this.state.idViewNomeCliente).style.cursor = 'pointer'
                  }}
                  onClick={() => {
                    this.setState({nomeCliente: CLIENTE})
                  }}
                  title="Visualizar campo"
                >
                </FaEyeNomeCliente>
              )}
              <div style={{float: 'left'}}>
                <font className='ficha_letraazulpequena'>
                  {codigoCliente} - {nomeCliente}
                </font>
              </div>
            </td>
          ) : (
            <td colSpan="2">
              {EACAOCONTRA === true && (
                <FaEyeNomeCliente
                  id={this.state.idViewNomeCliente}
                  style={{float: 'left', marginRight: '3px'}}
                  size="1rem"
                  fill="#3e5dc4"
                  onMouseLeave={() => {
                    document.getElementById(this.state.idViewNomeCliente).style.cursor = 'dafault'
                    this.setState({nomeCliente: NOMECLIENTEMASCARA})
                  }}
                  onMouseOver={() => {
                    document.getElementById(this.state.idViewNomeCliente).style.cursor = 'pointer'
                  }}
                  onClick={() => {
                    this.setState({nomeCliente: CLIENTE})
                  }}
                  title="Visualizar campo"
                >
                </FaEyeNomeCliente>
              )}
              <div style={{float: 'left'}}>
                <font className='ficha_letraazulpequena'>
                  {codigoCliente} - {nomeCliente}
                </font>
              </div>
            </td>
          )}

          {codigoAuxClienteHTML && (
            <td>{CPFCNPJCLIENTE}</td>
            )}

          <td colSpan="3" nowrap="true">
            <font className='ficha_letrapretapequena'>
              <FaEyeEnderecoDevedor
                id={this.state.idViewEnderecoDevedor}
                style={{float: 'left', marginRight: '3px'}}
                size="1rem"
                fill="#3e5dc4"
                onMouseLeave={() => {
                  document.getElementById(this.state.idViewEnderecoDevedor).style.cursor = 'default'
                  this.setState({enderecoDevedor: ENDERECODEVEDORMASCARA}) 
                }}
                onMouseOver={() => { document.getElementById(this.state.idViewEnderecoDevedor).style.cursor = 'pointer' }}
                onClick={() => {
                  this.setState({enderecoDevedor: ENDERECODEVEDOR})
                }}
                title="Visualizar Campo"
              >
              </FaEyeEnderecoDevedor>
              <FaRegCopyEnderecoDevedor 
                id={this.state.idCopyEnderecoDevedor}
                style={{float: 'left'}}
                size="1rem"
                fill={this.state.enderecoColorIcon}
                onClick={() => { 
                  copyTextToClipboard(ENDERECODEVEDOR)
                  this.setState({copiedEnderecoDevedor: true, enderecoColorIcon: 'green'})
                  setTimeout(()=>{
                    this.setState({copiedEnderecoDevedor: false, enderecoColorIcon: '#3e5dc4'})
                  }, 1500)}}
                onMouseOver={() => {
                  document.getElementById(this.state.idCopyEnderecoDevedor).style.cursor = 'pointer'
                }}
                title="Copiar para a área de transferência"
              >
              </FaRegCopyEnderecoDevedor>
            </font>
            <div style={{float: 'left'}}>
              <font className='ficha_letrapretapequena'>
                &nbsp;{this.state.enderecoDevedor}
              </font>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan="2"><b>Endereço Principal do Cliente / Autor</b></td>
          <td><b>Ficha</b></td>
          <td><b>Contrato Legado</b></td>
          <td>
            {(nr_codigo_cliente) ? (
              <b>Contrato Gestão</b>
            ):null}
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            {codigoAuxClienteHTML && ENDERECOCLIENTE && CPFCNPJCLIENTE ? <font className='ficha_letrapretapequena'> {ENDERECOCLIENTE} </font> : null}
          </td>
          <td>
            <FaRegCopyFichaDevedor
              id={this.state.idCopyFichaDevedor}
              style={{float: 'left'}}
              size="1rem"
              fill={this.state.fichaColorIcon}
              onClick={() => {
                copyTextToClipboard(getNumbers(cdProcesso))
                this.setState({copiedFichaDevedor: true, fichaColorIcon: 'green'})
                setTimeout(()=>{
                  this.setState({copiedFichaDevedor: false, fichaColorIcon: '#3e5dc4'})
                }, 1500)}}
              onMouseOver={() => {
                document.getElementById(this.state.idCopyFichaDevedor).style.cursor = 'pointer'
              }}
              title="Copiar para a área de transferência"
            >
            </FaRegCopyFichaDevedor>
            <font className='ficha_letravermelhapequena'>
            &nbsp;<b>{cdProcesso}</b>
            </font>
          </td>
          <td>
            <FaRegCopyContratoLegadoDevedor
              id={this.state.idCopyContratoLegadoDevedor}
              style={{float: 'left'}}
              size="1rem"
              fill={this.state.contratoColorIcon}
              onClick={() => { 
                copyTextToClipboard(getContractInfo2.cd_titulo)
                this.setState({copiedContratoDevedor: true, contratoColorIcon: 'green'})
                setTimeout(()=>{
                  this.setState({copiedContratoDevedor: false, contratoColorIcon: '#3e5dc4'})
                }, 1500)}}
              onMouseOver={() => {
                document.getElementById(this.state.idCopyContratoLegadoDevedor).style.cursor = 'pointer'
              }}
              title="Copiar para a área de transferência"
            >
            </FaRegCopyContratoLegadoDevedor>
            <font className='ficha_letraazulpequena'>
              &nbsp;<b>{getContractInfo2 && nr_codigo_cliente ? getContractInfo2.cd_titulo : getContractInfo2 !== undefined ? getContractInfo2.cd_titulo : 'SEM CONTRATO CADASTRADO'}</b>
            </font>
          </td>
          {(nr_codigo_cliente) ? (
          <td nowrap="true">
            <FaRegCopyContratoGestaroDevedor
              id={this.state.idCopyContratoGestaoDevedor}
              style={{float: 'left'}}
              size="1rem"
              fill={this.state.contratoGestaoColorIcon}
              onClick={() => {
                copyTextToClipboard(nr_codigo_cliente)
                this.setState({copiedContratoGestaoDevedor: true, contratoGestaoColorIcon: 'green'})
                setTimeout(()=>{
                  this.setState({copiedContratoGestaoDevedor: false, contratoGestaoColorIcon: '#3e5dc4'})
                }, 1500)}}
              onMouseOver={() => {
                document.getElementById(this.state.idCopyContratoGestaoDevedor).style.cursor = 'pointer'
              }}
              title="Copiar para a área de transferência"
            >
            </FaRegCopyContratoGestaroDevedor>
            <font className='ficha_letraazulpequena nowrap-text'>
              &nbsp;<b>{getContractInfo2 && nr_codigo_cliente ? nr_codigo_cliente : getContractInfo2 !== undefined ? getContractInfo2.cd_titulo : 'SEM CONTRATO CADASTRADO'}</b>
            </font>
          </td>
          ) : null}
        </tr>
        {cd_avalista !== '' ? //verifica se a ficha contém avalista
          <>
            <tr>
              <td colSpan="2"><b>Avalista</b></td>
              {CPFCNPJAVALISTA.length === 11 ? <td colSpan="3"><b>CPF</b></td> : <td colSpan="3"><b>CNPJ</b></td>}
            </tr>
            <tr>
              <td colSpan="2"><font className='ficha_letraazulpequena'>{cd_avalista} - <b>{AVALISTA}</b></font></td>
              <td colSpan="3"><font className='ficha_letrapequena'>{CPFCNPJAVALISTA}</font></td>
            </tr>
          </>
        : null}
        <tr>
          <td colSpan="5"><b>Acionador(es)</b></td>
        </tr>
        <tr>
          <td rowSpan="99" colSpan="5">
              <table className='TableCob-acionador'>
                <tbody>
                  <tr className='TableCob-backgroundColor'>
                    <td>
                      {cd_cobrador || cd_cobrador2 || cd_cobrador_auxiliar ? 
                      <>
                        {cd_cobrador ? <span className='ficha_letraazulpequena'>{formatSize(0 + cd_cobrador, 10)} - {COBRADOR1} <br /></span> : ''}
                        {cd_cobrador2 ? <span className='ficha_letraazulpequena'>{formatSize(0 + cd_cobrador2, 10)} - {COBRADOR2} <br /></span> : ''}
                        {cd_cobrador_auxiliar ? <span className='ficha_letraazulpequena'>{formatSize(0 + cd_cobrador_auxiliar, 10)} - {COBRADOR3} <br /></span> : ''}
                      </>
                      : <p></p>}
                    </td>
                  </tr>
                </tbody>
              </table>
          </td>
        </tr>
      </>
    );
  }
}