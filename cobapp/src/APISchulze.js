import { apiDomain, cobappDomain, accessGlobalCode, accessUserCode, accessCodeToEdit, accessTimeout, codigoAcesso } from "../src/globals.js"

const api = `http://${apiDomain}`
const cobapp = `http://${cobappDomain}`

// Generate a unique token for storing your bookshelf data on the backend server.
let token = localStorage.token
localStorage.setItem('accessTimeout', "false")

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

var headers = new Headers({
  'Accept': 'application/json',
  'Authorization': token,
  'Content-Type': 'multipart/form-data',
  'Pragma': 'no-cache',
  'Cache-Control': 'no-cache',
  'Content-Length': cobapp.length, 
  'Access-Control-Allow-Origin': cobapp,
  'access-global-code': accessGlobalCode,
  'access-user-code': accessUserCode,
  'access-code-to-edit': accessCodeToEdit,
  'access-timeout': accessTimeout,
  'private-control': localStorage.getItem('private-control'),
})

export const checkToken = async () => { 
  headers.set('Content-Type', 'application/json')
  let result = await fetch(`${api}/checkToken`, { 
    headers: headers, 
    mode: 'cors', 
    method: 'GET' 
  })
  .then((response) => (response.json()))
  .catch(() => ({code: 503, status: 'Serviço indisponível'}))
  
  return await result;
}

export const registerPrivateToken = async (attName, attValue) => { 
  headers.set(attName, attValue)  
  const response = await fetch(`${api}/registerPrivateToken`, { 
    headers: headers,
    mode: 'cors', 
    method: 'GET', 
  })
  
  const result = await response.json();
  localStorage.setItem('private-control', result.token); 
  
  return await result;
}

export const autoAuthentication = async () => {
  headers.set('Content-Type', 'application/json')  
  headers.set('private-control', localStorage.getItem('private-control'))
  const result = await fetch(`${api}/autoAuthentication`, { 
    headers: headers, 
    mode: 'cors', 
    method: 'GET' 
  })
  .then((response) => (response.json()))
  
  if(result.ok){
    localStorage.removeItem('token');
    localStorage.setItem('token', result.token)
    headers.set('Authorization', result.token)
  }
  return await result
}

export const listOptionEvent = (route) =>  
fetch(`${api}/listOptionEvent/${route}`, { headers: headers, mode: 'cors', method: 'GET' })
  .then((response) => {
    let result = response.json()   
    if(!response.ok){
      let message = "Houve um problema em listOptionEvent."
      result = {error: true, message: message}
      throw Error(message)
    }    
    return result
  })
  .catch(console.error)

export const listStatus = async (route) => {
  headers.set('Content-Type', 'application/json') 
  const response = await fetch(`${api}/listStatus/${route}`, { headers: headers, mode: 'cors', method: 'GET' })
  return await response.json()
}

export const listFase = async (listCdStatus, route) => {
  headers.set('Content-Type', 'application/json')
  const response = await fetch(`${api}/listFase`, { 
    headers: headers,
    mode: 'cors', 
    method: 'POST',    
    body: JSON.stringify({
      cdStatus: listCdStatus,
      route: route
    })
  })  
  return await response.json()  
}

export const getDateDataBaseCall = async () => {
  const response = await fetch(`${api}/dateDataBaseCall`, { headers: headers, mode: 'cors', method: 'GET' })  
  .then(response => (response.json()))
  return await response
}

export const listEvents = async (index, cdProcesso, dataDe, dataAte, listStatus, listFase, offset, limiter) => {
  headers.set('authorization', localStorage.getItem('token')) 
  const response = await fetch(`${api}/listEvents`, { 
    headers: headers,
    mode: 'cors', 
    method: 'POST',    
    body: JSON.stringify({
      index: index,
      cdProcesso: cdProcesso,
      dataDe: dataDe,
      dataAte: dataAte,
      listStatus: listStatus,
      listFase: listFase,
      offset: offset,
      limiter: limiter
    })
  })
  .then(response => (response.json()))
  return await response
}

export const listCall = async (index, cdProcesso, dataDe, dataAte, listStatus, listFase, filterCall, listCallBackup, offset, limiter) => {
  headers.set('authorization', localStorage.getItem('token'))
  const response = await fetch(`${api}/listCall`, { 
    headers: headers,
    mode: 'cors', 
    method: 'POST',    
    body: JSON.stringify({
      index: index,
      cdProcesso: cdProcesso,
      dataDe: dataDe,
      dataAte: dataAte,
      listStatus: listStatus,
      listFase: listFase,
      filterCall: filterCall,
      listCallBackup: listCallBackup,
      offset: offset,
      limiter: limiter
    })
  })
  .then(response => (response.json()))
  return await response
}

export const getEvent = (eventHash) => 
  fetch(`${api}/event/${eventHash}`, { headers: headers, mode: 'cors', method: 'GET' })
  .then((response) => (response.json())) 
  .catch((error) => {console.error(error)})

export const updateEvent = (event) => {
  const response = fetch(`${api}/event`, { 
    headers: headers,
    mode: 'cors', 
    method: 'PUT',
    body: JSON.stringify({
      eventHash : event.eventHash,
      eventDetail : event.eventDetail
    })
  })
  .then(response => (response.json()))
  return response
}

export const deleteEvent = (eventHash, eventReason) => 
  fetch(`${api}/event/${eventHash}/${eventReason}`, { headers: headers, mode: 'cors', method: 'DELETE' })
  .then((response) => {
    let result = response
    if(!response.ok){
      let message =  "Problema na chamada de exclusão à API"
      result = {error: true, message: message} 
    }
    return result
  })
  .catch(console.error)

export const getContract = async (cdProcesso, nMostarEnderecoCliente) => {
  const response = await fetch(`${api}/contract/${cdProcesso}/${nMostarEnderecoCliente}`, { headers: headers, mode: 'cors', method: 'GET' })
  .then(response => (response.json()))
  return await response
}

export const getWatermark = async () => {
  headers.set('authorization', localStorage.getItem('token'))
  const response = await fetch(`${api}/getWatermark/${codigoAcesso}/${accessTimeout}`, { headers: headers, mode: 'cors', method: 'GET' })
  .then(response => (response.json()))
  .catch(console.error)
  return await response
}