import React from "react";

export class Header extends React.Component {

  render() {
    const { floatHeader, headerGrid, button, isCheckable } = this.props
    const fixed = !floatHeader ? '' : ' header-fixed'
    const classHeader  = 'TableCob-header' + fixed

    return ( 
      <tr className={classHeader}>
        {isCheckable ? <th key='first' className='textHeader' width='1%' style={{minWidth: '25px'}}></th> : null}
          {headerGrid !== undefined ? headerGrid.map((header, index) => (
            <th key={index} className='textHeader' style={header.style} >{header.text}</th>
          )) : null}
        {button !== undefined ? <th className='textHeader' width='1%'>{button}</th> : null}
      </tr> 
    )
  }
}