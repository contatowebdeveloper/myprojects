import { 
	glbUsuario, 
	codigoAcesso, 
	codeSeg3120,
	codeSeg3121,
	codeSeg3122,
	codeSeg3123,
	codeSeg3124,
	isCobsystem,
	pathName
} from '../globals'
import { 
	listEvents as callListEvents, 
	listCall as callListCall, 
	getEvent as callGetEvent,
	updateEvent as callUpdateEvent,
	deleteEvent as callDeleteEvent,
	getContract as callGetContract,
	autoAuthentication,
	checkToken,
	registerPrivateToken,
} from '../APISchulze'
import { str_pad, base64_encode, base64_decode, date_diff, setCookie, deleteCookie } from "../utils"
import { 
	STATUS_LOADING,
	STATUS_SUCCESS,
	STATUS_ERRO,
	STATUS_WARNING,
	CLEAN_MESSAGES,	
	ALERT_SUCCESS_SHOW,
	ALERT_SUCCESS_CLOSE,
	ALERT_ERRO_SHOW,
	ALERT_ERRO_CLOSE,
	ALERT_WARNING_SHOW,
	ALERT_WARNING_CLOSE,
	SELECT_CHECKBOX,
	LIST_EVENTS, 
	LIST_EVENTS_TO_REPORT, 
	LIST_CALL,
	SHOW_MODAL,
	CHECK_EVENT,
	GET_EVENT,
	UPDATE_EVENT,
	DELETE_EVENT,	
	UPDATE_EVENT_ENABLED,
	DELETE_EVENT_ENABLED,
	APP_LOADED,
	HIDE_RESULT_COLUMN_EVENTS,
	HIDE_RESULT_COLUMN_CALLS,
	HIDE_DUPLICATES_ROWS_EVENTS,
	SAVE_PARAMS_EVENTS,
	SAVE_PENDING_ACTION,
	LOADING_PENDING_ACTION,
	GET_CONTRACT,
	BLOCK_APP,
	UNBLOCK_APP,
	CLEAR_EVENTS_TO_REPORT,
	DELETE_COOKIES
} from './actionTypes'

export function cleanMessages (){
	return {
		type: CLEAN_MESSAGES
	}
}

export function statusLoading (value){
	return {
		type: STATUS_LOADING,
		value: value
	}
}

export function appLoaded (value){
	return {
		type: APP_LOADED, 
		status: value
	}
}

export function statusSuccess (){
	return {
		type: STATUS_SUCCESS,
		status: 'SUCCESS'
	}
}

export function statusErro (erro){
	return {
		type: STATUS_ERRO,
		status: 'ERRO',
		erro: erro
	}
}

export function statusWarning (warning){
	return {
		type: STATUS_WARNING,
		status: 'WARNING',
		warning: warning
	}
}

export function blockApp (){
	return {
		type: BLOCK_APP
	}
}

export function unblockApp (){
	return {
		type: UNBLOCK_APP
	}
}

export function clearReport () {
	return {
		type: CLEAR_EVENTS_TO_REPORT
	}
}

export function hideResultColumnEvents (value){
	return {
		type: HIDE_RESULT_COLUMN_EVENTS,
		value: value
	}
}

export function hideResultColumnCalls (value){
	setCookie('checkHideResultColumn', !value, 1)
	return {
		type: HIDE_RESULT_COLUMN_CALLS,
		value: value
	}
}

export function handleHideDuplicatesRowEvents (value){
	setCookie('checkHideDuplicatesRowsByColumnsIndex', !value, 1)
	return {
		type: HIDE_DUPLICATES_ROWS_EVENTS,
		value: value
	}
}

export const enableUpdateEvent = (value) => ({
	type: UPDATE_EVENT_ENABLED,
	value: value
})

export const enableDeleteEvent = (value) => ({
	type: DELETE_EVENT_ENABLED,
	value: value
})

export const alertErroShow = () => ({
	type: ALERT_ERRO_SHOW,
})

export const alertErroClose = () => ({
	type: ALERT_ERRO_CLOSE
})

export const alertSuccessShow = (value) => ({
	type: ALERT_SUCCESS_SHOW,
	value: value
})

export const alertSuccessClose = () => ({
	type: ALERT_SUCCESS_CLOSE
})

export const alertWarningShow = () => ({
	type: ALERT_WARNING_SHOW,
})

export const alertWarningClose = () => ({
	type: ALERT_WARNING_CLOSE
})


export const deleteCookies = () => {
	deleteCookie('checkHideDuplicatesRowsByColumnsIndex')
	return ({
		type: DELETE_COOKIES
	})
}

export const selectCheckbox = (status) => {
	return function (dispatch){
		dispatch({
			type: SELECT_CHECKBOX,
			status: status
		})
	}
}

export const saveParamsEvents = (params, route) => {
	return function (dispatch){
		if(route === 'historico' || route === 'acionamento'){
			dispatch({
				type: SAVE_PARAMS_EVENTS,
				listOfChecked: params.index,
				dataDe: params.dataDe,
				dataAte: params.dataAte,
				listStatus: params.listStatus,
				listFase: params.listFase
			})
		} else {
			dispatch({
				type: SAVE_PARAMS_EVENTS,
				cdProcesso: params.cdProcesso,
				nMostarEnderecoCliente: params.nMostarEnderecoCliente,
			})
		}
	}
}

export const saveActionPending = (action, params, route) => {
	return function(dispatch) {
		dispatch({
			type: SAVE_PENDING_ACTION,
			route: route,
			action: action,
			params: params
		})
	}
}

export const loadActionPending = (action, params, route) => {
	return function(dispatch){		
		if(localStorage.getItem('accessTimeout') === "false"){			
			switch(action){
				case 'listEvents':
						dispatch( listEvents(params) )
					break;				
				case 'getEvent':
						dispatch( getEvent(params) )
					break;
				case 'checkEvent':
						dispatch( checkEvent(params) )
					break;
				case 'listCall':
						dispatch( listCall(params) )
					break;
				case 'getContract':
						dispatch( getContract(params) )
					break;
				default: 
					return
			}
		}
		dispatch({
			type: LOADING_PENDING_ACTION
		})
	}
}

export const listEvents = (params) => {
	return function (dispatch){

		if(params.reloadSearch !== true){
			dispatch( statusLoading(true) )
		}

		return callListEvents( params.index, params.cdProcesso, params.dataDe, params.dataAte, params.listStatus, params.listFase, params.offset, params.limiter )
			.then((response) => {				
				if(response && response.status !== 403){
					
					if(params.reloadSearch !== true){
						dispatch( statusLoading(false) )
					}
					var events = response.totalEvents !== 0 ? response.events.map((event) => (
						{
							...event, 
							eventHash : base64_encode(params.cdProcesso + event.eventDate.replace(/\//g, "") + str_pad(event.eventCode, 3, "0", "STR_PAD_LEFT") + str_pad(event.eventId, 3, "0", "STR_PAD_LEFT") + str_pad(glbUsuario, 10, " ", "STR_PAD_LEFT") + str_pad(codigoAcesso, 10, "0", "STR_PAD_LEFT") + event.timestamp + str_pad(event.userCode, 10, "0", "STR_PAD_LEFT"))
						}
					 )) : events = 0

					setCookie('listOfChecked', params.index, 1)

					const resultWithoutOffset = {
						type: LIST_EVENTS,
						events: events,
						listOfChecked: params.index,
						totalEvents: events.length,
						offset: response.offset,
						noResult: events.length > 0 ? false : true
					}

					const result = typeof params.offset !== "number" ? { ...resultWithoutOffset, recordCount: response.totalEvents } : resultWithoutOffset

					dispatch(result)
				}else{
					if(response.status === 403) {
						dispatch( reloadCredentials() )
			
						setTimeout(() => (
							dispatch( saveActionPending('listEvents', params, 'historico') )
						), 1000)
						
						setTimeout(() => (
							dispatch( loadActionPending('listEvents', params, 'historico') )
						), 1000)						
					} else {
						dispatch( statusLoading(false) )
						dispatch( statusWarning(response.message) )
						dispatch( alertWarningShow() )
					}
				}
			})
			.catch((error) => {
				dispatch( statusLoading(false) )
				dispatch( statusErro("Problema no sistema.") )
				dispatch( alertErroShow() )
			})
	}
}

export const listEventsToReport = (params) => {
	return function (dispatch){

		dispatch( statusLoading(true) )

		return callListEvents( params.index, params.cdProcesso, params.dataDe, params.dataAte, params.listStatus, params.listFase, params.offset, params.limiter )
			.then((response) => {
				if(response && response.status !== 403){
					dispatch( statusLoading(false) )
					var events = response.totalEvents !== 0 ? response.events.map((event) => (
						{
							...event, 
							eventHash : base64_encode(params.cdProcesso + event.eventDate.replace(/\//g, "") + str_pad(event.eventCode, 3, "0", "STR_PAD_LEFT") + str_pad(event.eventId, 3, "0", "STR_PAD_LEFT") + str_pad(glbUsuario, 10, " ", "STR_PAD_LEFT") + str_pad(codigoAcesso, 10, "0", "STR_PAD_LEFT") + event.timestamp + str_pad(event.userCode, 10, "0", "STR_PAD_LEFT"))
						}
					 )) : events = 0

					const resultWithoutOffset = {
						type: LIST_EVENTS_TO_REPORT,
						eventsReport: events,
						totalEvents: events.length
					}

					const result = typeof params.offset !== "number" ? { ...resultWithoutOffset, recordCount: response.totalEvents } : resultWithoutOffset

					dispatch(result)

				}else{
					if(response.status === 403) {
						dispatch( reloadCredentials() )
			
						setTimeout(() => (
							dispatch( saveActionPending('listEventsToReport', params, 'historico') )
						), 1000)
						
						setTimeout(() => (
							dispatch( loadActionPending('listEventsToReport', params, 'historico') )
						), 1000)						
					} else {
						dispatch( statusLoading(false) )
						dispatch( statusWarning(response.message) )
						dispatch( alertWarningShow() )
					}
				}
			})
			.catch((error) => {
				dispatch( statusLoading(false) )
				dispatch( statusErro("Problema no sistema.") )
				dispatch( alertErroShow() )
			})
	}
}

export const listCall = (params) => {
	return function (dispatch){
		if(params.reloadSearch !== 'undefined' && params.reloadSearch !== true){
			dispatch( statusLoading(true) )
		}

		return callListCall(params.index, params.cdProcesso, params.dataDe, params.dataAte, params.listStatus, params.listFase, params.filterCall, params.listCallBackup, params.offset, params.limiter)
		.then((response) => {
			if(response.status !== 403){		
				if(params.reloadSearch !== true){
					dispatch( statusLoading(false) )
				}

				var calls = response.totalCalls !== 0 ? response.calls.map((event) => ( 
					{ ...event } 
				)) : calls = 0

				setCookie('listOfCheckedCall', params.index, 1)
				setCookie('listCallBackup', params.listCallBackup, 1)
				
				const resultWithoutOffset = {
					type: LIST_CALL,
					params: params,
					calls: calls,
					listOfChecked: params.index,
					totalCalls: calls.length,
					offset: response.offset,
					noResult: calls.length > 0 ? false : true
				}

				const result = typeof params.offset !== "number" ? { ...resultWithoutOffset, recordCount: response.totalCalls } : resultWithoutOffset

				dispatch(result)
			}else{
				if(response.status === 403) {
					dispatch( reloadCredentials() )
			
					setTimeout(() => (
						dispatch( saveActionPending('listCall', params, 'acionamento') )
					), 100)
					
					setTimeout(() => (
						dispatch( loadActionPending('listCall', params, 'acionamento') )
					), 100)						
				} else {
					dispatch( statusLoading(false) )
					dispatch( statusWarning(response.message) )
					dispatch( alertWarningShow() )
				}
			}
		})
		.catch((error) => {
			dispatch( statusLoading(false) )
			dispatch( statusErro("Problema no sistema.") )
			dispatch( alertErroShow() )
		})	
	}
}

export const getEvent = (eventHash) => {	
	return function (dispatch){

		return callGetEvent(eventHash)
			.then((response) => {
				if(response){
					dispatch({
						type: GET_EVENT,
						eventCode: response['event'].eventCode,
						eventId: response['event'].eventId,
						eventDate: response['event'].eventDate,
						eventDetail: response['event'].eventDetail,
						eventName: response['event'].eventName,
						timestamp: response['event'].timestamp,
						userCompany: response['event'].userCompany,
						userName: response['event'].userName,
						userCode: response['event'].userCode,
					})
				}else{
					if(response.status === 403) {
						dispatch( reloadCredentials() )

						setTimeout(() => (
							dispatch( saveActionPending('getEvent', eventHash, 'historico') )
						), 1000)
						
						setTimeout(() => (
							dispatch( loadActionPending('getEvent', eventHash, 'historico') )
						), 1000)

					} else {
						dispatch( statusLoading(false) )
						dispatch( statusWarning(response.message) )
						dispatch( alertWarningShow() )
					}
				}
			})
			.catch((error) => {
				dispatch( statusLoading(false) )
				dispatch( statusErro("Problema no sistema.") )
			})
	}
}

export function updateEvent (event){
	return function (dispatch){

		return callUpdateEvent(event)
			.then((response) => {
				
				if(!response.ok){
					if(response.status === 403) {
						dispatch( reloadCredentials() )
					} else if(response.status === 200){
						
						const eventUpdated = {
							...event,
							eventDateUpdated: response.dados.eventDateUpdated,
							userCodeUpdated: response.dados.userCodeUpdated,
							userNameUpdated: response.dados.userNameUpdated
						}
						
						dispatch( {
							type: UPDATE_EVENT,
							event: eventUpdated,
							message: 'Histórico atualizado com sucesso.'
						} )
						setTimeout(()=>{ 
							dispatch(alertSuccessClose()) 
						}, 5000)
					}else{
						dispatch( statusErro(response.message) )
						dispatch( alertErroShow() )
					}
				}
			})
			.catch((error) => {
				dispatch( statusLoading(false) )
				dispatch( statusErro("Problema no sistema.") )
				dispatch( alertErroShow() )
			})
	}
}

export function deleteEvent (eventHash, eventReason){
	return function (dispatch){
		
		return callDeleteEvent(eventHash, base64_encode(eventReason))
			.then((response) => {
				if(!response.ok){
					if(response.status === 403) {
						dispatch( reloadCredentials() )
					} else {
						dispatch( statusErro(response.message) )
						dispatch( alertErroShow() )
					}
				}else{
					dispatch( {
						type: DELETE_EVENT,
						eventHash: eventHash,
						message: 'Histórico excluído com sucesso.'
					} )				

					setTimeout(()=>{ 
						dispatch(alertSuccessClose()) 
					}, 5000)
				}
			})
			.catch((error) => {
				dispatch( statusErro("Problema no sistema.") )
				dispatch( alertErroShow() )
			})
	}
}

export const showModal = (element, modalShow) => ({
  type: SHOW_MODAL,
  element: element,
  modalShow: modalShow
})

export const checkEvent = (eventHash, eventRowId) => {
	return function (dispatch){	

	let deleteEnabled = false
	let updateEnabled = false
	let hash = base64_decode(eventHash)
	let date = new Date()
	let month = date.getMonth() + 1
	let nowDate = date.getFullYear() + '-' + month + '-' + date.getDate()
	let eventDate = hash.substr(14, 4) + '-' + hash.substr(12, 2) + '-' + hash.substr(10, 2)
	let cdCriacao = hash.substr(67, 10)
	
	if (codeSeg3122 === false && date_diff(eventDate, nowDate) > 5) // TEM PERMISSAO DE ALTERAR E NAO PODE ALTERAR APOS 5 DIAS
	{ 
		updateEnabled = false
	}
	else
	{
		if (codeSeg3121 === false && cdCriacao.toUpperCase() !== str_pad(glbUsuario, 10, "0", "STR_PAD_LEFT")) //PODE ALTERAR SE O USUARIO FOR DIFERENTE
		{ 
			updateEnabled = false
		}
		else{
			updateEnabled = true
		}
	}

	if (codeSeg3120 === true) //LIBERA A EXCLUSAO
	{
		if (codeSeg3123 === false && date_diff(eventDate, nowDate) > 5) // TEM PERMISSAO DE EXCLUIR E NAO PODE EXCLUIR APOS 5 DIAS
			deleteEnabled = false
		else
		{
			if (codeSeg3124 === false && cdCriacao.toUpperCase() !== str_pad(glbUsuario, 10, "0", "STR_PAD_LEFT")) //PODE EXCLUIR SE O USUARIO FOR DIFERENTE
				deleteEnabled = false
			else
				deleteEnabled = true
		}
	}else
		deleteEnabled = false

	const permissions = {
		eventHash: eventHash,
		eventRowId: eventRowId,
		insert: false,
		update: updateEnabled,
		delete: deleteEnabled,
	}

	dispatch({
		type: CHECK_EVENT,
		value: permissions
	})
}}

export const checkPermissionInEvent = (eventHash) => {
	let deleteEnabled = false
	let updateEnabled = false
	let hash = base64_decode(eventHash)
	let date = new Date()
	let month = date.getMonth() + 1
	let nowDate = date.getFullYear() + '-' + month + '-' + date.getDate()
	let eventDate = hash.substr(14, 4) + '-' + hash.substr(12, 2) + '-' + hash.substr(10, 2)
	let cdCriacao = hash.substr(67, 10)
	
	if (codeSeg3122 === false && date_diff(eventDate, nowDate) > 5) // TEM PERMISSAO DE ALTERAR E NAO PODE ALTERAR APOS 5 DIAS
	{ 
		updateEnabled = false
	}
	else
	{
		if (codeSeg3121 === false && cdCriacao.toUpperCase() !== str_pad(glbUsuario, 10, "0", "STR_PAD_LEFT")) //PODE ALTERAR SE O USUARIO FOR DIFERENTE
		{ 
			updateEnabled = false
		}
		else{
			updateEnabled = true
		}
	}

	if (codeSeg3120 === true) //LIBERA A EXCLUSAO
	{
		if (codeSeg3123 === false && date_diff(eventDate, nowDate) > 5) // TEM PERMISSAO DE EXCLUIR E NAO PODE EXCLUIR APOS 5 DIAS
			deleteEnabled = false
		else
		{
			if (codeSeg3124 === false && cdCriacao.toUpperCase() !== str_pad(glbUsuario, 10, "0", "STR_PAD_LEFT")) //PODE EXCLUIR SE O USUARIO FOR DIFERENTE
				deleteEnabled = false
			else
				deleteEnabled = true
		}
	}else
		deleteEnabled = false

	return function (dispatch){
		dispatch({
			type: UPDATE_EVENT_ENABLED,
			value: updateEnabled
		})
		dispatch({
			type: DELETE_EVENT_ENABLED,
			value: deleteEnabled
		})
	}
}

export const reloadCredentials = () => {
	return function (dispatch){
		dispatch( statusLoading(true) )
		
		checkToken()
		.then(data => {
			
			let result = false

			if(!data.ok && isCobsystem){
				
				let attName, attValue = null					
				
				switch(pathName){
					case '/titulo':
					case '/historico':
					case '/acionamento':
				
						// Este atributo deve ser reservado para acessos vindo do cobsystem
						localStorage.removeItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa');
						localStorage.setItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa', '246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5')
						attName = '78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa'
						attValue = localStorage.getItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa')

						registerPrivateToken(attName, attValue)
						.then((response) => {
							if(response.ok){

								localStorage.setItem('private-control', response.token)

								autoAuthentication()
								.then((result) => {
									let retorno = 'negado'

									if(result.ok){
										retorno = 'ok'
									}

									dispatch({
										type: APP_LOADED,
										status: retorno
									})
								})
								.catch((error) => {
									dispatch( statusLoading(false) )										
									dispatch( statusErro("Problema no sistema. Evento: autoAuthentication.") )
									dispatch( alertErroShow() )									
								})

							}else{
								localStorage.setItem('accessTimeout', "true")
								dispatch( statusLoading(false) )
								dispatch( statusWarning("As credenciais utilizadas para o seu acesso expiraram por isso as funcionalidades dessa tela ficaram indisponíveis. Você deve acessar esta ficha novamente pelo Cobsystem para o acesso ser restabelecido.") )
								dispatch( alertWarningShow() )
							}
							return result;							
						})
						break;
					default:
						break;
				}
			}else{
				//É cobsystem, Token válido
				dispatch( {
					type: APP_LOADED,
					status: 'ok'
				} )
			}
		})
		.catch((error) => {
			dispatch( statusLoading(false) )
			dispatch( statusErro("Problema no sistema. Evento: reloadCredentials.") )
			dispatch( alertErroShow() )
		})
	}
}

export const getContract = (params) => {
	return function (dispatch) {
		dispatch( statusLoading(true) ) 
		
		return callGetContract(params.cdProcesso, params.nMostarEnderecoCliente)
			.then((response) => {
				if(response && response.status !== 403){

					dispatch( statusLoading(false) )
					dispatch({
						type: GET_CONTRACT,
						value: response
					})
				} else {
					if(response.status === 403) {
						dispatch( reloadCredentials() )

						setTimeout(() => (
							dispatch( saveActionPending('getContract', params, 'titulo') )
						), 1000)
						
						setTimeout(() => (
							dispatch( loadActionPending('getContract', params, 'titulo') )
						), 1000)						
					} else {
						dispatch( statusLoading(false) )
						dispatch( statusWarning(response.message) )
						dispatch( alertWarningShow() )
					}
				}
			})
			.catch((error) => {
				dispatch( statusLoading(false) )
				dispatch( statusErro("Problema no sistema.") )
				dispatch( alertErroShow() )
			})
	}
}