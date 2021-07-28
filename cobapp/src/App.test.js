import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { store } from './store'
import { Provider } from 'react-redux'

/*Função snapshotTesting do Jest serve para armazenar o resultado do teste do componente em textos, para assim serem comparados com o resultado da 
renderização do componente, sendo sempre o mesmo (baseado nos parâmetros), e que nunca deve mudar. */
// Mock do Jest serve par efetuar as funções do componente, exemplo quando queremos verificar se determinada função foi chamada na ação de um click.

it('App renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Provider store={store} ><App /></Provider>, div)
  ReactDOM.unmountComponentAtNode(div)
})