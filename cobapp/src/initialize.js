import { isCobsystem, pathName } from './globals'
import { registerPrivateToken, autoAuthentication, checkToken } from './APISchulze'

// Somente se o acesso for pelo CobSystem que será criado o atributo reservado, necessário para a renovação do token de forma automática;
export const validateAuthentication = async () => {
	let status = false
	
	if( isCobsystem ) {
		status = await checkToken().then((token) => {
			// Se não tem código 503 (Serviço indisponível)
			if(!token.code){
				if(!token.ok){
					let attName, attValue = null
					switch(pathName){
						case '/titulo':
						case '/historico':
						case '/acionamento':
							localStorage.removeItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa');
							localStorage.setItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa', '246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5')
							attName = '78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa'
							attValue = localStorage.getItem('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa')
							
							return registerPrivateToken(attName, attValue)
							.then((response) => {
								if(response.ok){
									// Deu certo obteve o private-control
									localStorage.setItem('private-control', response.token)
									autoAuthentication()
									return true
								}else{
									// Não obteve o private control.
									return false
								}
							})
						default:
							// Não tem URL valida
							return false
					}
				}else{
					// É cobsystem, Token válido
					return true
				}
			}else{
				// Houve problema de comunicação com o servidor				
				// return false
				return token
			}
		})
		.catch((response)=>{ console.log('err', response)})
	}else{
		checkToken().then((token) => {
			if(token.ok){
				// Não é Cobsystem mas Web Token é válido
				status = true
			}
		})
		.catch(console.error)
	}

	return await status
}