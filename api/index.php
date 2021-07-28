<?php

date_default_timezone_set('America/Sao_Paulo');

require __DIR__.'/vendor/autoload.php';

require_once 'utils.php';
require_once 'functions.php';

use Utils as Utils;
use Functions as Functions;

/*********************************************

Secret Key orign: Schulze-Api
In SHA256: 1eb9ace301a534911727741fe4b136032ee0245353114c308f3a306c61e8b341
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkuc2NodWx6ZSIsInN1YiI6InVzZXIiLCJ1c2VyIjoiMTY0OTEyMCIsImlhdCI6IjE1NjA1MjE4MzIiLCJleHAiOiIxNTYwNTUwNjMyIn0.k6WF0sKtnTeW6ggwka3604I05m6lWBIj509OTDQc448
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IlRoaWFnbyIsInN1YiI6IjEzIiwianRpIjoiZDBlMGFkZDItOTlkMC00NWY1LThlYzEtY2FiYzIwZjkxMGYyIiwiaWF0IjoxNTAwMDMzMjE0LCJKd3RWYWxpZGF0aW9uIjoiVXN1YXJpbyIsIm5iZiI6MTUwMDAzMzIxMywiZXhwIjoxNTAwMDMzMjczLCJpc3MiOiJJc3N1ZXIiLCJhdWQiOiJBdWRpZW5jZSJ9.SmjuyXgloA2RUhIlAEetrQwfC0EhBmhu-xOMzyY3Y_Q

*********************************************/

$container['secretkey'] = '1eb9ace301a534911727741fe4b136032ee0245353114c308f3a306c61e8b341';

$app = new Slim\App($container);

$app->get('/', function () {
    echo 'API SCHULZE .. !';
});

$app->get('/validateJsonWebToken/{JWToken}', function ($request, $response, $args) {
    $status = Utils\checkValidateJsonWebToken($args['JWToken']) ? 'OK' : 'Inválido';
    echo 'JWToken: '.$args['JWToken'].'<br>validateJsonWebToken:'.$status;
});

$app->get('/generateHashCode', function ($request, $response, $args) {
    /*********************************************

        1- Essa rota deve ser executada somente para autenticação de rotas de sistema,
            como no caso as telas de histórico e acionamento do cobsystem.
        2 - Deverá ser executada uma vez, como uma espécie de gerador de chave de licença
            para instalação de um software.
        3 - Após gerado este token, deve ser fixado no Header das solicitações do sistema.

        *********************************************/
    error_log('Requisitado generateHashCode');

    return $response->withJson(Utils\generateHashCode(), 200)
        ->withHeader('Content-type', 'application/json');
});

$app->get('/checkToken', function ($request, $response, $args) {
    $code = 200;
    $ok = false;
    $status = 'Token Inválido';
    //  error_log('checkToken:'.$request->getHeaderLine('authorization'));
    if (Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        $code = 200;
        $ok = true;
        $status = 'Autenticado';
    }

    return $response->withJson(['ok' => $ok, 'status' => $status], $code)
    ->withHeader('Content-type', 'application/json');
});

$app->get('/registerPrivateToken', function ($request, $response, $args) {
    /*********************************************

        1 - registerPrivateToken gerará um token que não expira e que servirá de parâmetro
        de validação para a aplicação saber se o token primário deve ser renovado automaticamente
        ou se deve expirar levando o usuário, por exemplo, à uma tela de login; caso este, que se
        aplica por exemplo, ao projeto localizadores.

        2 - O valor da variável $secrect foi gerado com a chamada da rota generateHashCode.
        3 - O cabeçalho desta requisição deve conter um atributo reservado com valor igual a variável
            $secret
        4 - O módulo deve ser informado como atributo de post exemplo (histórico, acionamento, etc)
        5 - Cada módulo possui um atributo reservado:
            5.1 - Para o módulo histórico e o acionemtno o atributo a ser passado é "78289360Mjc4MjU1ZDEwY2NkMDJhMGNlOC4zNzM3NjkyOA
            e seu valor deve ser igual à 246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5 ;

    **********************************************/

    $code = 401;
    $token = ['ok' => false, 'message' => 'registerPrivateToken: Acesso inválido'];
    $glbUsuario = Utils\decrypt(urldecode(base64_decode($request->getHeaderLine('access-global-code'))));
    $result = Functions\verifyUser($glbUsuario);
    $accessTimeout = false;

    if ($request->hasHeader('access-timeout')) {
        $timeout = strtotime(str_replace('/', '-', $request->getHeaderLine('access-timeout')).' +4 hours');

        //  error_log('time:'.$request->getHeaderLine('access-timeout')."\ntimeout:".$timeout);

        //  Verifica a diferença com a data atual em minutos
        $diff = floor(($timeout - strtotime(date('Y-m-d H:i:s'))) / (60));

        if ($diff >= 0) {
            //  error_log('Token ok');
            $accessTimeout = true;
        } else {
            //  error_log('Token expirou');
        }
    }

    if ($result && $accessTimeout) {
        try {
            $key = $request->hasHeader('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa') ? ($request->getHeaderLine('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa') === '246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5' ? $request->getHeaderLine('78289360mjc4mju1zdewy2nkmdjhmgnloc4znzm3njkyoa') : null) : null;
            switch ($key) {
                case '246465d10d4f26d7eb9.02301486NTE5NWQxMGQ0ZjI2ZDdlYjkuNjUyMTIyNDQ=120845d10d4f26d7eb0.75149412ODU0MTVkMTBkNGYyNmQ3ZWIyLjU5NjczNjE5':
                    $code = 200;
                    $token = ['ok' => true, 'token' => Utils\generateJsonWebToken($glbUsuario, null, 'private', $accessTimeout)];
                    break;
                default:
                    break;
            }
        } catch (Exception $e) {
            error_log($e);
        }
    } else {
        error_log('registerPrivateToken: Usuario inválido: '.$glbUsuario.', access-global-code:'.$request->getHeaderLine('access-global-code'));
    }

    return $response->withJson($token, $code)
        ->withHeader('Content-type', 'application/json');
});

$app->get('/autoAuthentication', function ($request, $response, $args) {
    $code = 401;
    $token = array('ok' => true, 'message' => 'Problema na autoAuthentication');
    //  error_log('autoAuthentication');
    if ($request->hasHeader('private-control')) {
        try {
            $glbUsuario = Utils\decrypt(urldecode(base64_decode($request->getHeaderLine('access-global-code'))));
            $result = Functions\verifyUser($glbUsuario);
            if ($result) {
                $token = array('ok' => true, 'token' => Utils\generateJsonWebToken($glbUsuario, '+3 hours', 'private'));
                $code = 200;
                $signature = explode('.', $token['token']);
            }
        } catch (Exception $e) {
            error_log($e);
        }
    }

    return $response->withJson($token, $code);
});

// rota para listar históricos a partir de um parâmetro de limite e código do processo
$app->post('/listEvents', function ($request, $response, $args) {
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas.', 'status' => 403), 403);
        exit;
    }

    $code = 400; //  Bad Request
    $cdStatus = array();
    $parsedBody = $request->getParsedBody();
    $index = $parsedBody['index'];

    try {
        Functions\is_valid_index_listOf($index);
    } catch (Exception $e) {
        error_log($e);
        exit;
    }

    $cdStatus = !empty($parsedBody['listStatus']) ? $parsedBody['listStatus'] : null;
    $fase = !empty($parsedBody['listFase']) ? $parsedBody['listFase'] : null;
    $dataDe = !empty($parsedBody['dataDe']) ? $parsedBody['dataDe'] : '';
    $dataAte = !empty($parsedBody['dataAte']) ? $parsedBody['dataAte'] : '';
    $offset = isset($parsedBody['offset']) && !is_null($parsedBody['offset']) ? $parsedBody['offset'] : null;
    $limiter = !empty($parsedBody['limiter']) ? $parsedBody['limiter'] : null;
    $cdProcesso = $parsedBody['cdProcesso'];

    try {
        $result = Functions\listEvents($index, $cdProcesso, $dataDe, $dataAte, $cdStatus, $fase, $offset, $limiter);
        $code = 200;
    } catch (Exception $e) {
        throw new \Exception('Problema na rota listEvent: '.$e->getCode().' - '.$e->getMessage());

        return $response->withJson(array('message' => 'Ocorreu algum problema interno na execução da rota listEvent. Entre em contato com a área de TI através do Chamado pelo SE.'), 500);
    }

    return $response->withJson($result, $code);
});

// rota para retornar as opções de limite de históricos
$app->get('/listOptionEvent/{route}', function ($request, $response, $args) {
    $route = $args['route'];

    switch ($route) {
        case 'historico':
            $array = [
                30,
                60,
                100,
                250,
                500,
                'Todos os',
            ];
        break;
        case 'acionamento':
            $array = [
                30,
                60,
                100,
                'Todos os',
            ];
    }

    return $response->withJson($array, 200);
});

// rota para retornar os status da ficha do histórico
$app->get('/listStatus/{route}', function ($request, $response, $args) {
    $route = $args['route'];

    switch ($route) {
        case 'historico':
            $obj = array();
            $obj[] = array('statusCode' => 1, 'statusName' => 'Ajuizamento');
            $obj[] = array('statusCode' => 5, 'statusName' => 'Busca e Apreensão');
            $obj[] = array('statusCode' => 2, 'statusName' => 'Cobrança');
            $obj[] = array('statusCode' => 3, 'statusName' => 'Encerramento');
            $obj[] = array('statusCode' => 4, 'statusName' => 'Sentença');
            $obj[] = array('statusCode' => 6, 'statusName' => 'Liberação/Remoção');
            break;
        case 'acionamento':
            $obj = Functions\listStatusCall();
            break;
        default:
    }

    return $response->withJson($obj, 200);
});

// rota para listar as fases do histórico a partir de um código de status recebido na requisição
$app->post('/listFase', function ($request, $response, $args) {
    $parsedBody = $request->getParsedBody();
    $cdStatus = $parsedBody['cdStatus'];
    $route = $parsedBody['route'];

    try {
        $result = Functions\listFase($cdStatus, $route);
    } catch (Exception $e) {
        error_log($e);
        exit;
    }

    return $response->withJson($result, 200);
});

// rota para retornar apenas 1 histórico a partir do código do processo, código do histórico, e código da descrição do histórico
$app->get('/event/{eventHash}', function ($request, $response, $args) {
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas. Event: getEvent', 'status' => 403), 403);
        exit;
    }

    $eventHash = Utils\decryptEventHash($args['eventHash']);

    try {
        $result = array('event' => Functions\getEvent($eventHash['cdProcesso'], $eventHash['dtHistorico'], $eventHash['cdHistorico'], $eventHash['cdDescricaoHistorico']), 'status' => 200);
        $code = 200;
    } catch (Exception $e) {
        error_log($e);
        exit;
    }

    return $response->withJson($result, $code);
});

// rota para alterar os campos de um histórico a partir dos parâmetros passados
// $cdProcesso, $eventDate, $eventId, $eventCode, $nAndamento, $eventDetail
$app->put('/event', function ($request, $response, $args) {
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas.', 'status' => 403), 403);
        exit;
    }

    $result = array();
    $code = 400;

    if (!$request->hasHeader('access-global-code')) {
        $result = ['message' => 'Invalid access-global-code'];
        $code = 400;
    } else {
        $glbUsuario = Utils\decrypt(urldecode(base64_decode($request->getHeaderLine('access-global-code'))));

        if (!Functions\verifyUser($glbUsuario)) {
            $result = ['message' => 'Invalid User'];
            $code = 400;
        } else {
            $parsedBody = $request->getParsedBody();
            $eventHash = $parsedBody['eventHash'];
            $eventHash = Utils\decryptEventHash($eventHash);

            $de_descricao = $parsedBody['eventDetail'];

            try {
                $result = Functions\updateEvent($eventHash['cdProcesso'], $eventHash['dtHistorico'], $eventHash['cdHistorico'], $eventHash['cdDescricaoHistorico'], $glbUsuario, $de_descricao);
                $code = 200;
            } catch (Exception $e) {
                $result = ['message' => 'Internal problem'];
                $code = 500;
            }
        }
    }

    return $response->withJson($result, $code);
});

// rota para deletar um histórico a partir dos parâmetros passados
$app->delete('/event/{eventHash}/{eventReason}', function ($request, $response, $args) {
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas. Event: getEvent', 'status' => 403), 403);
        exit;
    }

    $result = array();
    $code = 400;

    if (!$request->hasHeader('access-global-code')) {
        $result = ['message' => 'Invalid access-global-code'];
        $code = 400;
    } else {
        $glbUsuario = Utils\decrypt(urldecode(base64_decode($request->getHeaderLine('access-global-code'))));
        $eventAccessCode = Utils\decrypt(urldecode(base64_decode($request->getHeaderLine('access-global-code'))));

        if (!Functions\verifyUser($glbUsuario)) {
            $result = ['message' => 'Invalid User'];
            $code = 400;
        } else {
            $eventHash = Utils\decryptEventHash($args['eventHash']);
            try {
                $result = Functions\deleteEvent($eventHash['cdProcesso'], $eventHash['cdHistorico'], $eventHash['cdDescricaoHistorico'], $eventHash['dtHistorico'], $glbUsuario, $eventAccessCode, base64_decode($args['eventReason']));
                $code = 200;
            } catch (Exception $e) {
                $result = ['message' => 'Internal problem'];
                $code = 500;
            }
        }
    }

    return $response->withJson($result, $code);
});

// rota para listar os acionamentos a partir de um parâmetro de limite e código do processo
$app->post('/listCall', function ($request, $response, $args) {
    /*
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas.', 'status' => 403), 403);
        exit;
    }
    */
    $code = 400; //  Bad Request
    $cdStatus = array();
    $parsedBody = $request->getParsedBody();
    $index = $parsedBody['index'];

    try {
        Functions\is_valid_index_listOf($index);
    } catch (Exception $e) {
        error_log($e);
        exit;
    }

    $cdStatus = !empty($parsedBody['listStatus']) ? $parsedBody['listStatus'] : null;
    $fase = !empty($parsedBody['listFase']) ? $parsedBody['listFase'] : null;
    $dataDe = !empty($parsedBody['dataDe']) ? $parsedBody['dataDe'] : '';
    $dataAte = !empty($parsedBody['dataAte']) ? $parsedBody['dataAte'] : '';
    $filterCall = !empty($parsedBody['filterCall']) ? $parsedBody['filterCall'] : '';
    $backupCall = !empty($parsedBody['listCallBackup']) ? $parsedBody['listCallBackup'] : '';
    $offset = isset($parsedBody['offset']) && !is_null($parsedBody['offset']) ? $parsedBody['offset'] : null;
    $limiter = !empty($parsedBody['limiter']) ? $parsedBody['limiter'] : null;
    $cdProcesso = $parsedBody['cdProcesso'];

    try {
        $result = Functions\listCall($index, $cdProcesso, $dataDe, $dataAte, $cdStatus, $fase, $filterCall, $backupCall, $offset, $limiter);
        $code = 200;
    } catch (Exception $e) {
        throw new \Exception('Problema na rota listCall: '.$e->getCode().' - '.$e->getMessage());

        return $response->withJson(array('message' => 'Ocorreu algum problema interno na execução da rota listCall. Entre em contato com a área de TI através do Chamado pelo SE.'), 500);
    }

    return $response->withJson($result, $code);
});

$app->get('/dateDataBaseCall', function ($request, $response, $args) {
    /*if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas.', 'status' => 403), 403);
        exit;
    }
*/
    try {
        $result = Functions\getDateDataBaseCall();
    } catch (Exception $e) {
        throw new \Exception('Problema na rota getDateDataBaseCall: '.$e->getCode().' - '.$e->getMessage());

        return $response->withJson(array('message' => 'Ocorreu algum problema interno na execução da rota getDateDataBaseCall. Entre em contato com a área de TI através do Chamado pelo SE.'), 500);
    }

    return $response->withJson($result, 200);
});

// rota para listar os eventos do contrato do asp
$app->get('/contract/{contractCode}/{nMostrarEnderecoCliente}', function ($request, $response, $args) {
    if (!Utils\checkValidateJsonWebToken($request->getHeaderLine('authorization'))) {
        return $response->withJson(array('message' => 'Suas credenciais de acesso não são válidas.', 'status' => 403), 403);
        exit;
    }

    try {
        $result = Functions\getContract($args['contractCode'], $args['nMostrarEnderecoCliente']);
    } catch (Exception $e) {
        throw new \Exception('Problema na rota getContract: '.$e->getCode().' - '.$e->getMessage());

        return $response->withJson(array('message' => 'Ocorreu algum problema interno na execução da rota getContract. Entre em contato com a área de TI através do Chamado pelo SE.'), 500);
    }
    // error_log(print_r($result, true));

    return $response->withJson($result, 200);
});

//  Gera marca d'agua
$app->get('/getWatermark/{id}/{key}', function ($request, $response, $args) {
    try {
        $ip = Utils\getIp();

        // ***************************************************************************************************
        $dir = 'http://'.$_SERVER['HTTP_HOST'].'/watermark/';
        $dir_Local = $_SERVER['DOCUMENT_ROOT'].'/watermark/';
        $file = $args['id'].'_'.str_replace('.', '', $ip);
        $file .= '.png';

        //if (!file_exists($dir . $file))
        //{
        $string = $args['id'].' '.$ip.' '.date('d/m/Y H:i:s');

        $width = intval(strlen($string) * 6.2);

        $im = @imagecreate($width, 16);
        $background = imagecolorallocate($im, 255, 255, 255);
        $colorString = imagecolorallocate($im, 238, 233, 233);
        imagestring($im, 2, 0, 0, $string, $colorString);
        imagepng($im, $dir_Local.$file);
        imagedestroy($im);
        //}
        $result = array('src' => $dir.$file, 'status' => 200);
        // ***************************************************************************************************
    } catch (Exception $e) {
        throw new \Exception('Problema na rota watermark');

        return $response->withJson(array('message' => 'Ocorreu algum problema interno na execução da rota watermark. Entre em contato com a área de TI através do Chamado pelo SE.'), 500);
    }

    return $response->withJson($result, 200);
});

//  ***********************************************************************************
//
//
//  @description: Bloco para permitir o funcionamento da API para requisições locais
//
//
//  ***********************************************************************************

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});

$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);

    $accessControlAllowHeaders = 'Access-Control-Allow-Origin, Authorization, cache-control, Content-Type, Content-Length, Accept, pragma, ';
    $accessControlAllowHeaders .= 'access-global-code, access-user-code, access-code-to-edit, access-timeout, private-control, ';
    $accessControlAllowHeaders .= '78289360Mjc4MjU1ZDEwY2NkMDJhMGNlOC4zNzM3NjkyOA, 49579204MTcwNjE1ZDEwZDAwMjgxZWMxOS4wMTA2OTYzNA ';

    return $response
            ->withHeader('Access-Control-Allow-Origin', 'http://'.Utils\getServiceDomain('COBAPP'))
            ->withHeader('Access-Control-Allow-Headers', $accessControlAllowHeaders)
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
            ->withHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline'")
            ->withHeader('X-Frame-Options', 'DENY');
});

//  Catch-all route to serve a 404 Not Found page if none of the routes match
//  NOTE: make sure this route is defined last
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($req, $res) {
    $handler = $this->notFoundHandler; //  handle using the default Slim page not found handler
    return $handler($req, $res);
});

// rode a aplicação Slim
$app->run();
