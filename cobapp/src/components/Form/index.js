import React from 'react'
import { Form, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { showModal, cleanMessages } from '../../actions'
import { unSelectAll } from '../../utils'
import { FormGroup } from './formGroup'
import Button from '../Button'
import { AiOutlineWarning, AiOutlineQuestionCircle } from 'react-icons/ai'

class FormDialog extends React.Component {
	constructor(props){
		super(props)
    	this.state = {  
			modalShow: true,
			value: '',
			ok: false,
			warningConfirmShow: false,
			warningText: '',
			warningAlertShow: false,
			alertShow : false
		}
		this.handleClose = this.handleClose.bind(this)
		this.handleClickSubmit = this.handleClickSubmit.bind(this)
		this.warningConfirmClose = this.warningConfirmClose.bind(this)
		this.handleDismissWarning = this.handleDismissWarning.bind(this)
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => ( this.setState({value: nextProps.value, warningText: this.props.warningConfirmText}) )

	handleChange = name => event => ( this.setState({ [name]: event.target.value }) )
	warningConfirmClose = () => this.setState({ warningConfirmShow: false })
	handleDismissWarning = () => ( this.setState({ alertShow : false }) )

	handleClose = (event) => {
		this.setState({ eventDetail: '', warningConfirmShow: false })
		unSelectAll()
		this.props.onHide()
	}

	handleClickSubmit = (required, typeModal) => {
		if(document.getElementById("textareaModal").value === '' && required && typeModal === 'edit') {
			this.setState({ alertShow : true })
		} else if (document.getElementById("textareaModal").value === '' && required && typeModal === 'delete'){
			this.setState({ alertShow : true })
		} else {
			if(this.props.warningConfirm){
				this.setState({warningConfirmShow: true, warningText: this.props.warningConfirmText})
			}else{
				this.props.callbackClickSubmit(this.state.value)
			}
		}
	}

	handleClickConfirm = (event) => {
		this.props.callbackClickSubmit(this.state.value)
		this.handleClose()
	}

	render() {
		const { onEnter, modalShow, enforceFocus, modalTitle, placeholder, buttonSubmitLabel, label, modalLabelEdit, modalLabelDelete, typeModal, required, className, title, textExclusion, classNameButton } = this.props
		const { warningConfirmShow, warningText, alertShow } = this.state
		
		const value = this.state.value

		if(this.props.application.alertShowErro){
			return (false)
		}else{ 
			return (
				<>
					<Modal 
						className='ModalCob'
						onHide={this.handleClose}
						onEnter={onEnter}
						show={modalShow}
						size="lg"
						aria-labelledby="contained-modal-title-vcenter"
						centered
						autoFocus
						enforceFocus={enforceFocus}
					>
						<Modal.Header className='ModalCob-header'>
							<Modal.Title id="contained-modal-title-vcenter" className={title}>
								<label>{modalTitle}</label>
							</Modal.Title>
							<Button onClick={this.handleClose} className="close-modal" tagSpan={<><span aria-hidden="true">×</span></>}></Button>
						</Modal.Header>
						<Modal.Body className='ModalCob-body'>
							<Form>
								<FormGroup
									label={label}
									modalLabelEdit={modalLabelEdit}
									modalLabelDelete={modalLabelDelete}
									value={value} 
									callbackOnChange={this.handleChange('value')} 
									placeholder={placeholder}
									className={className}
									typeModal={typeModal}
								/>
							</Form>
						</Modal.Body>						
						<Modal.Footer className='ModalCob-footer'>
							<Button onClick={() => this.handleClickSubmit(required, typeModal)} className={'ButtonCob-modal-' + classNameButton} textButton={buttonSubmitLabel} />
							<Button onClick={this.handleClose} className='ButtonCob-modal-secondary' textButton='Cancelar' />
						</Modal.Footer>
					</Modal>

					{alertShow && (
						<Modal
							className='ModalCob-confirm'
							size="sm"
							show={alertShow}
							onHide={this.handleDismissWarning}
							aria-labelledby="modal-title-sm"
							centered
						>
							<Modal.Header closeButton className='ModalCob-header'>
								<Modal.Title id="modal-title-sm" className='ModalCob-title'>
									Atenção!
								</Modal.Title>
							</Modal.Header>
							<Modal.Body className='ModalCob-body'>
								<div className='divToTable'>
									<div className='divToTable-Row'>
										<div className='divToTable-Cell'>
											<AiOutlineWarning className='iconInfo' />
										</div>									
										<div className='divToTable-Cell warningText'>
											{textExclusion}
										</div>
									</div>
								</div>								
							</Modal.Body>
						</Modal>
					)}

					{warningConfirmShow && (
						<Modal
							className='ModalCob-confirm'
							size="sm"
							show={warningConfirmShow}
							onHide={this.warningConfirmClose}
							aria-labelledby="modal-title-sm"
							centered
						>
							<Modal.Header closeButton className='ModalCob-header'>
								<Modal.Title id="modal-title-sm" className='ModalCob-title'>
									Atenção!
								</Modal.Title>
							</Modal.Header>
							<Modal.Body className='ModalCob-body'>
								<div className='divToTable'>
									<div className='divToTable-Row'>
										<div className='divToTable-Cell'>
											<AiOutlineQuestionCircle className='iconInfo' />
										</div>									
										<div className='divToTable-Cell confirmText'>
											{warningText}
										</div>
									</div>
								</div>
							</Modal.Body>
							<Modal.Footer className='ModalCob-footer'>
								<Button onClick={this.handleClickConfirm} className={'ButtonCob-modal-' + classNameButton} textButton='Confirmar' />
								<Button onClick={this.handleClose} className='ButtonCob-modal-secondary' textButton='Cancelar' />
							</Modal.Footer>
						</Modal>
					)}
					
				</>
			)
		}
	}
}
const mapStateToProps = store => ({ 
	application: store.application,
})
const mapDispatchToProps = (dispatch) => {
	return {
		showModal: (element, modalShow) => dispatch(showModal(element, modalShow)),
		cleanMessages: () => dispatch(cleanMessages())
	}
}
export default (connect(mapStateToProps, mapDispatchToProps)(FormDialog))