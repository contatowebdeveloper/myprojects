# Histórico CobSystem

Essa documentação tem por objetivo especificar o funcionamento da API em REST que deverá atender às solicitações vindas do APP JS "historico".

## Requisitos da API
Ambiente Apache com PHP 7, utilizando o Slim Framework PHP para criação da API.
### - Adicionar como virtual host o domínio api.schulze:
```
<VirtualHost api.schulze:80>
	DocumentRoot "{DOCUMENTPATH}/api-rest/"
	ServerName "api.schulze"
	<Directory "{DOCUMENTPATH}/api-rest/">
		AllowOverride All
		Options FollowSymLinks Includes Indexes MultiViews 
	</Directory>
</VirtualHost>
```

### - Se o ambiente for windows, alterar o arquivo hosts para apontar o ip local para o correspondente domínio:
```
 - Vá em C:\Windows\System32\drivers\etc;
 - Abra no bloco de notas o arquivo hosts;
 - Adicione em uma nova linha:
        127.0.0.1       api.schulze
 - Salve o arquivo e teste o domínio no navegador.
 - Se a api estiver configurada corretamente você deverá visualizar a mensagem "API SCHULZE"
```

## NOTA
Para projetos em ambientes locais foi identificado problema de CORS ao construir aplicações que usam requisições do tipo XMLHTTPRequest ou Fecth, para tanto, a API deve prever essa restrição a fim de não haver bloqueio da aplicação.

## Rotas da API
  - listAll
  - listOf/:index
  - listStatus
  - listFase/:cdStatus+
  - editEvent/:cdProcesso/:cdFase/:cdUser/:cdSec
  - updateEvent/:cdProcesso/:cdFase/:cdUser

## listAll
Lista todos os históricos, retornando um objeto json.
### Método:  GET
#### Argumento(s) requerido(s): 
Nenhum
#### Retorna: Objeto **JSON** no formato:

```sh
[{
    userName: "string", 
    userCode: numeric, 
    userCompany: "string(3)", 
    eventCode: numeric, 
    eventName: "string", 
    eventDetail: "string(400)", 
    eventDate: "date", 
    timestamp: "timestamp" 
}]
```

Para solicitar a exibição de todos os registros:

    url/listAll

#### Exemplo de retorno:
    var data = [
			{ 
				userName: 'FAUSTO LUIZ GONCALES', 
				userCode: 1873170,
				userCompany: 'JOI',
				eventCode: '469',
				eventName: 'EMAIL ENVIADO',
				eventDetail: "GANHE DINHEIRO NEGOCIE SEU CONTRATO FINANCIAMENTO BANCO PAN - ID: 3\n	CHB RENTAL LTDA 12609547000178\nRUA RIO APODI Nº 432 - 32371530 - ELDORADINHO - CONTAGEM - MG\n	-ESCAVADEIRA HHIHN606VC000G054 AMARELA N.F. 12198 2012/2012\n-ESCAVADEIRA HHIHN606TB000F042 AMARELA 2012/2012\n	COMO NÃO HÁ CONTATO TELEFÔNICO, É POR MEIO DESTE RECURSO QUE OFEREÇO EM NOME DO BANCO PAN, QUE FINANCIOU PARA CHB-RENTAL, OS MAQUINÁRIOS ACIMA DESCRITOS, NEGOCIAÇÃO AMIGÁVEL E COM GRANDE VANTAGEM FIN",
				date: '2019-02-20',
				timestamp: '2019-02-20 16:17:04'
			},
			{ 
				userName: 'FAUSTO LUIZ GONCALES', 
				userCode: 1873170,
				userCompany: 'JOI',
				eventCode: '470',
				eventName: 'EMAIL ENVIADO',
				eventDetail: "GANHE DINHEIRO NEGOCIE SEU CONTRATO FINANCIAMENTO BANCO PAN - ID: 3\n	CHB RENTAL LTDA 12609547000178\nRUA RIO APODI Nº 432 - 32371530 - ELDORADINHO - CONTAGEM - MG\n	-ESCAVADEIRA HHIHN606VC000G054 AMARELA N.F. 12198 2012/2012\n-ESCAVADEIRA HHIHN606TB000F042 AMARELA 2012/2012\n	COMO NÃO HÁ CONTATO TELEFÔNICO, É POR MEIO DESTE RECURSO QUE OFEREÇO EM NOME DO BANCO PAN, QUE FINANCIOU PARA CHB-RENTAL, OS MAQUINÁRIOS ACIMA DESCRITOS, NEGOCIAÇÃO AMIGÁVEL E COM GRANDE VANTAGEM FIN",
				date: '2019-02-20',
				timestamp: '2019-02-20 16:17:04'
			},
			{...}
		];

## listOf/:index
Lista os históricos conforme a quantidade passada no argumento {index}, retornando um objeto json.
### Método:  GET
#### Argumento(s) requerido(s): 
**index** - Recebe somente valor numérico conforme lista (30, 60 e 100).
#### Retorna: 
Objeto **JSON** no formato:

```sh
[{
    userName: "string", 
    userCode: numeric, 
    userCompany: "string(3)", 
    eventCode: numeric, 
    eventName: "string", 
    eventDetail: "string(400)", 
    eventDate: "date", 
    timestamp: "timestamp" 
}]
```

Para solicitar a exibição dos últimos 30 registros:

    url/listOf/30

Para solicitar a exibição dos últimos 100 registros:

    url/listOf/100

#### Exemplo de retorno:
    var data = [
			{ 
				userName: 'FAUSTO LUIZ GONCALES', 
				userCode: 1873170,
				userCompany: 'JOI',
				eventCode: '469',
				eventName: 'EMAIL ENVIADO',
				eventDetail: "GANHE DINHEIRO NEGOCIE SEU CONTRATO FINANCIAMENTO BANCO PAN - ID: 3\n	CHB RENTAL LTDA 12609547000178\nRUA RIO APODI Nº 432 - 32371530 - ELDORADINHO - CONTAGEM - MG\n	-ESCAVADEIRA HHIHN606VC000G054 AMARELA N.F. 12198 2012/2012\n-ESCAVADEIRA HHIHN606TB000F042 AMARELA 2012/2012\n	COMO NÃO HÁ CONTATO TELEFÔNICO, É POR MEIO DESTE RECURSO QUE OFEREÇO EM NOME DO BANCO PAN, QUE FINANCIOU PARA CHB-RENTAL, OS MAQUINÁRIOS ACIMA DESCRITOS, NEGOCIAÇÃO AMIGÁVEL E COM GRANDE VANTAGEM FIN",
				date: '2019-02-20',
				timestamp: '2019-02-20 16:17:04'
			},
			{ 
				userName: 'FAUSTO LUIZ GONCALES', 
				userCode: 1873170,
				userCompany: 'JOI',
				eventCode: '470',
				eventName: 'EMAIL ENVIADO',
				eventDetail: "GANHE DINHEIRO NEGOCIE SEU CONTRATO FINANCIAMENTO BANCO PAN - ID: 3\n	CHB RENTAL LTDA 12609547000178\nRUA RIO APODI Nº 432 - 32371530 - ELDORADINHO - CONTAGEM - MG\n	-ESCAVADEIRA HHIHN606VC000G054 AMARELA N.F. 12198 2012/2012\n-ESCAVADEIRA HHIHN606TB000F042 AMARELA 2012/2012\n	COMO NÃO HÁ CONTATO TELEFÔNICO, É POR MEIO DESTE RECURSO QUE OFEREÇO EM NOME DO BANCO PAN, QUE FINANCIOU PARA CHB-RENTAL, OS MAQUINÁRIOS ACIMA DESCRITOS, NEGOCIAÇÃO AMIGÁVEL E COM GRANDE VANTAGEM FIN",
				date: '2019-02-20',
				timestamp: '2019-02-20 16:17:04'
			}
		];

## listStatus
Lista os status de fase
### Método: GET
### Argumento: 
Nenhum
### Retorna:
Objeto **JSON** no formato:

```sh
[{
    statusCode: "string",
    statusName: "string"
}]
```
Para solicitar a lista dos status

    url/listStatus

#### Exemplo de retorno:
    var data = [
			{ 
				statusCode: "5", 
				statusName: "AJUIZAMENTO"
			},
			{ 
				statusCode: "2", 
				statusName: "COBRANÇA"
			}
		];

## listFase/:cdStatus+
Lista as fases conforme o(s) código(s) passado(s) no argumento cdStatus, podendo ser passado mais de um código na mesma requisição, retornando um objeto json.
### Método:  GET
#### Argumento(s) requerido(s): 
**:cdStatus+** - array que contém o valor numérico correspondente ao código do status.
#### Retorna: 
Objeto **JSON** no formato:

```sh
[{
    faseCode: "string",
    faseName: "string"
}]
```

Para solicitar a exibição dos últimos 30 registros:

    url/listFase/[1,2]

#### Exemplo de retorno:
    var data = [
			{ 
				faseCode: "003", 
				faseName: "APREENSÃO COM CITAÇÃO"
			},
			{ 
				faseCode: "005", 
				faseName: "ENTREGA AMIGÁVEL COM QUITAÇÃO - FORMALIZADA"
			}
		];

## editHistory/:cdProcesso/:cdFase/:cdUser/:cdSec
Obtém os dados referente ao histórico que foi passado.
### Método:  GET
#### Argumento(s) requerido(s): 
**:cdProcesso** - contém o valor numérico correspondente à ficha.
**:cdFase** - contém o valor numérico correspondente ao código da fase.
**:cdUser** - contém o valor numérico correspondente à matrícula do usuário.
**:cdSec** - contém o valor numérico correspondente ao código de segurança que indica se o usuário tem permissão ou não para editar o registro. Por exemplo, se o usuário for gestor ele pode editar históricos que não são dele.
#### Retorna: 
Objeto **JSON** no formato:

```sh
[{
    userName: "string", 
    userCode: numeric, 
    userCompany: "string(3)", 
    eventCode: numeric, 
    eventName: "string", 
    eventDetail: "string(400)", 
    eventDate: "date", 
    timestamp: "timestamp" 
}]
```

Para solicitar um histórico específico:

    url/getHistory/20152058122/003/1649120/4385

#### Exemplo de retorno:
    var data = [
			{ 
				userName: 'FAUSTO LUIZ GONCALES', 
				userCode: 1873170,
				userCompany: 'JOI',
				eventCode: '469',
				eventName: 'EMAIL ENVIADO',
				eventDetail: "GANHE DINHEIRO NEGOCIE SEU CONTRATO FINANCIAMENTO BANCO PAN - ID: 3\n	CHB RENTAL LTDA 12609547000178\nRUA RIO APODI Nº 432 - 32371530 - ELDORADINHO - CONTAGEM - MG\n	-ESCAVADEIRA HHIHN606VC000G054 AMARELA N.F. 12198 2012/2012\n-ESCAVADEIRA HHIHN606TB000F042 AMARELA 2012/2012\n	COMO NÃO HÁ CONTATO TELEFÔNICO, É POR MEIO DESTE RECURSO QUE OFEREÇO EM NOME DO BANCO PAN, QUE FINANCIOU PARA CHB-RENTAL, OS MAQUINÁRIOS ACIMA DESCRITOS, NEGOCIAÇÃO AMIGÁVEL E COM GRANDE VANTAGEM FIN",
				date: '2019-02-20',
				timestamp: '2019-02-20 16:17:04'
			}
		];
		
## updateHistory
### Método:  PUT
#### Argumento(s) requerido(s): 
**:cdProcesso** - contém o valor numérico correspondente à ficha.
**:cdSec** - contém o valor numérico correspondente ao código de segurança que indica se o usuário tem permissão ou não para editar o registro. Por exemplo, se o usuário for gestor ele pode editar históricos que não são dele.
**userCod**: Matrícula do usuário que está insrerindo ou alterando,
**eventCod**: Código da fase,
**eventDetail**: Texto,
**date**: data em que ocorreu o histórico

#### Retorna: 
Objeto **JSON** no formato:

```sh
[{
    eventCode: numeric, 
    eventName: "string"
}]
```