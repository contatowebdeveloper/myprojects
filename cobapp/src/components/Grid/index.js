import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button } from 'react-bootstrap'
import Row from './row'
import { Header } from './header'
import { GoInfo } from 'react-icons/go';

class Grid extends Component {

	constructor(props){
		super(props)
		this.state = {
			toggleAll: false,
			registries: [],
			Rows: [],
			modalShow : false
		}
		this.handleChange = this.handleChange.bind(this)
		this.toggleAll = this.toggleAll.bind(this)
	}

	UNSAFE_componentWillReceiveProps = (nextProps) => { this.setState({registries: nextProps.registries}); }
	componentDidMount = () => { this.setState({registries: this.props.registries}); }

	toggleAll = () => {	
		
		let rows = this.props.prefixToToggleRow ? document.getElementsByClassName(this.props.prefixToToggleRow) : document.getElementsByClassName("Clickable")

		for (var i = 0; i < rows.length; i++) {
			let nfileds = rows[i].childNodes.length - 1 > -1 ? rows[i].childNodes.length - 1 : 0;
			rows[i].children[nfileds].children[0].textContent = this.state.toggleAll ? '+' : '-';
		}

		this.setState({toggleAll : !this.state.toggleAll})
	}

	rowStyleFormat = (rowIdx) => ({ backgroundColor: rowIdx % 2 === 0 ? '#F0F0F0' : '#FFFFFF'})

	handleChange = (value) => {
		if(this.props.isCheckable){
			this.props.callbackEventChecked && this.props.callbackEventChecked(value)
		}
	}

	buttonToggleAll = () => {
		const { toggleAll, isToggleRow, hasSubRow} = this.props

		if(toggleAll && isToggleRow && hasSubRow){
			return (
				<div align="right">
					<Button id="btnToggleAll" variant="light" className='ButtonCob-grid' size="sm" onClick={this.toggleAll}>
						<span className='Text-grid-button'>{this.state.toggleAll ? '-' : '+'}</span>
					</Button>
				</div>
			)
		}else{
			return false
		}
	}

	render(){
		const { headerGrid, isCheckable, hasSubRow, isToggleRow, isExpansible, isMultiSelect, panelOpen, totalRegistries, limiter, modeReport, prefixToToggleRow, classNameNoneRegister, floatHeader } = this.props
		let { registries, toggleAll } = this.state

		var classGrid = ''
		if(totalRegistries > limiter && registries.length > 0) {
			classGrid = 'GridCob-WithPager'
		} else {
			classGrid = modeReport ? 'GridCobReport' : 'GridCob'
		}

		const classTbody = !floatHeader ? '' : 'GridCob-HeaderFixed-Tbody'

		return (
			<>
				<Table className={classGrid} size="sm" responsive hover>
					<thead>
						{registries !== 0 && registries.length > 0 ? (
							<Header
								headerGrid={headerGrid}
								button={this.buttonToggleAll()}
								isCheckable={isCheckable}
								panelOpen={panelOpen}
								totalRegistries={totalRegistries}
								limiter={limiter}
								floatHeader={floatHeader}
							/> 
						) : null }
					</thead>
					<tbody className={classTbody}>
					{registries.noResult === undefined ?
						registries !== 0 && registries.length > 0 ? 
							registries.map((registry, index) => (
								<Row
									key={`${index}`}
									keyIndex={`row_${prefixToToggleRow}${index}`}
									id={index}
									rowAlternate={{display: toggleAll ? '' : 'none'}}
									callbackOnChange={(value) => this.handleChange(value)}
									rowStyle={this.rowStyleFormat(index)} 
									altRow={`altRow_${prefixToToggleRow}${index}`} 
									columns={registry.columns}
									subColumns={registry.subColumns}
									toggleAll={toggleAll}
									hasSubRow={hasSubRow}
									isCheckable={isCheckable}									
									isToggleRow={isToggleRow}
									prefixToToggleRow={prefixToToggleRow}
									registryHash={registry.eventHash}
									isExpansible={isExpansible}
									isMultiSelect={isMultiSelect}									
								/>
							)) 
							: 
								<></> 
							:
							<tr className='None-register-table'>
								<td width="100%" colSpan="99">
									<div className={classNameNoneRegister}>
										<div className='divCob-fontawesome-icon'>
											<GoInfo className='iconInfo' />
										</div>
										<div className='divCob-fontawesome-text'>
											<font className='fontCob-awesome-not-register'>Não encontramos nenhum resultado para a sua pesquisa.</font><br />
											<font className='fontCob-awesome'>Verifique se os filtros da pesquisa estão corretos.</font>
										</div>
									</div>
								</td>
							</tr>	
						}			
					</tbody>
				</Table>	
			</>	
		)
	}
}

const mapStateToProps = store => ({ 
	application: store.application
})

export default connect(mapStateToProps)(Grid)