import Enzyme, { configure, shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter : new Adapter() })
export { shallow, mount, render }
export default Enzyme

/***** FUNÇÕES DO ENZYME *****/
//função shallow serve para renderizar o componente mas sem incluir os componentes filhos e LifeCycles.
//função render serve para renderizar o componente incluindo os componente filhos mas não executa seus LifeCycles, apenas o método render do componente.
//função Mount serve para renderizar o componente incluindo os componentes filhos e executar seus LifeCycles.
//converte as funções do Enzyme para funcionar com os testes de snapshot do Jest.