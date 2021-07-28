import React from "react";
import { Form } from 'react-bootstrap'

export class FormGroup extends React.Component {
  render() {
    const { label, modalLabelEdit, modalLabelDelete, value, callbackOnChange, className, typeModal } = this.props

    return (
        <Form.Group id="exampleForm.ControlTextarea1">
            {modalLabelDelete && (
                <>
                <ul className='UlCob-modal-inlineFlex'>
                    {modalLabelDelete[0].modalLabelDeleteObj1.map((obj, index) => (
                        <li key={index} className={obj.className} >
                            <font className='LiCob-modal-item'>{obj.item} <br /></font><font className='LiCob-modal-value'>{obj.value}</font>
                        </li>
                    ))}
                </ul>

                <ul className='UlCob-modal'>
                    {modalLabelDelete[1].modalLabelDeleteObj2.map((obj, index) => (
                        <li key={index} className={obj.className} >
                            <font className='LiCob-modal-item'>{obj.item} <br /></font><font className='LiCob-modal-value'>{obj.value}</font>
                        </li>
                    ))}
                </ul>
                </>
            )}
        
            {modalLabelEdit && (
                <ul className='UlCob-modal'>
                    <li className={modalLabelEdit.className} >
                        <font className='LiCob-modal-item'>{modalLabelEdit.item} <br /></font><font className='LiCob-modal-value'>{modalLabelEdit.value}</font>
                    </li>
                </ul> 
            )}  
            {typeModal === 'delete' && (
                <ul className='UlCobTextarea-modal'>
                    <li className={modalLabelDelete[2].modalLabelDeleteObj3.className}>
                        <font className='LiCob-modal-item'>{modalLabelDelete[2].modalLabelDeleteObj3.itemDescricao} <br /></font>
                        <Form.Control 
                            className={modalLabelDelete[2].modalLabelDeleteObj3.className}
                            as="textarea" 
                            rows="3" 
                            id="standard-multiline-flexible"
                            label="Descrição"
                            multiline="true"
                            rowsmax="6"
                            value={modalLabelDelete[2].modalLabelDeleteObj3.valueDescricao}
                            margin="normal"
                            readOnly
                        /> 	
                    </li>
                </ul>
            )}
            <Form.Label className='ModalCob-label'><b>{label}</b></Form.Label>
            <Form.Control 
                className={className}
                as="textarea" 
                rows="3" 
                id="textareaModal"
                label="Descrição"
                multiline="true"
                rowsmax="6"
                value={value}
                onChange={callbackOnChange}
                margin="normal"
            /> 	
        </Form.Group>
    );
  }
}
