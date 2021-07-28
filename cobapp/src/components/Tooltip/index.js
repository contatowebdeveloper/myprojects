import React, { Component } from 'react'

class Tooltip extends Component {
  constructor(props){
    super(props)
    this.state = {
      optionSelected : []
    }
  }

  componentDidMount = () => ( this.setState({optionSelected: this.state.optionSelected}) )

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { optionSelected } = this.props
    if (nextProps.optionSelected !== optionSelected) {
      var list = nextProps.optionSelected && nextProps.optionSelected.length > 1 ? nextProps.optionSelected : [{label: 5}]    
      this.setState({optionSelected: list})
    }
  }

  render(){
    const { optionSelected } = this.state
    return (
      <>
        {optionSelected.length > 1 ? (
          <div className='HoverCob'>
            <div className='ArrowCob-tooltip'></div>
            <div className='ListCob-tooltip'>
              {optionSelected.length} itens selecionados<br />
              <ul className='LineCob-options'>
                {optionSelected.map((list, i) => (<li key={i}>{list.label}</li>))}
              </ul>
            </div>
          </div>) : 
          ('')
        }
      </>
    )
  }
}

export default (Tooltip)