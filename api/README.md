# Documentação da API

Essa documentação tem por objetivo especificar o funcionamento das rotas desta API .
<!--
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
-->

## Rotas disponíveis:

- generateHashCode
- validateJsonWebToken/{JWToken}
- checkToken
- registerPrivateToken
- autoAuthentication
- listEvents
- event/{eventHash}
- event
- event/{eventHash}/{eventReason}
- listOptionEvent/{param}
- listStatus/{param}
- listFase/:cdStatus+
- listCall
- dateDataBaseCall
- contract/{contractCode}/{nMostrarEnderecoCliente}

## generateHashCode
	url_api/generateHashCode

Essa rota deve ser executada somente para autenticação de rotas de sistema, como no caso 
as telas de histórico e acionamento do cobsystem.
Deverá ser executada uma vez, como uma espécie de gerador de chave de licença para 
instalação de um software.
Após gerado este token, deve ser fixado no Header das solicitações do sistema.

#### Método:  GET

#### Argumento(s) requerido(s): Nenhum

#### Retorna: Objeto **JSON** no formato:

```sh
    "stringExemplo"
```

#### Exemplo de retorno:

"15160438175db1e22f02f1e1.84911124MTgxMDEwNTg2MjVkYjFlMjJmMDJmMzI5Ljc1MzUwNTA120571131345db1e22f02f349.96895957Njc3MDcyNTc3NWRiMWUyMmYwMmYzNTQuNDg1NTU5ODM="

## validateJsonWebToken/{JWToken}
	url_api/validateJsonWebToken/{JWToken}

Útil para fins de validação/teste sobre o Token que está sendo passado. Recebe o JSON Web Token pela URL e valida se o token não está expirado

#### Método:  GET

#### Argumento(s) requerido(s): 
JWToken

#### Retorna: Mensagem com o token informado e o status da validação do token

## checkToken

Verifica se o token que está sendo passado é válido, e se não está expirado.

#### Método: GET

#### Argumento(s) requerido(s): 
O cabeçalho da requisição deve conter o token presente no ítem Authorization.

#### Retorna: Objeto **JSON** no formato:

```sh
    {ok: true/false; status: Autenticado/Token Inválido}
```

## registerPrivateToken
	url_api/registerPrivateToken

1. `registerPrivateToken` gerará um token privado que não expira e servirá de parâmetro
de validação para a aplicação saber se o token primário deve ser renovado automaticamente
ou se deve expirar levando o usuário, por exemplo, à uma tela de login, caso este, que se
aplica por exemplo, ao projeto localizadores.
	
	###### NOTA: Se o acesso for pelo CobSystem o atributo "key" presente na URL informa a data do acesso, criptografada. Ele deve ser atribuído ao atributo access-timeout do cabeçalho desta requisição. Se no momento da chamada do registerPrivateToken o access-timeout + 4 horas for superior ou igual à data/hora atual segue adiante com a geração do token privado, o quê resultará na autorização do token para o "Authorization", caso contrário significa que atingiu-se o tempo limite para renovação do token "Authorization". Nesse caso, para o Cobsystem, o usuário deverá acessar a ficha novamente para que o atributo "key" receba nova data.
	
2. O valor da variável $secrect foi gerado com a chamada da rota `generateHashCode`.
3. O cabeçalho desta requisição deve conter um atributo reservado com valor igual a variável
	`$secret`
4. O módulo deve ser informado como atributo de post exemplo (histórico, acionamento, etc)
5. Para o módulo histórico e o acionemtno o atributo a ser passado é "78289360Mjc4MjU1ZDEwY2NkMDJhMGNlOC4zNzM3NjkyOA
	e seu valor deve ser igual à 246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5 ;

#### Método: GET

#### Argumento(s) requerido(s): 
A requisição deve conter no cabeçalho 3 atributos:
###### access-global-code : Contém a matrícula do usuário criptografada e em base 64.
###### access-timeout : Contém a data do acesso criptografasa e vinda do Cobsystem
Hash do módulo histórico / acionamento: 
##### 78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa
Valor do hash:
###### 246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5

#### Retorna:
```sh
	{ok: false; message: 'registerPrivateToken: Acesso inválido'} ou
	{ok: true; token: 'Hash do JSONWebToken'}
```

## autoAuthentication
	url_api/autoAuthentication

O objetivo dessa rota é renovar o token de forma automática com validade de 1 hora, no caso, sem a necessidade de o usuário se logar numa tela ou entrar na ficha novamente pelo Cobsystem. Essa autenticação automática só será possível se houver sucesso na chamada da rota registerPrivateToken, ou seja, se há um token para o atributo private-control presente no cabeçalho da solicitação
#### Método: GET

#### Argumento(s) requerido(s): 
Deve conter na sua requisição o atributo private-control (obtido atravé da rota registerPrivateToken) e o access-global-code que é a matrícula do usuário criptografada e em base 64.

#### Retorna:
```sh
	{ok: false; message: 'Problema na autoAuthentication'} ou
	{ok: true; token: 'Hash do JSONWebToken'}
```

## listOptionEvent
	url_api/listOptionEvent/{param}
Lista as quantidades de registros disponiveis

#### Método: GET

#### Argumento(s) requerido(s): 
##### Param : Refere-se ao parâmetro para saber qual será considerado ao retornar a quantidade de registros.

#### Retorna: 
```sh
	[30,60,100,1000,"Todos os"]
```

Para solicitar a quantidade de registros disponíveis de historico:

	url_api/listOptionEvent/historico

#### Exemplo de retorno:
	[
		30,
		60,
		100,
		1000,
		"Todos os"
	]

Para solicitar a quantidade de registros disponíveis de acionamento:

	url_api/listOptionEvent/acionamento

#### Exemplo de retorno:
	[
		30,
		60,
		100,
		1000,
		"Todos os"
	]

## listStatus
	url_api/listStatus/{param}

Lista status de fase

#### Método: GET
#### Argumento(s) requerido(s): 
##### Param : Refere-se ao parâmetro para saber qual será considerado ao retornar os status.

#### Retorna:
Objeto **JSON** no formato:

```sh
[{
    statusCode: "string",
    statusName: "string"
}]
```
Para solicitar a lista dos status de historico:

    url/listStatus/historico

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

Para solicitar a lista dos status de acionamento:
	
	url/listStatus/acionamento

#### Exemplo de retorno:
	[
		{
			"statusName": "AGENTE VIRTUAL - ACESSO",
			"statusCode": "104"
		},
		{
			"statusName": "AGENTE VIRTUAL - MAQUINA",
			"statusCode": "103"
		},
		{
			"statusName": "ATENDIMENTO - ELETRÔNICO",
			"statusCode": "6"
		},
		{
			"statusName": "CARTA - ENVIO",
			"statusCode": "14"
		},
	]

## listFase
Lista as fases conforme o(s) código(s) passado(s) no argumento cdStatus, podendo ser passado mais de um código na mesma requisição, retornando um objeto json.
#### Método:  POST
#### Argumento(s) requerido(s): 
**cdStatus** - array que contém o valor numérico correspondente ao código do status.
**param** - string informando para qual módulo se está pesquisando, se é para 'historico', ou 'acionamento'
#### Retorna: 
Objeto **JSON** no formato:

```sh
[{
    faseCode: "string",
    faseName: "string"
}]
```

Para solicitar, efetue uma requisição via POST para a url abaixo enviando cdStatus e param

    url/listFase

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

## listEvents
	url_api/listEvents

Lista o histórico de uma ficha.

#### Método: POST

#### Argumento(s) requerido(s): 
###### Authorization: token válido presente no cabeçalho da requisição listEvents
###### cdProcesso: Contém a ficha a ser pesquisada.
###### index: É o número de registros a serem retornados. Os valores disponíveis podem ser consultados através da rota "listOptionEvent".

#### Argumento(s) opcionais: 
###### cdStatus = Refere-se aos status das fases a serem consideradas na consulta.
###### fase = Contém a relação de fases a serem consideradas na consulta.
###### dataDe = Data inicial a ser considerada a ocorrência da(s) fase(s).
###### dataAte = Data final a ser considerada a ocorrência da(s) fase(s).
###### offset = Utilizado para paginação do resultado. Define a partir de qual offset será exibido o resultado da consulta.
###### limiter = Utilizado para paginação, limita a quantidade de registros a serem exibidos.

#### Exemplo 1 de Retorno:
```sh
	{events:
		[{eventDate: "11\/03\/2019",
		userCode: "TATIANE S",
		timestamp: "2019-03-11 08:28:49.507",
		userName: "TATIANE DA SILVA FRANCA",
		userCompany: "",
		eventId: "1",
		eventCode: "364",
		eventDetail: "VALOR DE QUITA\u00c7\u00c3O CONTRATUAL (BASE DE CAMPANHA MAR\u00c7O) = 3981,23",
		eventName: "VALOR DE QUITA\u00c7\u00c3O CONTRATUAL",
		userCodeUpdated: null,
		eventDateUpdated: null,
		userNameUpdated: ""},
		],
		totalEvents: 3,
		offset: 0
	}
```
#### Exemplo 2 de Retorno:
```sh
	{message: "Ocorreu algum problema interno na execução da rota listEvent. Entre em contato com a
	área de TI através do Chamado pelo SE."}
```

## event/{eventHash}
	Retorna apenas o histórico a partir do eventHash	

#### Método: GET

#### Argumento(s) requerido(s): 
###### Authorization: token válido presente no cabeçalho da requisição getEvent
###### eventHash: O eventHash é uma seqüência de informações criptogradas, dentre elas, está presente a própria ficha, a matrícula do usuário, as permissões dele entre outros em base 64.
###### Exemplo de como o eventHash de um histórico é montado na recepção dos dados vindos da requisição listEvents: 
```sh
eventHash : base64_encode(params.cdProcesso + event.eventDate.replace(/\//g, "") + str_pad(event.eventCode, 3, "0", "STR_PAD_LEFT") + str_pad(event.eventId, 3, "0", "STR_PAD_LEFT") + str_pad(glbUsuario, 10, " ", "STR_PAD_LEFT") + str_pad(codigoAcesso, 10, "0", "STR_PAD_LEFT") + event.timestamp + str_pad(event.userCode, 10, "0", "STR_PAD_LEFT"))

NOTA: "params" é o objeto de parâmetros utilizado na requisição listEvents. Como o cdProcesso já está presente nesse caso, no front, não há necessidade de pegá-lo do objeto event.
"event" é um objeto resultante da chamada listEvents. Dele são utilizados os atributos eventDade, eventCode, eventId, timestamp, userCode
glbUsuario é a matrícula do usuário, vinda do cobsystem
codigoAcesso é o código de acesso do usuário, onde é possível saber se ele pode alterar, ou excluir, mesmo passando de 5 dias após insersão do histórico.
```
#### Retorna:
```sh
	[{
		eventDate: "2019-10-25",
		timestamp: "2019-10-25 15:36:01",
		userCode: "1649120",
		userName: "FELIPE PETUCO DE MELO",
		userCompany: "JOI",
		eventId: 1,
		eventCode: 75,
		eventDetail: "DILIGENCIAS\/FOTOCOPIA EFETUADA.",
		eventName: "DILIG\u00caNCIAS",
		userCodeUpdated: null,
		eventDateUpdated: null,
		userNameUpdated:""
	}]
```

## event
	url_api/event/{eventHash}

Altera a descrição do historico.

#### Método: PUT

#### Argumento(s) requerido(s): 
###### Authorization: token válido presente no cabeçalho da requisição getEvent
###### eventHash: O eventHash é uma seqüência de informações criptogradas, dentre elas, está presente a própria ficha, a matrícula do usuário, as permissões dele entre outros em base 64. 
###### cdProcesso: Código da ficha.
###### dtHistorico: Data do histórico.
###### cdHistorico: Código do Histórico.
###### cdDescricaoHistorico: Fase do Hhistórico.
###### glbUsuario: Matrícula do usuário que está acessando.
###### eventDetail: Texto que substituirá o texto atual do histórico.


#### Retorna:
```sh
	JSON com código de status: 200, 400 ou 500
```

## event/{eventHash}/{eventReason}
	url_API/event/{eventHash}/{eventReason}

Deleta um histórico a partir dos parâmetros passados.

#### Método: DELETE

#### Argumento(s) requerido(s):
###### Authorization: token válido presente no cabeçalho da requisição getEvent
###### eventHash: O eventHash é uma seqüência de informações criptogradas, dentre elas, está presente a própria ficha, a matrícula do usuário, as permissões dele entre outros em base 64. 
###### cdProcesso: Código da ficha.
###### dtHistorico: Data do histórico.
###### cdHistorico: Código do Histórico.
###### cdDescricaoHistorico: Fase do Hhistórico.
###### glbUsuario: Matrícula do usuário que está acessando.
###### eventReason: Texto que preenche como justificativa o porque que está deletando o histórico.


#### Retorna:
```sh
	JSON com código de status: 200, 400 ou 500
```

## listCall
	url_api/listCall

Lista o acionamento de uma ficha.

#### Método: POST

#### Argumento(s) requerido(s): 
###### Authorization: token válido presente no cabeçalho da requisição listCall
###### cdProcesso: Contém a ficha a ser pesquisada.
###### index: É o número de registros a serem retornados. Os valores disponíveis podem ser consultados através da rota "listOptionEvent".

#### Argumento(s) opcionais: 
###### cdStatus: Refere-se aos status das fases a serem consideradas na consulta.
###### fase: Contém a relação de fases a serem consideradas na consulta.
###### dataDe: Data inicial a ser considerada a ocorrência da(s) fase(s).
###### dataAte: Data final a ser considerada a ocorrência da(s) fase(s).
###### offset: Utilizado para paginação do resultado. Define a partir de qual offset será exibido o resultado da consulta.
###### limiter: Utilizado para paginação, limita a quantidade de registros a serem exibidos.
###### filterCall: Filta os acionamentos pelos grupos (Alô, CPC, Trabalhado, Agendamento, RecebimentoSMS, Acordo Boleto, Promessa Pagamento, Pesquisa e Todos)
###### listCallBackup: Parâmetro booleano que determina se as informações serão buscadas da base acionametno ou da base congelada do acionamento.

#### Exemplo 1 de Retorno:
```sh
	{calls: [
		{
			processCode: 2018205812,
			calledCode: 2171019,
			called: "LUCIANO STOLLBERG",
			branch: 7090,
			eventDate: "04\/10\/2018",
			type: "Email",
			actionType: "Eletr\u00f4nico",
			result: "ENVIO",
			complement: "ENVIO DE EMAIL",
			description: "MODELO: 0869 - PAN LEVES NEGOCIA\u00c7\u00c3O IMPERDIVEL- ASSUNTO: APROVEITE A \u00d3TIMA OPORTUNIDADE PARA NEGOCIAR O FINANCIAMENTO DO VEICULO !",
			idCall: "",
			phone: 0,
			email: "psvs.eros53@outlook.com",
			middle: ""
		}
	],
	totalCalls: 1,
	offset: 0}
```

## dateDataBaseCall
	url_api/dateDataBaseCall
Retorna data base de acionamento
#### Método: GET

#### Argumento(s) requerido(s): Nenhum

#### Retorna:
Objeto **JSON** no formato:

```sh
[{
    dt_base_acionamento: "string",
    lb_data_base_acionamento: "string"
}]
```

Para solicitar a data da base de acionamento

    url_api/dateDataBaseCall

#### Exemplo de retorno:
	{
		"dt_base_acionamento": "01\/01\/2018",
		"lb_data_base_acionamento": "01\/01\/2018"
	}

## contract/{contractCode}/{nMostrarEnderecoCliente}

#### Método: GET

#### Argumento(s) requerido(s): 
##### contactCode : Contém a ficha a ser pesquisada.
##### nMostrarEnderecoCliente : Refere-se a uma condição do CobSystem, se estiver flegado é setado como True, se não, False.


Para solicitar, efetue uma requisição via GET para a url abaixo enviando contractCode e o nMostrarEnderecoCliente

	url_api/contract/2013031750/False

#### Retorna:
Objeto **JSON** no formato:

```sh
{
  "feriado": {
    "Feriado": ""
  },
  "dt_cadastro": "2013-01-14 00:00:00.000",
  "dt_judicial": "2013-03-07 00:00:00.000",
  "fl_cedidos_bv": "",
  "cd_avalista": "",
  "fl_revisional": "1",
  "nr_codigo_cliente": "12024000222489",
  "de_bvmais": "N",
  "de_bvdoc": "",
  "cd_causa_abn": "",
  "cd_regiao_abn": "",
  "de_dados_sicoob": "",
  "de_loja": "OZIAS COMERC VEIC",
  "de_obs_loja": "",
  "GRUPOCLIENTENOME": "BV JURÍDICO",
  "CTUBB": "",
  "cd_rating_pan": "WO",
  "STATE": "REV",
  "cd_cobrador": "1661767",
  "COBRADOR1": "ANA PAULA ROHDEN",
  "cd_cobrador2": "",
  "COBRADOR2": "",
  "cd_cobrador_auxiliar": "",
  "COBRADOR3": "",
  "AVALISTA": "",
  "cd_cliente": "131366",
  "CDGRUPOCLI": "26",
  "CLIENTE": "BV FINANCEIRA S\/A CFI",
  "cd_devedor": "1263932",
  "DEVEDOR": "MANOEL DE ARCICA",
  "CDGRUPODEV": "",
  "de_observacao": "",
  "EACAOCONTRA": "NÃO",
  "cd_alerta": "",
  "fl_calculo_geral": "",
  "CPFCNPJAVALISTA": "",
  "CPFCNPJDEVEDOR": "38852870997",
  "ENDERECODEVEDOR": "R HERMINIO VALINAS 170 - 83215570 - CONJUNTO RESIDENCIAL - PARANAGUÁ - PR",
  "MARCACAO": "C",
  "informacoes2": {
    "cd_titulo": "500348632",
    "Parcela": "025",
    "Plano": "60",
    "Vencimento": "2012-11-04 00:00:00.000",
    "DataVencimento": "2012-11-04",
    "ValorParcela": "558.2200",
    "ParcelasVencida": "36",
    "Atraso": "2563",
    "Cadastro": "2013-01-14 00:00:00.000",
    "DataCadastro": "2013-01-14",
    "ValorAberto": "20095.9200",
    "ValorRisco": "20095.9200"
  },
  "bancoBV": {
    "vl_mora": "",
    "vl_multa": "",
    "cd_tipo_bem": "",
    "de_tipo_bem": "",
    "cd_produto": "",
    "de_produto": "",
    "cd_modalidade": "",
    "de_modalidade": "",
    "cd_filial": "",
    "de_filial": "",
    "cd_regiao": "",
    "de_regiao": "",
    "tx_juros": "",
    "tx_cet": "",
    "vl_risco": "",
    "de_empresa": "",
    "cd_score": "",
    "de_regiao_nova": "",
    "cd_regiao_nova": "99999",
    "vl_bem": ".0000",
    "vl_contabil": ".0000",
    "nr_dia_recorrente": "",
    "nr_proposta": "",
    "fl_suspenso": "",
    "motivo_bloqueio": "",
    "vl_financiado": "19888.1800",
    "dt_bloqueio": ""
  },
  "quantidadeParcela": {
    "Count": 0
  },
  "quantidadeGarantia": {
    "Count": "1"
  },
  "dadosGarantia": [
    {
      "nr_bem": "1",
      "de_veiculo_modelo": "FIESTA EDGE",
      "de_veiculo_marca": "FORD",
      "de_veiculo_cor": "CINZA",
      "de_veiculo_placa": "ALJ6443",
      "de_ano_fabricacao": "2003",
      "de_ano_modelo": "2004",
      "nr_renavam": "817310444",
      "de_chassi": "9BFZF12C948163777",
      "cd_codigo_molicar": null,
      "de_tipo_bem": "AUTOMÓVEL"
    }
  ],
  "quantidadeDespesa": {
    "Count": "1"
  },
  "dadosDespesa": [
    {
      "de_custas": "CUSTAS FINAIS",
      "vl_valor": "12.1300",
      "dt_cadastro": "2016-09-09",
      "dt_reembolso": "09\/11\/2016"
    }
  ],
  "dadosSomaDespesa": "12.1300",
  "dadosDespesaVencer": ""
}
```
