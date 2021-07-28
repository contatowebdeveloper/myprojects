import React from 'react'
import { Form } from 'react-bootstrap'
import Select, { components } from 'react-select'
import Tooltip from '../Tooltip/index'

const CustomOption = ({ children, ...props }) => {
  return (
    <components.Option {...props}>
      <div title={children}>{children}</div>
    </components.Option>
  );
}

class SelectInput extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name: [],
      listValue: null,
      value: null,
      labelWidth: 0,
      selectedOption: null,
    }    
    this.handleChange = this.handleChange.bind(this)
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {    
    if( nextProps.listValueChecked !== this.state.selectedOption ){
      this.setState({ 
        selectedOption: nextProps.listValueChecked
      })
    }
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption })
    if(this.props.callbackHandleChange)
      this.props.callbackHandleChange(selectedOption, false)
}

  render() {
    const { listValue, isMulti, id, maxMenuHeight, closeMenuOnSelect, placeholder, className, isDisabled, isClearable } = this.props
    const { selectedOption } = this.state

    //estilos aplicados diretamente nas propriedades do react-select, link da documentação de estilos https://react-select.com/styles 
    const customStyles = {
      option: (provided) => ({
        ...provided,
        borderBottom: '1px dotted lightgray',
        padding: 6,
        overflowX : 'hidden',
        fontSize : "10px"
      }),
      control: (provided) => ({
        ...provided,
        maxHeight: 75,
        minHeight: 'fit-content',        
      }),
      dropdownIndicator: base => ({
        ...base,
        padding: 1,
      }),
      valueContainer: base => ({
        ...base,
        maxHeight: "2.4rem",
        lineHeight : 1,
        display : 'inline-block',
        overflowY : 'auto',
        fontSize : "10px"
      }),
      clearIndicator: base => ({
        ...base, 
        padding: 1,
      })
    }

    if ( listValue !== undefined && listValue.length === 0){
      return (
        <Form.Group controlId="exampleForm.ControlSelect2">
          <Form.Label>Estamos com problemas para exibir as informações nesse componente.</Form.Label>
        </Form.Group>
      )
    }else{

      return (
        <>
          <Select
            id={id}
            name={id}
            options={listValue}
            components={{ Option: CustomOption }}
            noOptionsMessage={() => ('Sem opções.')}
            value={selectedOption}
            className={className}
            styles={customStyles}
            placeholder={placeholder}
            maxMenuHeight={maxMenuHeight}
            isMulti={isMulti}
            allowSelectAll={true}            
            isDisabled={isDisabled}
            isClearable={isClearable}
            onChange={this.handleChange}
            closeMenuOnSelect={closeMenuOnSelect}
          />
          <Tooltip 
            optionSelected={selectedOption} 
          />
        </>
      );
    }    
  }
}
export default (SelectInput)