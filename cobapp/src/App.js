import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { validateParamsFromRoute, setCookie } from './utils'
import { getWatermark } from './APISchulze'
import { statusErro, alertErroShow, alertErroClose, blockApp, unblockApp, statusLoading } from './actions'
import { validateAuthentication } from './initialize'
import { Alert } from 'react-bootstrap'
import Historico from './components/Page-Historico'
import Titulo from './components/Page-Titulo'
import Acionamento from './components/Page-Acionamento'
import { PageError } from './components/Page-Erro'
import LoadingOverlay from 'react-loading-overlay'

class App extends Component { 
  constructor(props){
    super(props)
    this.handleDismissErro = this.handleDismissErro.bind(this)
  }

  handleDismissErro = () => { this.props.alertErroClose() }

  UNSAFE_componentWillMount = () => {
    validateAuthentication().then((response)=>{
      if(response.code === 503){
        this.props.statusErro(response.status)
        this.props.alertErroShow()        
      }
    })
    this.props.unblockApp()
  }

  render() { 
    const { loading, overlayOpacity } = this.props.application
    
    if(window.location.pathname === '/titulo'){
      getWatermark()
      .then((response) => {
        // Se tem response, houve sucesos ao gerar marca d'água, senão, a aplicação tratará
        if(response){
          if(response.status === 200){          
            setCookie('watermark', response.src, 1) 
          //  setTimeout(() => {
              document.body.style.backgroundImage = `url('${response.src}')`
          //  }, 1000)
          }else{
            return response.message
          }
        }
      })
    }

    return (
      <>
      {loading && <LoadingOverlay active={loading} className='loadingCob-overlay' text={""} styles={{content: {padding:'10% 0 0 45%'}, wrapper: {opacity: overlayOpacity}}}>
        {this.props.application.alertShowWarning && (
            <div className='DivCob-alert'>
              <Alert variant='warning' >
              <Alert.Heading className='TextCob-alertHeader-Warning'>Atenção!</Alert.Heading>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;{this.props.application.warning}</p>
              </Alert>
            </div>
          )}
          {this.props.application.alertShowError && (
            <div className='DivCob-alert'>
              <Alert variant='danger' onClose={this.handleDismissErro} dismissible >
              <Alert.Heading className='TextCob-alert'>Atenção! Erro App </Alert.Heading>
              <p className='TextCob-alert'>{this.props.application.erro}.<br />
              Acesse novamente essa tela e caso o problema persista entre em contato com o setor de TI através de abertura de chamado no SE.</p>
              </Alert>
          </div>
          )}
       </LoadingOverlay>}       
        <Router>          
          <div className="App">
            <Route exact path="/" component={PageError}/>
            <Route path="/historico" render={() => (
              !validateParamsFromRoute('historico').status ? (
                <Redirect to="/login" />
              ) : (
                <Historico />
              )
            )} />
            <Route path="/login" component={PageError} />
            <Route path="/titulo" render={() => (
              !validateParamsFromRoute('titulo').status ? (
                <Redirect to="/login" />
              ) : (
                <Titulo />
              )
            )} />
            <Route path="/acionamento" render={() => (
              !validateParamsFromRoute('acionamento').status ? (
                <Redirect to="/login" />
              ) : (
                <Acionamento />
              )
            )} />
          </div>
        </Router>
      </>
    )
  }
}

const mapStateToProps = store => ({ 
	application: store.application
})

const mapDispatchToProps = (dispatch) => {
  return {
    statusLoading: (value) => dispatch(statusLoading(value)),
    statusErro: (value) => dispatch(statusErro(value)),
    alertErroShow: (value) => dispatch(alertErroShow(value)),
    alertErroClose: (value) => dispatch(alertErroClose(value)),
    blockApp: (value) => dispatch(blockApp(value)),
    unblockApp: (value) => dispatch(unblockApp(value)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)