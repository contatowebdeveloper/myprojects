import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { showModal, clearReport } from '../../actions'
import Grid from '../Grid'

class ModalGridViewer extends Component {
  constructor(props){
    super(props)
    this.handleClose = this.handleClose.bind(this)    
  }

  handleClose = () => { 
    this.props.showModal('modalShowReport', false) 
    this.props.clearReport()
  }

  render() { 
    const { modalShow, title, className, modeReport } = this.props
    let Rows = this.props.Rows ? this.props.Rows : []
    let Header = this.props.Header ? this.props.Header : []
    
    if(Rows.length === 0){
			return (false)
		}else{
      return (
        <>      
          <Modal
						className='ModalCobReport'
						onHide={this.handleClose}
						show={modalShow}
						size="xl"
						aria-labelledby="contained-modal-title-vcenter"
						centered
						autoFocus
            enforceFocus={true} 
					>
						<Modal.Header closeButton={false} className='ModalCob-header'>
							<Modal.Title id="contained-modal-title-vcenter" className={className}>
								<label>{title}</label>
							</Modal.Title>
              <button type="button" onClick={this.handleClose} className="close-modal"><span aria-hidden="true">×</span></button>
						</Modal.Header>
						<Modal.Body className='ModalCob-body'>
              <Grid
                headerGrid={Header}
                isMultiSelect={false}
                registries={Rows}
                isCheckable={false}
                toggleAll={true}
                isToggleRow={true}
                prefixToToggleRow="RptHis_"
                hasSubRow={true}
                isExpansible={true}                
                headerGridFixed={true}
                totalRegistries={Rows.length}
                modeReport={modeReport}
              />
						</Modal.Body>
						<Modal.Footer className={'ModalCob-footer ' + className}>
							Total de registros: {Rows.length}
						</Modal.Footer>
					</Modal>
        </>
      )
    }
  }
}

const mapStateToProps = (store, ownProps) => ({ 
  application:    store.application,    
  modalShow:      store.modal.modalShowReport, 
})

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: (element, modalShow) => dispatch(showModal(element,modalShow)),
    clearReport: () => dispatch(clearReport())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalGridViewer)
