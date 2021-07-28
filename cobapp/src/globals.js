import { getServiceDomain, getUrlParams, decrypt, urlencode, base64_encode, str_pad } from "../src/utils"

const urlParams = getUrlParams(window.location.search)

export const apiDomain = getServiceDomain('API')
export const cobappDomain = getServiceDomain('COBAPP')

export const glbUsuario = urlParams.has("pr00") ? decrypt(urlParams.get("pr00").toUpperCase().trim()) : null
export const codigoAcesso = urlParams.has("pr01") ? decrypt(urlParams.get("pr01").toUpperCase().trim()) : 0
export const codigoEdicaoAlteracao = urlencode(base64_encode(str_pad(codigoAcesso, 10, "0", "STR_PAD_LEFT")))
export const cdProcesso = urlParams.has("pr02") ? decrypt(urlParams.get("pr02").toUpperCase().trim()) : null
export const codigoAuxClienteHTML = urlParams.has("pr03") ? urlParams.get("pr03").toUpperCase().trim() === 'TRUE' ? true : false : false
export const codigoAuxDevedorHTML = urlParams.has("pr04") ? decrypt(urlParams.get("pr04").toUpperCase().trim()) : null

export const codeSeg3120 = urlParams.has("pr05") && urlParams.get("pr05").toUpperCase().trim() === "TRUE" ? true : false
export const codeSeg3121 = urlParams.has("pr06") && urlParams.get("pr06").toUpperCase().trim() === "TRUE" ? true : false
export const codeSeg3122 = urlParams.has("pr07") && urlParams.get("pr07").toUpperCase().trim() === "TRUE" ? true : false
export const codeSeg3123 = urlParams.has("pr08") && urlParams.get("pr08").toUpperCase().trim() === "TRUE" ? true : false
export const codeSeg3124 = urlParams.has("pr09") && urlParams.get("pr09").toUpperCase().trim() === "TRUE" ? true : false

export const accessGlobalCode = urlParams.has("pr00") ? base64_encode(urlencode(urlParams.get("pr00"))) : 0
export const accessUserCode = urlParams.has("pr01") ? base64_encode(urlencode(urlParams.get("pr01"))) : 0
export const accessCodeToEdit = urlencode(base64_encode(str_pad(codigoAcesso, 10, "0", "STR_PAD_LEFT")))

export const isCobsystem = (glbUsuario && codigoAcesso && (codeSeg3120 !== null && codeSeg3121 !== null && codeSeg3122 !== null && codeSeg3123 !== null && codeSeg3124 !== null)) ? true : false
export const pathName = window.location.pathname
export const privateControl = ''

var prKey = urlParams.has("key") ? decrypt(urlParams.get("key")) : '0'
export const accessTimeout = typeof prKey === 'string' && prKey.length >= 14 ? prKey.substring(0, 14) : 0
export const codeSeg8916 = typeof prKey === 'string' && prKey.substring(14,15) === '1' ? true : false