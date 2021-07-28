import { combineReducers } from 'redux'
import { 
	APP_LOADED,
	ALERT_SUCCESS_SHOW,
	ALERT_SUCCESS_CLOSE,
	ALERT_WARNING_SHOW,
	ALERT_WARNING_CLOSE,
	ALERT_ERRO_SHOW,
	ALERT_ERRO_CLOSE,
	SELECT_CHECKBOX,
	SHOW_MODAL, 
	STATUS_LOADING, 
	STATUS_SUCCESS, 
	STATUS_ERRO, 
	STATUS_WARNING,
	BLOCK_APP,
	UNBLOCK_APP,
	CLEAN_MESSAGES, 
	LIST_EVENTS,
	LIST_EVENTS_TO_REPORT,
	LIST_CALL,
	GET_EVENT, 
	CHECK_EVENT, 
	UPDATE_EVENT, 
	DELETE_EVENT,
	DELETE_EVENT_ENABLED,
	UPDATE_EVENT_ENABLED,
	HIDE_RESULT_COLUMN_CALLS,
	HIDE_RESULT_COLUMN_EVENTS,
	HIDE_DUPLICATES_ROWS_EVENTS,
	SAVE_PARAMS_EVENTS,
	SAVE_PENDING_ACTION,
	LOADING_PENDING_ACTION,
	GET_CONTRACT,
	CLEAR_EVENTS_TO_REPORT,
	DELETE_COOKIES
} from '../actions/actionTypes'
import { getCookie } from '../utils'

const applicationStore = {
	registry: null,
	warning: '',
	alertShowErro: false,
	alertShowSuccess: false,
	alertShowWarning: false,	
	cdProcesso: null,
	cdSec: null,
	pageView: 'Historico',	
	route: '',
	pendingAction: '',
	params: {},
	status: '',
	loading: true,
	appLoaded: 'Carregando...',
	overlayOpacity: 0,
	erro: '',
	modalShowEdit: false,
	modalShowDelete: false,
	modalShowReport: false,
	modalTitle: 'Inserindo Histórico',
	modalLabel: '',	
	operationModal: 'insert',
	showFilters: false,
	showFooter: true,
	operation: null,
	displayButtomInsert: false,
	displayButtomUpdate: false,
	updateEventEnabled: false,
	deleteEventEnabled: false,
	selectCheckbox: false, 
}

const historicoStore = {
	erro: null,	
	eventHash: '',
	eventRowId: '',
	eventDate: '',
	eventId: '',
	eventCode: '',
	eventName: '',
	eventDetail: '',
	timestamp: '',
	userCompany: '',
	userName: '',
	userCode: '',
	totalEvents: 0,
	listOf: [],
	listOfChecked: getCookie('listOfChecked'),
	listStatus: [0],
	listStatusChecked: [0],
	listFase: [0],
	listFaseChecked: [0],
	clearFase: true,
	dataDe: '0',
	dataAte: '0',
	hideResultColumn: false,
	checkHideDuplicatesRowsByColumnsIndex: getCookie('checkHideDuplicatesRowsByColumnsIndex') === 'true' ? true : false,
	recordCount : 0,
	limiter: 500, //Limitador da quantidade de resultados para exibição do paginador
	events: null,
	eventsReport: null,
	noResult: null
}

const acionamentoStore = {
	erro: null,
	calls: null,
	totalCalls: 0,
	listOf: [],
	listOfChecked: getCookie('listOfCheckedCall'),
	listCallBackup: getCookie('listCallBackup') === 'true' ? true : false,
	hideResultColumn: false,
	checkHideResultColumn : getCookie('checkHideResultColumn') === 'true' ? true : false,
	recordCount : 0,
	limiter: 100,
	noResult: null
}

const tituloStore = {
	getContractInfo: '',
	getContractInfo2: '',
	notice: '',
	marking: '',
	cityHoliday: '',	
	recovery: '',
	bancoBV: '',
	bancoPAN: '',
	bancoPANVeiculo: '',
	logBatimentoPAN: '',
	bradescoagencia: '',
	dadosSantander: '',
	dadosBradesco: '',
	dadosParcela: '',
	dadosGarantia: '',
	dadosDespesa: '',
	dadosSomaDespesa: '',
	dadosDespesaVencer: '',
	AGENCIACONTABRADESCO: '',
	AVALISTA: '',
	CDGRUPOCLI: '',
	CDGRUPODEV: '',
	CLIENTE: '',
	COBRADOR1: '',
	COBRADOR2: '',
	COBRADOR3: '',
	CPFCNPJAVALISTA: '',
	CPFCNPJDEVEDOR: '',
	CTUBB: '',
	DEVEDOR: '',
	EACAOCONTRA: '',
	ENDERECODEVEDOR: '',
	ENDERECODEVEDORMASCARA: '',
	GRUPOCLIENTENOME: '',
	MARCACAO: '',
	STATE: '',
	cd_alerta: '',
	cd_avalista: '',
	cd_causa_abn: '',
	cd_cliente: '',
	cd_cobrador: '',
	cd_cobrador2: '',
	cd_cobrador_auxiliar: '',
	cd_devedor: '',
	cd_rating_pan: '',
	cd_regiao_abn: '',
	de_bvdoc: '',
	de_bvmais: '',
	de_dados_sicoob: '',
	de_loja: '',
	de_obs_loja: '',
	de_observacao: '',
	dt_cadastro: '',
	dt_judicial: '',
	fl_calculo_geral: '',
	fl_cedidos_bv: '',
	fl_revisional: '',
	nr_codigo_cliente: '',
	ENDERECOCLIENTE: '',
	CPFCNPJCLIENTE: '',
	BloqueioDiscagemTemporario: ''
}

function application (state=applicationStore, action) {
	switch(action.type) {		
		case ALERT_SUCCESS_SHOW:
			return {
				...state,
				alertShowSuccess: true,
				warning: action.value
			}
		case ALERT_SUCCESS_CLOSE:
			return {
				...state,
				alertShowSuccess: false,
				warning: ''
			}
		case ALERT_WARNING_SHOW:
			return {
				...state,
				alertShowWarning: true,
				loading: true,
				appLoaded: ''
			}
		case ALERT_WARNING_CLOSE:
			return {
				...state,
				alertShowWarning: false,
				warning: ''
			}
		case ALERT_ERRO_SHOW:
			return {
				...state,
				alertShowErro: true,
				appLoaded: '',
			}
		case ALERT_ERRO_CLOSE:
			return {
				...state,
				alertShowErro: false,
				erro: ''
			}
		case STATUS_LOADING:
			return {
				...state,
				loading: action.value,
			}
		case STATUS_SUCCESS:
			return {
				...state,
				status: action.status,
				erro: '',
				warning: ''
			}
		case APP_LOADED:
			return {
				...state,
				status: action.status,
				alertShowErro: false,
				erro: '',
				loading: false
			}
		case STATUS_ERRO:
			return {
				...state,
				status: action.status,
				erro: action.erro
			}
		case STATUS_WARNING:
			return {
				...state,
				status: action.status,
				warning: action.warning,
				erro: '',
			}
		case CLEAN_MESSAGES:
			return {
				...state,
				erro: '',
				warning: ''
			}
		case UPDATE_EVENT_ENABLED:
			return {
				...state,
				updateEventEnabled: action.value
			};
		case DELETE_EVENT_ENABLED:
			return {
				...state,
				deleteEventEnabled: action.value
			}
		case UPDATE_EVENT:
		case DELETE_EVENT:
			return {
				...state,				
				updateEventEnabled: false,
				deleteEventEnabled: false,
				status: 'SUCCESS',
				alertShowSuccess: true,
				warning: action.message
			}
		case SELECT_CHECKBOX:
			return {
				...state,
				selectCheckbox: action.status,
				updateEventEnabled: false,
				deleteEventEnabled: false,
			}
		case SAVE_PENDING_ACTION:
			return {
				...state,
				params: action.params,
				pendingAction: action.action,
				route: action.route
			}
		case LOADING_PENDING_ACTION:
			return {
				...state,
				pendingAction: null,
				route: null,
				params: null
			}
		case BLOCK_APP:
			return {
				...state,
				loading: true,
				overlayOpacity: 0,
			}
		case LIST_EVENTS:
		case LIST_CALL:
		case GET_CONTRACT:
		case UNBLOCK_APP:
			return {
				...state,
				loading: false,
				overlayOpacity: 1,
			}
		default:
			return state
	}
}

export const modal = (state=applicationStore, action) => {
	switch(action.type){		
		case SHOW_MODAL:
			return {
				...state,
				[action.element]: action.modalShow
			}		
		default:
			return state
	}
}

export const historico = (state = historicoStore, action) => {
	switch (action.type) {
		case CHECK_EVENT:

			let events = state.events

			var event =  events.filter(function(event) {
				return event.eventHash === action.value.eventHash
			});

			return {
				...state,
				updateEventEnabled: action.value.update,
				deleteEventEnabled: action.value.delete,
				eventHash: action.value.eventHash,
				eventRowId: action.value.eventRowId,
				eventCode: event[0].eventCode,
				eventId: event[0].eventId,
				eventDate: event[0].eventDate,
				eventDetail: event[0].eventDetail,
				eventName: event[0].eventName,
				timestamp: event[0].timestamp,
				userCompany: event[0].userCompany,
				userName: event[0].userName,
				userCode: event[0].userCode,
			}
		case GET_EVENT:
			return {
				...state,
				eventCode: action.eventCode,
				eventId: action.eventId,
				eventDate: action.eventDate,
				eventDetail: action.eventDetail,
				eventName: action.eventName,				
				timestamp: action.timestamp,
				userCompany: action.userCompany,
				userName: action.userName,
				userCode: action.userCode,
			}
		case LIST_EVENTS:
			const withoutRecordCount = {
				...state,
				events: action.events,
				listOfChecked: action.listOfChecked,
				totalEvents: action.events.length,
				offset: action.offset,
				noResult: action.noResult
			}	
			return action.recordCount ? ({...withoutRecordCount, recordCount : action.recordCount}) : (withoutRecordCount)
		case LIST_EVENTS_TO_REPORT:
			const recordSet = {
				...state,
				eventsReport: action.eventsReport				
			}	
			return action.recordCount ? ({...recordSet}) : (recordSet)
		case CLEAR_EVENTS_TO_REPORT:
			return ({
				...state,
				eventsReport: null
			})	
		case DELETE_COOKIES:
			return ({
				...state,
				checkHideDuplicatesRowsByColumnsIndex: false,
			})
		case UPDATE_EVENT:			
			return {
				...state,
				events: state.events.map((event) => {
					if(event.eventHash === action.event.eventHash) {
						return {
							...event, 
							eventDetail: action.event.eventDetail,
							eventId: action.event.eventId,
							eventCode: action.event.eventCode,
							eventName: action.event.eventName,
							eventHash: action.event.eventHash, 
							userCodeUpdated: action.event.userCodeUpdated,
							userNameUpdated: action.event.userNameUpdated,
							eventDateUpdated: action.event.eventDateUpdated,
						}
					}
					return event
				}),
			};
		case DELETE_EVENT:
			return {
				...state,
				events: state.events.filter((event) => event.eventHash !== action.eventHash),
			}
		/*
		case CHECK_EVENT:
			return {
				...state,
				eventHash: action.value,
				eventCode: '',
				eventId: '',
				eventDate: '',
				eventDetail: '',
				eventName: '',
				timestamp: '',
				userCompany: '',
				userName: '',
				userCode: '',				
			}		
		*/
		case HIDE_RESULT_COLUMN_EVENTS:
			return {
				...state,
				hideResultColumn: action.value
			}
		case HIDE_DUPLICATES_ROWS_EVENTS:			
			return {
				...state,
				checkHideDuplicatesRowsByColumnsIndex: !action.value
			}
		case SAVE_PARAMS_EVENTS:
			return {
				...state,
				listOfChecked: action.listOfChecked,
				dataDe: action.dataDe,
				dataAte: action.dataAte,
				listStatus: action.listStatus,
				listFase: action.listFase,
			}
	  	default:
			return state
	}
}

export const acionamento = (state = acionamentoStore, action) => {
	switch (action.type){
		case LIST_CALL:
			const withoutRecordCount = {
				...state,
				calls: action.calls,
				listOfChecked: action.listOfChecked,
				totalCalls: action.calls.length,
				listCallBackup: !action.params.listCallBackup,
				offset: action.offset,
				noResult: action.noResult
			}

			return action.recordCount ? ({...withoutRecordCount, recordCount : action.recordCount}) : (withoutRecordCount)
		case HIDE_RESULT_COLUMN_CALLS:
			return {
				...state,
				checkHideResultColumn: !action.value
			}
		default:
			return state
	}
}

export const titulo = (state = tituloStore, action) => {
	switch(action.type){
		case GET_CONTRACT : 
			return {
				...state,
				getContractInfo: action.value.informacoes,
				getContractInfo2: action.value.informacoes2,
				notice: action.value.avisos,
				marking: action.value.marcacao,
				cityHoliday: action.value.feriado,				
				recovery: action.value.recovery,
				bancoBV: action.value.bancoBV,
				bancoPAN: action.value.bancoPAN,
				bancoPANVeiculo: action.value.bancoPANVeiculo,
				logBatimentoPAN: action.value.logBatimentoPAN,
				bradescoagencia: action.value.bradescoagencia,
				dadosSantander: action.value.dadosSantander,
				dadosBradesco: action.value.dadosBradesco,
				dadosParcela: action.value.dadosParcela,
				dadosGarantia: action.value.dadosGarantia,
				dadosDespesa: action.value.dadosDespesa,
				dadosSomaDespesa: action.value.dadosSomaDespesa,
				dadosDespesaVencer: action.value.dadosDespesaVencer,
				AGENCIACONTABRADESCO: action.value.AGENCIACONTABRADESCO,
				AVALISTA: action.value.AVALISTA,
				CDGRUPOCLI: action.value.CDGRUPOCLI,
				CDGRUPODEV: action.value.CDGRUPODEV,
				CLIENTE: action.value.CLIENTE,
				COBRADOR1: action.value.COBRADOR1,
				COBRADOR2: action.value.COBRADOR2,
				COBRADOR3: action.value.COBRADOR3,
				CPFCNPJAVALISTA: action.value.CPFCNPJAVALISTA,				
				CTUBB: action.value.CTUBB,				
				EACAOCONTRA: action.value.EACAOCONTRA,
				ENDERECODEVEDOR: action.value.ENDERECODEVEDOR,
				ENDERECODEVEDORMASCARA: action.value.ENDERECODEVEDORMASCARA,
				GRUPOCLIENTENOME: action.value.GRUPOCLIENTENOME,
				MARCACAO: action.value.MARCACAO,
				STATE: action.value.STATE,
				cd_alerta: action.value.cd_alerta,
				cd_avalista: action.value.cd_avalista,
				cd_causa_abn: action.value.cd_causa_abn,
				cd_cliente: action.value.cd_cliente,
				cd_cobrador: action.value.cd_cobrador,
				cd_cobrador2: action.value.cd_cobrador2,
				cd_cobrador_auxiliar: action.value.cd_cobrador_auxiliar,
				cd_devedor: action.value.cd_devedor,
				cd_rating_pan: action.value.cd_rating_pan,
				cd_regiao_abn: action.value.cd_regiao_abn,
				de_bvdoc: action.value.de_bvdoc,
				de_bvmais: action.value.de_bvmais,
				de_dados_sicoob: action.value.de_dados_sicoob,
				de_loja: action.value.de_loja,
				de_obs_loja: action.value.de_obs_loja,
				de_observacao: action.value.de_observacao,
				dt_cadastro: action.value.dt_cadastro,
				dt_judicial: action.value.dt_judicial,
				fl_calculo_geral: action.value.fl_calculo_geral,
				fl_cedidos_bv: action.value.fl_cedidos_bv,
				fl_revisional: action.value.fl_revisional,
				nr_codigo_cliente: action.value.nr_codigo_cliente,
				ENDERECOCLIENTE: action.value.ENDERECOCLIENTE,
				CPFCNPJCLIENTE: action.value.CPFCNPJCLIENTE,
				DEVEDOR: action.value.DEVEDOR,
				CPFCNPJDEVEDOR: action.value.CPFCNPJDEVEDOR,
				NOMEDEVEDORMASCARA: action.value.NOMEDEVEDORMASCARA,
				CPFCNPJDEVEDORMASCARA: action.value.CPFCNPJDEVEDORMASCARA,
				NOMECLIENTEMASCARA: action.value.NOMECLIENTEMASCARA,
				BloqueioDiscagemTemporario: action.value.BloqueioDiscagemTemporario,
			}			
		default:
			return state
	}
}

export default combineReducers({	
	application, 
	modal,	
	historico, 
	acionamento, 
	titulo,	
})
