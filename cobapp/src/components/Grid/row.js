import React from "react"
import { Button, Form } from 'react-bootstrap'

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleRow = this.toggleRow.bind(this)
  }

  handleChange = (indexRow, value, keyIndex = null, idBtn = null) => {
    if(this.props.isExpansible && idBtn !== null)
      this.toggleRow(idBtn, keyIndex)

    if(this.props.isCheckable){      
			if(!window.document.getElementById(indexRow).checked)             
        window.document.getElementById(indexRow).checked = true

      this.props.callbackOnChange(value)
    }
  }

  toggleRow = (idBtn, idRow) => {    
    var row = document.getElementById(idRow)
    row.style.display = row.style.display === 'none' ? '' : 'none'    
    let rows = document.getElementById(idBtn).childNodes    
    rows[rows.length-1].childNodes[0].textContent = row.style.display === 'none' ? '+' : '-'
  }

  render() {
    const { columns, hasSubRow, subColumns, registryHash, rowAlternate, rowStyle, altRow, keyIndex, isToggleRow, isCheckable, isExpansible, isMultiSelect, id, prefixToToggleRow } = this.props
    const indexRow = 'Row'+prefixToToggleRow+id
    const className = isCheckable || isExpansible ? (prefixToToggleRow ? prefixToToggleRow + ' Clickable' : 'Clickable') : ''
    let icon = (this.state.isOpen) ? "-" : "+"

    return (
    <React.Fragment key={keyIndex}> 
      <tr id={altRow} style={rowStyle} key={keyIndex} className={className} onClick={() => (this.handleChange(indexRow, registryHash, keyIndex, altRow))}>
      {isCheckable ? (
        <td width="1%">
	      {isMultiSelect ? (
          <div className="CheckboxCob-container circular-container">
            <label className="CheckboxCob-label">
              <input name='checkboxCobGrid' type="checkbox" id={indexRow} value={registryHash} />
              <span className="CheckboxCob-custom circular"></span>
            </label>
          </div>
          ) : (
            <Form.Check name='checkboxCobGrid' type="radio" id={indexRow} value={registryHash} defaultChecked={false} />
          )}
        </td>
      ) : (null)}

      {columns.map((colum, index) => (
        <td key={index} width={colum.width} 
          colSpan={colum.colspan}
          className={colum.className} 
          style={colum.style}
          align={colum.align} >
            {colum.text}
        </td>
      ))}
          
      {isToggleRow && hasSubRow ? (
        <td width="15%" className='Column-description' align="right">
          <Button id={`row_ ${prefixToToggleRow}${registryHash}`} variant="light" className='ButtonCob-grid' size="sm" value={registryHash}>
            {icon}
          </Button>
        </td>
      ) : (null)}

      </tr>

      {hasSubRow && subColumns ? (
      <tr key={keyIndex+'SubRow'} id={keyIndex} style={rowAlternate} className='LineCod-grid-detail-row' onClick={() => (this.handleChange(indexRow, registryHash))}>
        {isCheckable ? (
        <td width="1%">&nbsp;</td>
      ) : (null)}
        {subColumns.map((subRow, index) => (
          <td key={index} width={subRow.width} className={subRow.className} colSpan={subRow.colSpan} style={subRow.style}>{subRow.text}</td>
        ))}
      </tr>
      ) : (null)}
    </React.Fragment>
    )
  }
}

export default (Row)