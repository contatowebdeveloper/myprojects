import 'url-search-params-polyfill' 

const PROD = 'api.schulze.com.br:8000, cobapp.schulze.com.br:3000';
const HOMOLOG = 'api-homolog.schulze.com.br:8000, cobapp-homolog.schulze.com.br:3000, 192.168.100.33';
const TESTE = 'api-teste.schulze.com.br:8000, cobapp-teste.schulze.com.br:3000, 192.168.100.32';

export const IE11Detect = () => {
	//var ua = window.navigator.userAgent, msie = ua.indexOf("MSIE ");
    //return msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) ? true : false;
}

export const isProd = () => {
	if(PROD.indexOf(window.location.hostname) !== -1){
		return true;
	}
}

export const isHomolog = () => {	
	if(HOMOLOG.indexOf(window.location.hostname) !== -1){
		return true;
	}
}

export const isTeste = () => {	
	if(TESTE.indexOf(window.location.hostname) !== -1){
		return true;
	}
}

export const getServiceDomain = (service) => {
	
	let serviceDomain = '';
	
	switch (service) {
		case 'API':
			if(isProd()){
				serviceDomain = 'api.schulze.com.br:8000';
			}else if(isHomolog()){
				serviceDomain = 'api-homolog.schulze.com.br:8000';
			}else if(isTeste()){
				serviceDomain = 'api-teste.schulze.com.br:8000';
			}else{
				serviceDomain = 'api-dev.schulze.com.br:8000';
			}
			break;
		case 'COBAPP':                
			if(isProd()){
				serviceDomain = 'cobapp.schulze.com.br:3000';
			}else if(isHomolog()){
				serviceDomain = 'cobapp-homolog.schulze.com.br:3000';
			}else if(isTeste()){
				serviceDomain = 'cobapp-teste.schulze.com.br:3000';
			}else{
				serviceDomain = 'cobapp-dev.schulze.com.br:3000';
			}
			break;
		default:
			serviceDomain = false;
			break;
	}
	return serviceDomain;
}

export const str_pad = (str, length, mark, option) => {
	if(str){
		var add = length - str.length;
		for (var i = 0; i < add; i++){
			option === "STR_PAD_LEFT" ? str = mark + str : str = str + mark;
		}
	}
	return str
}

export const formatDate = (date, format) => { 
	let dateFormat = ""
	if(date !== undefined && date !== null){
		if(format === "timestamp" || format === 'timestampUpdated'){
			dateFormat = new Date(Date.UTC(date.substr(0,4), date.substr(5,2) - 1, date.substr(8,2), date.substr(11,2), date.substr(14,2), date.substr(17,2))).toLocaleString('pt-BR', { timeZone: 'UTC' })
		} else {
			dateFormat = date.toLocaleString('pt-BR').replace(/[-]/g , "/").split('/').reverse().join('/')
		}
	}
    return dateFormat
}

export const numberWithPoint = (number) => {
	var n = new Intl.NumberFormat('pt-PT').format(number);
	return n;
}

export const numberToReal = (number) => {
	number = parseFloat(number).toFixed(2).split('.');
    number[0] = "R$ " + number[0].split(/(?=(?:...)*$)/).join('.');
    return number.join(',');
}

export const formatSize = (value, valueSize) => {
	let vValueAux = 0
	vValueAux=value
	while(vValueAux.length < valueSize)
		vValueAux = "0" + vValueAux
	return vValueAux
}

export const formatRate = (number) => {
	number = parseFloat(number).toFixed(2)
	number = number.replace('.', ',')
	return number
}
//função para formatar o telefone, exibido nas grids
export const formatPhone = (phone) => {
	if(phone.length >= 8) {
		phone = phone.replace(/\D/g,""); //Remove tudo o que não é dígito
		phone = phone.replace(/^(\d{2})(\d)/g,"($1) $2");//Coloca parênteses em volta dos dois primeiros dígitos
		phone = phone.replace(/(\d)(\d{4})$/,"$1-$2"); //Coloca hífen entre o quarto e o quinto dígito
		return phone.substr(0, 15);
	} else {
		return phone
	}
}

export const date_diff = (date1, date2 = null) => {
	var diff = ''
	if(date2 === null){
		let date = new Date()
		let month = date.getMonth() + 1
		//let nowDate = date.getFullYear() + '-' + month + '-' + date.getDate()
		let nowDate = date.getFullYear() + '/' + month + '/' + date.getDate()
		date2 = nowDate
	}

	if(date2 > date1){
		diff = Date.parse(date2) - Date.parse(date1);
	} else {
		diff = Date.parse(date1) - Date.parse(date2);
	}

	return Math.floor(diff / 86400000);
}

export const orderBy = (data, field, direct) => { 
	return(
		data.sort((obj1, obj2) => direct === "ASC" ? obj1[field] - obj2[field] : obj2[field] - obj1[field])
	)
}

export const getUrlParams = (query) => ( new URLSearchParams(query))

export const ord = (string) => {
	//  discuss at: http://locutus.io/php/ord/
	// original by: Kevin van Zonneveld (http://kvz.io)
	// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
	// improved by: Brett Zamir (http://brett-zamir.me)
	//    input by: incidence
	//   example 1: ord('K')
	//   returns 1: 75
	//   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
	//   returns 2: 65536
  
	var str = string + ''
	var code = str.charCodeAt(0)
  
	if (code >= 0xD800 && code <= 0xDBFF) {
	  // High surrogate (could change last hex to 0xDB7F to treat
	  // high private surrogates as single characters)
	  var hi = code
	  if (str.length === 1) {
		// This is just a high surrogate with no following low surrogate,
		// so we return its value;
		return code
		// we could also throw an error as it is not a complete character,
		// but someone may want to know
	  }
	  var low = str.charCodeAt(1)
	  return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
	}
	if (code >= 0xDC00 && code <= 0xDFFF) {
	  // Low surrogate
	  // This is just a low surrogate with no preceding high surrogate,
	  // so we return its value;
	  return code
	  // we could also throw an error as it is not a complete character,
	  // but someone may want to know
	}
  
	return code
}

export const chr = (codePt) => {
	//  discuss at: http://locutus.io/php/chr/
	// original by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Brett Zamir (http://brett-zamir.me)
	//   example 1: chr(75) === 'K'
	//   example 1: chr(65536) === '\uD800\uDC00'
	//   returns 1: true
	//   returns 1: true
  
	if (codePt > 0xFFFF) { // Create a four-byte string (length 2) since this code point is high
	  //   enough for the UTF-16 encoding (JavaScript internal use), to
	  //   require representation with two surrogates (reserved non-characters
	  //   used for building other characters; the first is "high" and the next "low")
	  codePt -= 0x10000
	  return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF))
	}
	return String.fromCharCode(codePt)
}

export const Asc = (str) => {
	return str.charCodeAt(0);
}
export const decrypt = (text) => {
	var s = "";
	var s1 = text;
	var control = false;
	for (var i = 0; i <= (s1.length)-1; i++){
		var c = ord(s1[i]);		
		if (control){			
			c = chr(c-5);
			control = false;
		}else{
			c = chr(c+5);
			control = true;
		}
		s = s + c;
	}
	s1 = "";

	for (i = (s.length)-1; i>=0; i--)
		s1 = s1 + s[i];

	return s1;
}

export const encrypt = (texto) => {
	var t, s1, s, i, c, control
	t = texto.toString()
	s1 = ""
	s = ""
	c = ""
	control = false

	for(i = t.length; i >= 0; i-- ){
		s1 = s1 + t.substr(i, 1)
	}

	for(i = 0; i <= s1.length; i++){
		c = parseInt( Asc(s1.substr(i, 1)))
		if(control === true){
			c = chr(parseInt(c)+5)
			control = false
		}else{			
			c = chr(parseInt(c)-5)
			control = true
		}
		s = s + c
	}

	return s.trim()
}

export const base64_decode = (encodedData) => { // eslint-disable-line camelcase
	//  discuss at: http://locutus.io/php/base64_decode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Kevin van Zonneveld (http://kvz.io)
	//    input by: Aman Gupta
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
	// bugfixed by: Pellentesque Malesuada
	// bugfixed by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Indigo744
	//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==')
	//   returns 1: 'Kevin van Zonneveld'
	//   example 2: base64_decode('YQ==')
	//   returns 2: 'a'
	//   example 3: base64_decode('4pyTIMOgIGxhIG1vZGU=')
	//   returns 3: '✓ à la mode'
	
	// decodeUTF8string()
	// Internal function to decode properly UTF8 string
	// Adapted from Solution #1 at https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
	var decodeUTF8string = function (str) {
		// Going backwards: from bytestream, to percent-encoding, to original string.
		return decodeURIComponent(str.split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
		}).join(''))
	}
	
	if (typeof window !== 'undefined') {
		if (typeof window.atob !== 'undefined') {
		return decodeUTF8string(window.atob(encodedData))
		}
	} else {
		return new Buffer(encodedData, 'base64').toString('utf-8')
	}
	
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	var o1
	var o2
	var o3
	var h1
	var h2
	var h3
	var h4
	var bits
	var i = 0
	var ac = 0
	var dec = ''
	var tmpArr = []
	
	if (!encodedData) {
		return encodedData
	}
	
	encodedData += ''
	
	do {
		// unpack four hexets into three octets using index points in b64
		h1 = b64.indexOf(encodedData.charAt(i++))
		h2 = b64.indexOf(encodedData.charAt(i++))
		h3 = b64.indexOf(encodedData.charAt(i++))
		h4 = b64.indexOf(encodedData.charAt(i++))
	
		bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4
	
		o1 = (bits >> 16) & 0xff
		o2 = (bits >> 8) & 0xff
		o3 = bits & 0xff
	
		if (h3 === 64) {
		tmpArr[ac++] = String.fromCharCode(o1)
		} else if (h4 === 64) {
		tmpArr[ac++] = String.fromCharCode(o1, o2)
		} else {
		tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
		}
	} while (i < encodedData.length)
	
	dec = tmpArr.join('')
	
	return decodeUTF8string(dec.replace(/\0+$/, ''))
}

export const base64_encode = (stringToEncode) => { // eslint-disable-line camelcase
	//  discuss at: http://locutus.io/php/base64_encode/
	// original by: Tyler Akins (http://rumkin.com)
	// improved by: Bayron Guevara
	// improved by: Thunder.m
	// improved by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Kevin van Zonneveld (http://kvz.io)
	// improved by: Rafał Kukawski (http://blog.kukawski.pl)
	// bugfixed by: Pellentesque Malesuada
	// improved by: Indigo744
	//   example 1: base64_encode('Kevin van Zonneveld')
	//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
	//   example 2: base64_encode('a')
	//   returns 2: 'YQ=='
	//   example 3: base64_encode('✓ à la mode')
	//   returns 3: '4pyTIMOgIGxhIG1vZGU='
	
	// encodeUTF8string()
	// Internal function to encode properly UTF8 string
	// Adapted from Solution #1 at https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
	var encodeUTF8string = function (str) {
		// first we use encodeURIComponent to get percent-encoded UTF-8,
		// then we convert the percent encodings into raw bytes which
		// can be fed into the base64 encoding algorithm.
		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes (match, p1) {
			return String.fromCharCode('0x' + p1)
		})
	}
	
	if (typeof window !== 'undefined') {
		if (typeof window.btoa !== 'undefined') {
		return window.btoa(encodeUTF8string(stringToEncode))
		}
	} else {
		return new Buffer(stringToEncode).toString('base64')
	}
	
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	var o1
	var o2
	var o3
	var h1
	var h2
	var h3
	var h4
	var bits
	var i = 0
	var ac = 0
	var enc = ''
	var tmpArr = []
	
	if (!stringToEncode) {
		return stringToEncode
	}
	
	stringToEncode = encodeUTF8string(stringToEncode)
	
	do {
		// pack three octets into four hexets
		o1 = stringToEncode.charCodeAt(i++)
		o2 = stringToEncode.charCodeAt(i++)
		o3 = stringToEncode.charCodeAt(i++)
	
		bits = (o1 << 16) | (o2 << 8) | o3
	
		h1 = (bits >> 18) & 0x3f
		h2 = (bits >> 12) & 0x3f
		h3 = (bits >> 6) & 0x3f
		h4 = bits & 0x3f
	
		// use hexets to index into b64, and append result to encoded string
		tmpArr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
	} while (i < stringToEncode.length)
	
	enc = tmpArr.join('')	
	var r = stringToEncode.length % 3	
	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
}

export const urlencode = (str) => {	
	str = (str + '')	
	return encodeURIComponent(str)
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
		.replace(/\*/g, '%2A')
		.replace(/~/g, '%7E')
		.replace(/%20/g, '+')
}

export const urldecode = (str) => {	
	return decodeURIComponent((str + '')
		.replace(/%(?![\da-f]{2})/gi, function () {
		// PHP tolerates poorly formed escape sequences
		return '%25'
		})
		.replace(/\+/g, '%20'))
}

export const setUniqueCheckbox = (id) => {
	var items = document.getElementsByTagName('input');
		for (var i = 0; i < items.length; i++) {
			if (items[i].type === 'checkbox' && (items[i].id !== id && items[i].id !== ''))
				items[i].checked = false;
		}
}

export const unSelectAll = () => {
	var items = document.getElementsByTagName('input')

	for (var i = 0; i < items.length; i++) {
		if (items[i].type === 'radio' && items[i].id !== '')
			items[i].checked = false;
	}
}

export const validateParamsFromRoute = (route) => {
	let result = { status: false, params: [] }
	let params = []
	let status = false
	const urlParams = getUrlParams(window.location.search)

	status = urlParams.has("pr00") ? true : false

	switch(route){
		case 'historico':
			status = urlParams.has("pr00") ? true : false
			params.push({param: 'pr00', status: status})
			status = urlParams.has("pr01") ? true : false
			params.push({param: 'pr01', status: status})
			status = urlParams.has("pr02") ? true : false
			params.push({param: 'pr02', status: status})
			status = urlParams.has("pr03") ? true : false
			params.push({param: 'pr03', status: status})
			status = urlParams.has("pr04") ? true : false
			params.push({param: 'pr04', status: status})
			status = urlParams.has("pr05") ? true : false
			params.push({param: 'pr05', status: status})
			status = urlParams.has("pr06") ? true : false
			params.push({param: 'pr06', status: status})
			status = urlParams.has("pr07") ? true : false
			params.push({param: 'pr07', status: status})
			status = urlParams.has("pr08") ? true : false
			params.push({param: 'pr08', status: status})
			status = urlParams.has("pr09") ? true : false
			params.push({param: 'pr09', status: status})
			
			result = {
				status : params.filter(item => item.status === false).length > 0 ? false : true,
				params : params,
			}
			break
		case 'titulo':
				status = urlParams.has("pr00") ? true : false
				params.push({param: 'pr00', status: status})
				status = urlParams.has("pr01") ? true : false
				params.push({param: 'pr01', status: status})
				status = urlParams.has("pr02") ? true : false
				params.push({param: 'pr02', status: status})
				status = urlParams.has("pr03") ? true : false
				params.push({param: 'pr03', status: status})
				
				result = {
					status : params.filter(item => item.status === false).length > 0 ? false : true,
					params : params,
				}
			break
		case 'acionamento':
				status = urlParams.has("pr00") ? true : false
				params.push({param: 'pr00', status: status})
				status = urlParams.has("pr01") ? true : false
				params.push({param: 'pr01', status: status})
				status = urlParams.has("pr02") ? true : false
				params.push({param: 'pr02', status: status})
				
				result = {
					status : params.filter(item => item.status === false).length > 0 ? false : true,
					params : params,
				}
			break
		default:
			break
	}
	return result
}

export const setCookie = (cname, cvalue, exdays) => {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) === ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) === 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

export const deleteCookie = (cname) => { document.cookie = cname + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT" }

export const checkCookieUser = (cname) => {
	var user = getCookie(cname);
	if (user !== "") {
	  //alert("Welcome again " + user);
	} else {
	  user = prompt("Please enter your name:", "");
	  if (user !== "" && user !== null) {
		setCookie("username", user, 365);
	  }
	}
}

export const hideDuplicatesRowsByColumns = (registries, hideDuplicatesRowsByColumnsIndex) => {
	let itemsToRemove = []
	
	registries.map((registry, index) => {

	let previousindex = index > 1 ? index-1 : 0;
	let indexOn = index
	let totalColumnsToHide = 0
	let result = []	
	
	// Obtém os indices do objeto
	let columnsKeyRegistry = Object.keys( registry )

	// Varrendo os campos da linha verificando se o índice informado existe na linha
	columnsKeyRegistry.map((value, indexDefault) => (
		hideDuplicatesRowsByColumnsIndex.map((value) => (
		// Se o índice informado, foi encontrado, armazena-o na variável result
		value === indexDefault ? result.push(indexDefault) : ''
		))
	))

	// Se o total de índices encontrados correspondem ao total de índices informados
	if( result.length === hideDuplicatesRowsByColumnsIndex.length ){

		// Obtém o nome das propriedades do objeto
		let fieldsOfRegistry = Object.getOwnPropertyNames(registry)

		fieldsOfRegistry.map((field, index) => (
		result.map((value, indexResult) => ((result[indexResult] === index && registry[field] === registries[previousindex][field]) ? totalColumnsToHide++ : '' ))
		))
	}

	if(totalColumnsToHide === hideDuplicatesRowsByColumnsIndex.length){
		if(previousindex !== indexOn){ itemsToRemove.push(previousindex) }
	}

	totalColumnsToHide = 0
	return itemsToRemove
	})
	
	itemsToRemove.sort((a, b) => (b-a)).map((value) => ( registries.splice(value, 1)))
	return registries
}

export const hideCollumnsOfRow = (registries, hideCollumnsOfRowByIndex) => {
	if(Array.isArray(registries)) {
		registries.map((registry) => {
			return (
				hideCollumnsOfRowByIndex.map((value) => ( delete registry.columns[value] )),
				hideCollumnsOfRowByIndex.map((value) => ( delete registry.subColumns[value] ))
			)
		})
	}

	return registries
}

export const hideCollumnsOfHeader = (header, hideCollumnsOfHeaderByIndex) => {
	hideCollumnsOfHeaderByIndex.map((value) => ( delete header[value] ))
	return header
}

export const checkPermissionInEvent = (eventHash, codeSeg3120, codeSeg3121, codeSeg3122, codeSeg3123, codeSeg3124, glbUsuario ) => {
    let deleteEnabled = false
    let updateEnabled = false
    let hash = base64_decode(eventHash)
    let date = new Date()
    let month = date.getMonth() + 1
    let nowDate = date.getFullYear() + '-' + month + '-' + date.getDate()
    let eventDate = hash.substr(14, 4) + '-' + hash.substr(12, 2) + '-' + hash.substr(10, 2)
	let cdCriacao = hash.substr(67, 10)

	if (codeSeg3122 === false && date_diff(eventDate.replace(/-/g, "/"), nowDate.replace(/-/g, "/")) > 5) // TEM PERMISSAO DE ALTERAR E NAO PODE ALTERAR APOS 5 DIAS
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
      if (codeSeg3123 === false && date_diff(eventDate.replace(/-/g, "/"), nowDate.replace(/-/g, "/")) > 5) // TEM PERMISSAO DE EXCLUIR E NAO PODE EXCLUIR APOS 5 DIAS
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

    return { 
		insert: false, 
		update: updateEnabled, 
		delete: deleteEnabled 
	}
}

//desabilita o backspace no projeto, exceto pros campos de input de dados.
document.onkeydown = document.onkeypress = function (event) {
	var doPrevent = false
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target
        if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE')) || d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled
        }
        else {
            doPrevent = true
        }
    }

    if (doPrevent) {
        event.preventDefault()
    }
}

export const hasClass = (ele, cls) => ( 
	IE11Detect() ? !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')) : ele.classList.contains(cls) 
)
  
export const addClass = (ele, cls) => (	
	!hasClass(ele, cls) ? 
		IE11Detect() ? 
			ele.className += " "+cls 
		: 
			ele.classList.add(cls)
	: false 
)

export const removeClass = (ele, cls) => ( 
	hasClass(ele, cls) ? 
		IE11Detect() ? ele.className=ele.className.replace(cls, ' ') : ele.classList.remove(cls) 
	: false 
)

export const reduceRowsGrid = (val) => {
	document.querySelectorAll('[id^="row_' + val + '"]').forEach(el => el.style.display = "none");	
	let rows = document.getElementsByClassName("Clickable");
	for (var i = 0; i < rows.length; i++) {
		let nfileds = rows[i].childNodes.length - 1 > -1 ? rows[i].childNodes.length - 1 : 0;
		rows[i].children[nfileds].children[0].textContent =  '+';
	}
}

export const getDateById = (id) => {
	var dt1 = '', d1 = '', dt = ''        
    if(document.getElementById(id) && document.getElementById(id).value !== ''){
        d1 = document.getElementById(id).value
        dt = d1.split("/");
        dt1 = dt[2]+""+dt[1]+""+dt[0];
	}
	return dt1
}

export const getNumbers = (element) => {
    let retorno = "", i = 0, tamanho = element.length, charCode = "";
    for(i=0;i<tamanho;i++){
      charCode = element.charCodeAt(i);
      if (charCode >= 48 && charCode <= 57)
        retorno = retorno + element[i];
    }
    return retorno;
}

export const copyTextToClipboard = (text) => {
    var element = document.createElement("textarea")
    element.style.position = 'fixed'
    element.style.top = 0
    element.style.left = 0
    element.style.width = '2em'
    element.style.height = '2em'
    element.style.padding = 0
    element.style.border = 'none'
    element.style.outline = 'none'
    element.style.boxShadow = 'none'
    element.style.background = 'transparent'
    element.value = text
    document.body.appendChild(element)
    element.select()
    element.setSelectionRange(0, 99999) /*For mobile devices*/

    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successful' : 'unsuccessful'
      console.log('Copying text command was ' + msg)
    } catch (err) {
      console.log('Oops, unable to copy')
      window.prompt("Copie para área de transferência: Ctrl+C e tecle Enter", text)
    }

	document.body.removeChild(element)
}