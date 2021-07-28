## A seguir alguns passos a serem executados para o correto funcionamento do cobapp com IE 11:

Após instalar os módulos necessários do cobapp:

Adicionar no index.js

`import 'react-app-polyfill/ie11';`
`import 'react-app-polyfill/stable';`

Adicionar no Index.html
`<meta http-equiv="X-UA-Compatible" content="IE=11">`

node_modules > react-dev-utils > webpackHotDevClient.js na linha 62:
Verificar o protocolo que está sendo acesso para compôr a url adequadamente;

`protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',`

e adicionar após o atributo pathname, `slashes: true,`

No package.json substituir browserlist por:
`"browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version",
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }`