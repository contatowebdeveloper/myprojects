<?php

namespace Utils {
    define('PROD', 'api.schulze.com.br:8000, cobapp.schulze.com.br:3000');
    define('HOMOLOG', 'api-homolog.schulze.com.br:8000, cobapp-homolog.schulze.com.br:3000, 192.168.100.33');
    define('TESTE', 'api-teste.schulze.com.br:8000, cobapp-teste.schulze.com.br:3000, 192.168.100.32');

    function isProd()
    {
        return strpos(PROD, $_SERVER['HTTP_HOST']) !== false ? true : false;
    }

    function isHomolog()
    {
        return strpos(HOMOLOG, $_SERVER['HTTP_HOST']) !== false ? true : false;
    }

    function isTeste()
    {
        return strpos(TESTE, $_SERVER['HTTP_HOST']) !== false ? true : false;
    }

    function isWindows()
    {
        return strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' ? true : false;
    }

    function getServiceDomain($service)
    {
        $serviceDomain = '';

        switch ($service) {
            case 'API':
                if (isProd()) {
                    $serviceDomain = 'api.schulze.com.br:8000';
                } elseif (isHomolog()) {
                    $serviceDomain = 'api-homolog.schulze.com.br:8000';
                } elseif (isTeste()) {
                    $serviceDomain = 'api-teste.schulze.com.br:8000';
                } else {
                    $serviceDomain = 'api-dev.schulze.com.br:8000';
                }
                break;
            case 'COBAPP':
                if (isProd()) {
                    $serviceDomain = 'cobapp.schulze.com.br:3000';
                } elseif (isHomolog()) {
                    $serviceDomain = 'cobapp-homolog.schulze.com.br:3000';
                } elseif (isTeste()) {
                    $serviceDomain = 'cobapp-teste.schulze.com.br:3000';
                } else {
                    $serviceDomain = 'cobapp-dev.schulze.com.br:3000';
                }
                break;
            default:
                $serviceDomain = false;
                break;
        }

        return $serviceDomain;
    }

    function conectar()
    {
        $usuario = 'sitess';
        $senha = 'system#up21';
        $baseDados = 'cobranca';

        $servidor = isProd() ? 'db01.grupo.schulze' : 'db02.grupo.schulze,1444';

        $srcConnection = 'sqlsrv:Server='.$servidor.';Database='.$baseDados;

        try {
            $conn = new \PDO($srcConnection, $usuario, $senha);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }

        return $conn;
    }

    function decrypt($texto)
    {
        $s = '';
        $s1 = $texto;
        $control = false;
        for ($i = 0; $i <= strlen($s1) - 1; ++$i) {
            $c = ord($s1[$i]);
            if ($control) {
                $c = chr($c - 5);
                $control = false;
            } else {
                $c = chr($c + 5);
                $control = true;
            }
            $s = $s.$c;
        }
        $s1 = '';

        for ($i = strlen($s) - 1; $i >= 0; --$i) {
            $s1 = $s1.$s[$i];
        }

        return $s1;
    }

    function encrypt($texto)
    {
        $s = '';
        $control = false;

        $i = '';
        $t = $texto;
        $s1 = '';
        $s = '';
        $c = '';
        $control = false;

        for ($i = strlen($t); $i >= 0; --$i) {
            $s1 = $s1.substr($t, $i, 1);
        }

        for ($i = 0; $i <= strlen($s1); ++$i) {
            $c = ord(substr($s1, $i, 1));
            if ($control === true) {
                $c = chr($c + 5);
                $control = false;
            } else {
                $c = chr($c - 5);
                $control = true;
            }
            $s = $s.$c;
        }

        return $s;
    }

    function generateJsonWebToken($aud, $maxTime = '+8 hours', $type = '', $accessTimeout = null)
    {
        //Chave secreta  Schulze-Api em SHA256: 1eb9ace301a534911727741fe4b136032ee0245353114c308f3a306c61e8b341
        $secret = $type === 'private' ? generateHashCode('', 256) : '1eb9ace301a534911727741fe4b136032ee0245353114c308f3a306c61e8b341';
        $exp = $accessTimeout ? $accessTimeout : strtotime(date('r', time()).$maxTime);
        $module = $type === 'private' ? 'cobsystem' : 'public';

        // error_log('generateJsonWebToken Type: '.$type.' module: '.$module.' aud:'.$aud.' exp :'.$exp.' Data:'.date('d-m-y H:n:s'));

        $iat = strtotime(date('r', time()));
        $header = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = base64_encode(json_encode(['iss' => 'api.schulze.com.br:8000', 'sub' => $module, 'aud' => $aud, 'iat' => $iat, 'exp' => $exp]));
        $hashSignature = hash_hmac('sha256', "$header.$payload", $secret, true);
        $signature = base64_encode($hashSignature);

        return $header.'.'.$payload.'.'.$signature;
    }

    function decryptJsonWebToken($hash)
    {
        $token = null;
        $JWT = explode('.', $hash);
        $token['header'] = isset($JWT[0]) ? json_decode(base64_decode($JWT[0]), true) : null;
        $token['payload'] = isset($JWT[1]) ? json_decode(base64_decode($JWT[1]), true) : null;
        $token['signature'] = isset($JWT[2]) ? $JWT[2] : null;

        return $token;
    }

    function checkValidateJsonWebToken($hash)
    {
        $isValid = false; // Por padrão, token não é válido
        $now = strtotime('now');
        $token = decryptJsonWebToken($hash);

        #error_log('checkValidateJsonWebToken: ');
        #error_log('hash: '.$hash);
        #error_log('**********************************************');

        if ($now <= $token['payload']['exp']) {
            #error_log('Token payload valido');
            $isValid = true; // Token não expirou, retorna como valido
        }

        #error_log('Resultado: now:'.$now.' token-exp:'.$token['payload']['exp'].' is valid?:[' . ($isValid ? 'yes' : 'no') .']');
        #error_log('**********************************************');

        return $isValid;
    }

    function generateHashCode($option = null, $length = null)
    {
        $hash = uniqid(rand(), true)
                .base64_encode(uniqid(rand(), true))
                .uniqid(rand(), true)
                .base64_encode(uniqid(rand(), true));

        if ($option == 2) {
            $hash = preg_replace('/[^1-9]/', '', $hash);
        }

        if ($length > 0) {
            $hashlength = strlen($hash) - 1;
            $key = '';

            for ($i = 1; $i <= $length; ++$i) {
                $key .= substr($hash, rand(0, $hashlength), 1);
            }

            $hash = $key;
        }

        return $hash;
    }

    function sessionRegistry($hash)
    {
        session_cache_limiter('private');
        $cache_limiter = session_cache_limiter();

        session_cache_expire(3600);
        $cache_expire = session_cache_expire();

        if (session_status() !== PHP_SESSION_ACTIVE) {//Verifica se a sessão não está aberta, caso não estiver, abre a sessão
            session_start();
        }

        if ($hash) {
            $_SESSION['dono_da_sessao'] = md5('seg'.$_SERVER['REMOTE_ADDR'].$_SERVER['HTTP_USER_AGENT']);
        }

        $tokenUsuario = md5('seg'.$_SERVER['REMOTE_ADDR'].$_SERVER['HTTP_USER_AGENT']);

        if ($_SESSION['dono_da_sessao'] != $tokenUsuario) {
            session_destroy();
            header('Location : //url principal');
        }

        return $_SESSION['dono_da_sessao'];
    }

    function decryptEventHash($hashkey)
    {
        $eventHash = base64_decode($hashkey);
        $hash['cdProcesso'] = substr($eventHash, 0, 10);
        $hash['dtHistorico'] = substr($eventHash, 14, 4).'-'.substr($eventHash, 12, 2).'-'.substr($eventHash, 10, 2);
        $hash['cdDescricaoHistorico'] = substr($eventHash, 18, 3);
        $hash['cdHistorico'] = substr($eventHash, 21, 3);

        return $hash;
    }

    function getIp()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return $ip;
    }

    function formata_cpf_cnpj($cpf_cnpj)
    {
        /*
            Pega qualquer CPF e CNPJ e formata

            CPF: 000.000.000-00
            CNPJ: 00.000.000/0000-00
        */

        //# Retirando tudo que não for número.
        $cpf_cnpj = preg_replace('/[^0-9]/', '', $cpf_cnpj);
        $tipo_dado = null;
        if (strlen($cpf_cnpj) == 11) {
            $tipo_dado = 'cpf';
        }
        if (strlen($cpf_cnpj) == 14) {
            $tipo_dado = 'cnpj';
        }
        switch ($tipo_dado) {
            default:
                $cpf_cnpj_formatado = 'Não foi possível definir tipo de dado';
            break;

            case 'cpf':
                $bloco_1 = substr($cpf_cnpj, 0, 3);
                $bloco_2 = substr($cpf_cnpj, 3, 3);
                $bloco_3 = substr($cpf_cnpj, 6, 3);
                $dig_verificador = substr($cpf_cnpj, -2);
                $cpf_cnpj_formatado = $bloco_1.'.'.$bloco_2.'.'.$bloco_3.'-'.$dig_verificador;
            break;

            case 'cnpj':
                $bloco_1 = substr($cpf_cnpj, 0, 2);
                $bloco_2 = substr($cpf_cnpj, 2, 3);
                $bloco_3 = substr($cpf_cnpj, 5, 3);
                $bloco_4 = substr($cpf_cnpj, 8, 4);
                $digito_verificador = substr($cpf_cnpj, -2);
                $cpf_cnpj_formatado = $bloco_1.'.'.$bloco_2.'.'.$bloco_3.'/'.$bloco_4.'-'.$digito_verificador;
            break;
        }

        return $cpf_cnpj_formatado;
    }
}
