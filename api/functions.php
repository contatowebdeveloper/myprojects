<?php

namespace Functions {
    require_once 'utils.php';

    use Utils as Utils;

    $conn = Utils\conectar();

    function verifyUser($registry)
    {
        global $conn;

        $registryDecode = $registry;
        htmlspecialchars($registryDecode);

        $stmt = $conn->prepare('SELECT cd_cliente FROM Cliente WHERE cd_cliente = '.$registryDecode);
        $stmt->execute();
        $cur = $stmt->fetch(\PDO::FETCH_ASSOC);

        try {
            return $cur;
        } catch (Exception $e) {
            error_log($e);
            exit;
        }
    }

    function is_valid_index_listOf($index)
    {
        switch ($index) {
            case 30:
            case 60:
            case 100:
            case 1000:
                $retorno = true;
            break;
            default:
                $retorno = false;
            break;
        }

        return $retorno;
    }

    function getDateTimeStampMSSql()
    {
        $now = \DateTime::createFromFormat('U.u', number_format(microtime(true), 3, '.', ''));
        $now->setTimeZone(new \DateTimeZone('America/Sao_Paulo'));

        return $now->format('m-d-Y H:i:s.v');
    }

    function listEvents($index, $cdProcesso, $data_de, $data_ate, $cdStatus, $fase, $offset = null, $limiter = null)
    {
        if (is_null($offset) && is_null($limiter)) {
            throw new \Exception('Ausência de parâmetros essenciais para efetuar a consulta.');
        }

        global $conn;
        $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        $sql = is_numeric($index) ? 'SELECT TOP '.$index : 'SELECT';

        $sql .= " CONVERT(DATE, H.dt_historico) AS eventDate, \n".
                " H.dt_criacao AS timestamp, \n".
                " H.cd_criacao AS userCode, \n".
                " CASE \n".
                "   WHEN ISNUMERIC(LTRIM(RTRIM(H.cd_criacao)))=1 THEN \n".
                "       (SELECT NO_CLIENTE FROM CLIENTE WHERE CD_CLIENTE=LTRIM(RTRIM(H.cd_criacao))) \n".
                "   ELSE \n".
                "       (SELECT TOP 1 NO_CLIENTE FROM CLIENTE WHERE CD_USUARIO=H.cd_criacao) \n".
                " END AS userName, \n".
                " CASE \n".
                "   WHEN H.cd_criacao IS NOT NULL AND ISNUMERIC(LTRIM(RTRIM(H.cd_criacao)))=1 THEN \n".
                "       (SELECT COBRANCA.DBO.MOSTRAABREVIACAOFILIAL(CD_FILIAL_CLIENTE) FROM CLIENTE WHERE CD_CLIENTE=LTRIM(RTRIM(H.cd_criacao))) \n".
                "   ELSE '' \n".
                " END AS userCompany, \n".
                " H.cd_historico AS eventId, H.cd_descricao_historico AS eventCode, H.de_historico AS eventDetail, \n".
                " CASE \n".
                "   WHEN HD.de_descricao_historico IS NULL THEN \n".
                "       'INFORMAÇÕES GERAIS' \n".
                " ELSE \n".
                "   HD.de_descricao_historico \n".
                " END AS eventName, \n".
                " H.cd_alteracao AS userCodeUpdated, H.dt_alteracao AS eventDateUpdated, \n".
                " CASE \n".
                "   WHEN (H.cd_alteracao='' OR H.cd_alteracao IS NULL) THEN '' \n".
                " ELSE \n".
                "   Cobranca.dbo.MostraNOMEeFilialUSU(H.cd_alteracao) \n".
                " END AS userNameUpdated \n";

        $sql .= " FROM Historico AS H \n";
        $sql .= " INNER JOIN descricao_historico HD ON H.cd_descricao_historico = HD.cd_descricao_historico \n";
        $sql .= " WHERE H.cd_processo=:cd_processo \n";
        // $sql .= " AND DATEPART(YEAR, H.dt_criacao) >= " . substr($cdProcesso, 0, 4);

        # Montando filtro por datas
        $sql .= (isset($data_de) && !empty($data_de)) ? " AND H.dt_historico >= CAST(:data_de AS DATE) \n" : '';
        $sql .= (isset($data_ate) && !empty($data_ate)) ? " AND H.dt_historico <= CAST(:data_ate AS DATE) \n" : '';

        # Montando filtro por status
        if (isset($cdStatus)) {
            $ftSQL = '';
            foreach ($cdStatus as $ft) {
                if ($ftSQL != '') {
                    $ftSQL .= ' OR ';
                }
                switch ($ft) {
                    case '1':
                        $ftSQL .= 'HD.fl_ajuizamento = 1';
                        $ft01 = $ft;
                        break;
                    case '2':
                        $ftSQL .= 'HD.fl_cobranca = 1';
                        $ft02 = $ft;
                        break;
                    case '3':
                        $ftSQL .= 'HD.fl_financeiro = 1';
                        $ft03 = $ft;
                        break;
                    case '4':
                        $ftSQL .= 'HD.fl_andamento = 1';
                        $ft04 = $ft;
                        break;
                    case '5':
                        $ftSQL .= 'HD.fl_status = 1';
                        $ft05 = $ft;
                        break;
                    case '6':
                        $ftSQL .= 'HD.fl_liberacao = 1';
                        $ft06 = $ft;
                        break;
                }
            }
            if ($ftSQL != '') {
                $sql .= ' AND ('.$ftSQL.") \n";
            }
        }

        # Montando filtro por fase
        if (!empty($fase)) {
            foreach ($fase as $key => $value) {
                if (empty($value)) {
                    unset($fase[$key]);
                }
            }
            if (!empty($fase)) {
                $ft_fase = '';
                foreach ($fase as $ls) {
                    !empty($ft_fase) ? $ft_fase .= ',' : '';
                    $ft_fase .= $ls;
                }
                if ($ft_fase != '') {
                    $sql .= ' AND HD.cd_descricao_historico IN ('.$ft_fase.") \n";
                }
            }
        }

        $sql .= ' ORDER BY H.dt_historico DESC, H.cd_historico DESC ';

        if (!is_null($offset)) {
            $sql .= ' OFFSET '.$offset.' ROWS FETCH NEXT '.$limiter." ROWS ONLY \n";
        }

        $stmt = $conn->prepare($sql);

        # Building Values
        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        (isset($data_de) && !empty($data_de)) ? $stmt->bindValue(':data_de', $data_de, \PDO::PARAM_STR) : '';
        if (isset($data_ate) && !empty($data_ate)) {
            $date = new \DateTime($data_ate);
            $date->modify('+1 day');
            $stmt->bindValue(':data_ate', $date->format('Ymd'), \PDO::PARAM_STR);
        }

        try {
            $stmt->execute();
            $i = 1;
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                if ($i <= $limiter && is_null($offset)) {
                    # Para tratar cada campo durante a leitura do recordset

                    if (!empty($row['userName'])) {
                        $userName = $row['userName'];
                    } elseif (!empty($row['userCode'])) {
                        $userName = $row['userCode'];
                    } else {
                        $userName = 'SISTEMA';
                    }

                    if (!empty($row['userCompany'])) {
                        $userCompany = $row['userCompany'];
                    } else {
                        $userCompany = 'JOI';
                    }

                    if (!empty($row['userNameUpdated'])) {
                        $userNameUpdated = $row['userNameUpdated'];
                    } elseif (!empty($row['userCodeUpdated'])) {
                        $userNameUpdated = $row['userCodeUpdated'];
                    } elseif (!empty($row['eventDateUpdated'])) {
                        $userNameUpdated = 'SISTEMA';
                    } else {
                        $userNameUpdated = '';
                    }

                    $result['events'][] = [
                        'eventDate' => !empty($row['eventDate']) ? date('d/m/Y', strtotime($row['eventDate'])) : '',
                        'userCode' => !empty($row['userCode']) ? $row['userCode'] : '',
                        'timestamp' => !empty($row['timestamp']) ? $row['timestamp'] : '',
                        'userName' => !empty($userName) ? $userName : '',
                        'userCompany' => $userCompany,
                        'eventId' => !empty($row['eventId']) ? $row['eventId'] : '',
                        'eventCode' => !empty($row['eventCode']) ? str_pad($row['eventCode'], 3, '0', STR_PAD_LEFT) : '',
                        'eventDetail' => !empty($row['eventDetail']) ? $row['eventDetail'] : '',
                        'eventName' => !empty($row['eventName']) ? $row['eventName'] : '',
                        'userCodeUpdated' => !empty($row['userCodeUpdated']) ? $row['userCodeUpdated'] : '',
                        'userNameUpdated' => !empty($userNameUpdated) ? $userNameUpdated : '',
                        'eventDateUpdated' => !empty($row['eventDateUpdated']) ? $row['eventDateUpdated'] : '',
                    ];
                    ++$i;
                } elseif (is_numeric($index) || !is_null($offset)) {
                    # Para tratar cada campo durante a leitura do recordset

                    if (!empty($row['userName'])) {
                        $userName = $row['userName'];
                    } elseif (!empty($row['userCode'])) {
                        $userName = $row['userCode'];
                    } else {
                        $userName = 'SISTEMA';
                    }

                    if (!empty($row['userCompany'])) {
                        $userCompany = $row['userCompany'];
                    } else {
                        $userCompany = 'JOI';
                    }

                    if (!empty($row['userNameUpdated'])) {
                        $userNameUpdated = $row['userNameUpdated'];
                    } elseif (!empty($row['userCodeUpdated'])) {
                        $userNameUpdated = $row['userCodeUpdated'];
                    } elseif (!empty($row['eventDateUpdated'])) {
                        $userNameUpdated = 'SISTEMA';
                    } else {
                        $userNameUpdated = '';
                    }

                    $result['events'][] = [
                        'eventDate' => !empty($row['eventDate']) ? date('d/m/Y', strtotime($row['eventDate'])) : '',
                        'userCode' => !empty($row['userCode']) ? $row['userCode'] : '',
                        'timestamp' => !empty($row['timestamp']) ? $row['timestamp'] : '',
                        'userName' => !empty($userName) ? $userName : '',
                        'userCompany' => $userCompany,
                        'eventId' => !empty($row['eventId']) ? $row['eventId'] : '',
                        'eventCode' => !empty($row['eventCode']) ? str_pad($row['eventCode'], 3, '0', STR_PAD_LEFT) : '',
                        'eventDetail' => !empty($row['eventDetail']) ? $row['eventDetail'] : '',
                        'eventName' => !empty($row['eventName']) ? $row['eventName'] : '',
                        'userCodeUpdated' => !empty($row['userCodeUpdated']) ? $row['userCodeUpdated'] : '',
                        'userNameUpdated' => !empty($userNameUpdated) ? $userNameUpdated : '',
                        'eventDateUpdated' => !empty($row['eventDateUpdated']) ? $row['eventDateUpdated'] : '',
                    ];
                }
            }
            $result['totalEvents'] = $stmt->rowCount();
            $result['offset'] = !empty($offset) ? $offset : 0;
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();

        return $result;
    }

    function listFase($cdStatus, $route)
    {
        global $conn;

        switch ($route) {
            case 'historico':
                $ftSQL = '';
                $sql = 'SELECT cd_descricao_historico AS faseCode, de_descricao_historico AS faseName';
                $sql .= ' FROM Descricao_Historico ';

                foreach ($cdStatus as $ft) {
                    if ($ftSQL != '') {
                        $ftSQL .= ' OR ';
                    }
                    switch ($ft['value']) {
                        case '1':
                            $ftSQL .= 'fl_ajuizamento = 1';
                            break;
                        case '2':
                            $ftSQL .= 'fl_cobranca = 1';
                            break;
                        case '3':
                            $ftSQL .= 'fl_financeiro = 1';
                            break;
                        case '4':
                            $ftSQL .= 'fl_andamento = 1';
                            break;
                        case '5':
                            $ftSQL .= 'fl_status = 1';
                            break;
                        case '6':
                            $ftSQL .= 'fl_liberacao = 1';
                            break;
                    }
                }
                if ($ftSQL != '') {
                    $sql .= ' WHERE '.$ftSQL;
                }
                $sql .= ' ORDER BY cd_descricao_historico';

                $stmt = $conn->prepare($sql);
                $stmt->execute();

                $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                if (empty($cur)) {
                    $cur = array('NENHUM REGISTRO ENCONTRADO');
                }

                $stmt->closeCursor();

                return $cur;
                break;
            case 'acionamento':
                $sql = " SELECT a1.cd_acionamento_contato, UPPER(Cobranca.dbo.MostraAcionamentoTipo(a1.cd_tipo)) + ' - ' + UPPER(a1.de_acionamento_contato) AS Resultado ".
                       ' ,  r1.cd_acionamento_resultado AS faseCode, r1.de_acionamento_resultado AS faseName ';
                $sql .= ' FROM AcionamentoResultado AS r1, AcionamentoContato AS a1, AcionamentoContatoResultado AS a2 ';
                $sql .= ' WHERE a1.cd_acionamento_contato=a2.cd_acionamento_contato '.
                        ' AND r1.cd_acionamento_resultado=a2.cd_acionamento_resultado ';

                if ($cdStatus !== '') {
                    $sql .= ' AND a1.cd_acionamento_contato='.$cdStatus;
                } else {
                    $sql .= ' AND a1.cd_acionamento_contato=0';
                }

                $sql .= ' ORDER BY Cobranca.dbo.MostraAcionamentoTipo(a1.cd_tipo), a1.de_acionamento_contato, r1.de_acionamento_resultado';

                $stmt = $conn->prepare($sql);
                $stmt->execute();

                $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

                if (empty($cur)) {
                    $cur = array('NENHUM REGISTRO ENCONTRADO');
                }

                $stmt->closeCursor();

                return $cur;
                break;
            default:
        }
    }

    function getEvent($cdProcesso, $dtHistorico, $cdHistorico, $cdDescricaoHistorico)
    {
        global $conn;

        $sql = " SELECT CONVERT(DATE, H.dt_historico) AS eventDate, \n".
                " H.dt_criacao AS timestamp, \n".
                " H.cd_criacao AS userCode, \n".
                " CASE \n".
                "   WHEN ISNUMERIC(LTRIM(RTRIM(H.cd_criacao)))=1 THEN \n".
                "       (SELECT NO_CLIENTE FROM CLIENTE WHERE CD_CLIENTE=LTRIM(RTRIM(H.cd_criacao))) \n".
                "   ELSE \n".
                "       (SELECT TOP 1 NO_CLIENTE FROM CLIENTE WHERE CD_USUARIO=H.cd_criacao) \n".
                " END AS userName, \n".
                " CASE \n".
                "   WHEN H.cd_criacao IS NOT NULL AND ISNUMERIC(LTRIM(RTRIM(H.cd_criacao)))=1 THEN \n".
                "       (SELECT COBRANCA.DBO.MOSTRAABREVIACAOFILIAL(CD_FILIAL_CLIENTE) FROM CLIENTE WHERE CD_CLIENTE=LTRIM(RTRIM(H.cd_criacao))) \n".
                "   ELSE '' \n".
                " END AS userCompany, \n".
                " H.cd_historico AS eventId, H.cd_descricao_historico AS eventCode, H.de_historico AS eventDetail, \n".
                " CASE \n".
                "   WHEN HD.de_descricao_historico IS NULL THEN \n".
                "       'INFORMAÇÕES GERAIS' \n".
                " ELSE \n".
                "   HD.de_descricao_historico \n".
                " END AS eventName, \n".
                " H.cd_alteracao AS userCodeUpdated, H.dt_alteracao AS eventDateUpdated, \n".
                " CASE \n".
                "   WHEN (H.cd_alteracao='' OR H.cd_alteracao IS NULL) THEN '' \n".
                " ELSE \n".
                "   Cobranca.dbo.MostraNOMEeFilialUSU(H.cd_alteracao) \n".
                " END AS userNameUpdated \n";

        $sql .= " FROM Historico AS H \n".
                " INNER JOIN descricao_historico HD ON H.cd_descricao_historico = HD.cd_descricao_historico \n".
                " WHERE H.cd_processo=:cd_processo \n".
                " AND H.dt_historico=:dt_historico \n".
                " AND H.cd_historico=:cd_historico \n".
                " AND H.cd_descricao_historico=:cd_descricao_historico \n";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_STR);
        $stmt->bindParam(':dt_historico', $dtHistorico, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_historico', $cdHistorico, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_descricao_historico', $cdDescricaoHistorico, \PDO::PARAM_STR);

        $stmt->execute();

        while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
            if (!empty($row['userName'])) {
                $userName = $row['userName'];
            } elseif (!empty($row['userCode'])) {
                $userName = $row['userCode'];
            } else {
                $userName = 'SISTEMA';
            }

            if (!empty($row['userCompany'])) {
                $userCompany = $row['userCompany'];
            } else {
                $userCompany = 'JOI';
            }

            if (!empty($row['userNameUpdated'])) {
                $userNameUpdated = $row['userNameUpdated'];
            } elseif (!empty($row['userCodeUpdated'])) {
                $userNameUpdated = $row['userCodeUpdated'];
            } else {
                $userNameUpdated = 'SISTEMA';
            }
            $result['eventDate'] = date('d/m/Y', strtotime($row['eventDate']));
            $result['userCode'] = $row['userCode'];
            $result['timestamp'] = $row['timestamp'];
            $result['userName'] = $userName;
            $result['userCompany'] = $userCompany;
            $result['eventId'] = $row['eventId'];
            $result['eventCode'] = str_pad($row['eventCode'], 3, '0', STR_PAD_LEFT);
            $result['eventDetail'] = $row['eventDetail'];
            $result['eventName'] = $row['eventName'];
            $result['userCodeUpdated'] = $row['userCodeUpdated'];
            $result['eventDateUpdated'] = $row['eventDateUpdated'];
            $result['userNameUpdated'] = $userNameUpdated;
        }

        $stmt->closeCursor();

        if ($result) {
            return $result;
        } else {
            echo 'Parâmetro não encontrado!';
        }
    }

    function updateEvent($cdProcesso, $eventDate, $eventId, $eventCode, $userCodeUpdated, $eventDetail)
    {
        global $conn;

        $sql = "SELECT 1 AS CONT FROM Historico \n".
                " WHERE cd_processo=:cd_processo \n".
                " AND dt_historico=:dt_historico \n".
                " AND cd_historico=:cd_historico \n".
                " AND cd_descricao_historico=:cd_descricao_historico \n".
                " AND FORMAT(dt_alteracao, 'yyyy-MM-dd HH:mm:ss') >= FORMAT(GETDATE(), 'yyyy-MM-dd HH:mm:ss') \n";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_STR);
        $stmt->bindParam(':dt_historico', $eventDate, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_historico', $eventId, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_descricao_historico', $eventCode, \PDO::PARAM_STR);

        $stmt->execute();
        $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if ($stmt->rowCount() > 0) {
            $cur = array('message' => 'Não foi possível atualizar este registro pelo fato de o mesmo ter sido atualizado nesse exato momento por outros processo.', 'status' => 500);
        } else {
            $stmt->closeCursor();
            $sql = "UPDATE Historico SET \n".
                    " de_historico = '".$eventDetail."', \n".
                    ' cd_alteracao = '.$userCodeUpdated.", \n".
                    " dt_alteracao=GETDATE() \n".
                    " WHERE cd_processo=:cd_processo \n".
                    " AND dt_historico=:dt_historico \n".
                    " AND cd_historico=:cd_historico \n".
                    ' AND cd_descricao_historico=:cd_descricao_historico';

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_STR);
            $stmt->bindParam(':dt_historico', $eventDate, \PDO::PARAM_STR);
            $stmt->bindParam(':cd_historico', $eventId, \PDO::PARAM_STR);
            $stmt->bindParam(':cd_descricao_historico', $eventCode, \PDO::PARAM_STR);

            $stmt->execute();
            $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $stmt->closeCursor();

            if ($stmt->rowCount() == 0) {
                $cur = array('message' => 'Não foi possível atualizar este registro', 'status' => 500);
            } else {
                $sql = "SELECT \n".
                " cd_alteracao AS userCodeUpdated, dt_alteracao AS eventDateUpdated, \n".
                " CASE \n".
                "   WHEN (cd_alteracao='' OR cd_alteracao IS NULL) THEN '' \n".
                " ELSE \n".
                "   Cobranca.dbo.MostraNOMEeFilialUSU(cd_alteracao) \n".
                " END AS userNameUpdated \n".
                " FROM Historico \n".
                " WHERE cd_processo=:cd_processo \n".
                " AND dt_historico=:dt_historico \n".
                " AND cd_historico=:cd_historico \n".
                " AND cd_descricao_historico=:cd_descricao_historico \n";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_STR);
                $stmt->bindParam(':dt_historico', $eventDate, \PDO::PARAM_STR);
                $stmt->bindParam(':cd_historico', $eventId, \PDO::PARAM_STR);
                $stmt->bindParam(':cd_descricao_historico', $eventCode, \PDO::PARAM_STR);

                $stmt->execute();

                if ($stmt->rowCount() == 0) {
                    $cur = array('message' => 'Não foi possível localizar o usuário que alterou o histórico.', 'status' => 500);
                } else {
                    while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                        $cur = array('message' => 'ok', 'dados' => array('eventDateUpdated' => $row['eventDateUpdated'], 'userCodeUpdated' => $row['userCodeUpdated'], 'userNameUpdated' => $row['userNameUpdated']), 'status' => 200);
                    }
                }
            }
        }

        return $cur;
    }

    function deleteEvent($cdProcesso, $eventId, $eventCode, $eventDate, $eventUserCode, $eventAccessCode, $eventReason)
    {
        global $conn;
        $error = 0;

        $sql = 'DELETE FROM Historico';
        $sql .= ' WHERE cd_processo=:cd_processo';
        $sql .= ' AND dt_historico=:dt_historico '.
                ' AND cd_historico=:cd_historico '.
                ' AND cd_descricao_historico=:cd_descricao_historico ';
        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_STR);
        $stmt->bindParam(':dt_historico', $eventDate, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_historico', $eventId, \PDO::PARAM_STR);
        $stmt->bindParam(':cd_descricao_historico', $eventCode, \PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() == 0) {
            $cur = array('message' => 'Não foi possível excluir o histórico.', 'code' => 400);
        } else {
            # GRAVA O LOG DE EXCLUSAO
            $sql = 'INSERT INTO HistoricoExcluido (';
            $sql .= ' cd_processo, ';
            $sql .= ' dt_exclusao, ';
            $sql .= ' cd_descricao_historico, ';
            $sql .= ' cd_exclusao, ';
            $sql .= ' cd_inclusao, ';
            $sql .= ' dt_inclusao, ';
            $sql .= ' de_motivo ';
            $sql .= ' ) VALUES ( ';
            $sql .= $cdProcesso.', ';
            $sql .= "'".getDateTimeStampMSSql()."',";
            $sql .= $eventCode.',';
            $sql .= $eventAccessCode.',';
            $sql .= "'".$eventUserCode."',";
            $sql .= "'".$eventDate."',";
            $sql .= "'".$eventReason."')";

            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            $stmt->closeCursor();

            if ($stmt->rowCount() == 0) {
                $cur = array('message' => 'Não foi possível registrar a exclusão do registro.', 'code' => 400);
            } else {
                $cur = array('message' => 'Histórico excluído com sucesso.', 'code' => 200);
            }
        }

        $stmt->closeCursor();

        return $cur;
    }

    function listCall($index, $cdProcesso, $data_de, $data_ate, $cdStatus, $fase, $filterCall, $backupCall, $offset = null, $limiter = null)
    {
        if (is_null($offset) && is_null($limiter)) {
            throw new \Exception('Ausência de parâmetros essenciais para efetuar a consulta.');
        }

        global $conn;
        $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        # Verifica qual base vai buscar, só muda se receber o parametro de buscar da base congelada, caso contrario o padrão é a Cobranca.dbo.Acionamento
        $BaseAcionamento = 'Cobranca.dbo.Acionamento';
        $dateDataBaseCall = getDateDataBaseCall();
        $SQL_data_base_acionamento = " AND  a1.dt_data >= CAST('" . $dateDataBaseCall['dt_base_acionamento'] . "' AS DATE) ";

        if ($backupCall === true) {
            $BaseAcionamento = 'Congelado.dbo.Acionamento';
            $SQL_data_base_acionamento = " AND a1.dt_data <= CAST('" . $dateDataBaseCall['dt_base_acionamento'] . "' AS DATE) ";
        }

        $sql = is_numeric($index) ? 'SELECT TOP '.$index : 'SELECT ';

        $sql .= ' a1.cd_processo AS processCode'.
                ', a1.cd_acionador AS calledCode'.
                ', CASE WHEN LEN(Cobranca.dbo.MostraClienteNome(a1.cd_acionador)) > 1 THEN Cobranca.dbo.MostraClienteNome(a1.cd_acionador) ELSE NULL END AS called'.
                ', a1.nr_ramal AS branch'.
                ', a1.dt_data AS eventDate'.
                ', Cobranca.dbo.MostraAcionamentoTipo(a3.cd_tipo) AS type'.
                ', Cobranca.dbo.MostraAcionamentoAcao(a3.cd_acao) AS actionType'.
                ', Cobranca.dbo.MostraAcionamentoResultado(a1.cd_acionamento_contato) AS result'.
                ', Cobranca.dbo.MostraAcionamentoComplemento(a1.cd_acionamento_resultado) AS complement'.
                ', a1.de_descricao AS description'.
                ', a1.cd_id_central AS idCall'.
                ', a1.nr_telefone AS phone'.
                ', a1.de_email AS email'.
                ", middle=ISNULL((SELECT tp1.de_tipo_chamada FROM Cobranca.dbo.AcionamentoTipoChamada AS tp1 WHERE tp1.cd_tipo_chamada=a1.cd_tipo_chamada),'')".
                ', CASE WHEN a4.nr_duracao > 0 THEN '.
                '	     CONVERT(varchar, DATEADD(ms, a4.nr_duracao * 1000, 0), 108) '.
                '  ELSE '.
                "      '00:00:00' ".
                '  END AS nr_duracao '.
                ', CASE WHEN a4.nr_conversado > 0 THEN '.
                '	     CONVERT(varchar, DATEADD(ms, a4.nr_conversado * 1000, 0), 108) '.
                '  ELSE '.
                "      '00:00:00' ".
                '  END AS nr_conversado '.
                ', CASE WHEN a4.nr_aftercall > 0 THEN '.
                '	     CONVERT(varchar, DATEADD(ms, a4.nr_aftercall * 1000, 0), 108) '.
                '  ELSE '.
                "      '00:00:00' ".
                '  END AS nr_aftercall '.
                ", CASE WHEN a4.tp_desligamento = 1 THEN 'Acionador' WHEN a4.tp_desligamento = 2 THEN 'Cliente' WHEN a4.tp_desligamento IS NULL OR a4.tp_desligamento = 0 OR a4.tp_desligamento = 3 THEN 'Discador' END AS tp_desligamento ";
        $sql .= ' FROM '.$BaseAcionamento.' AS a1 '.
                ' RIGHT OUTER JOIN Cobranca.dbo.AcionamentoContato AS a3 ON (a1.cd_acionamento_contato=a3.cd_acionamento_contato)'.
                ' RIGHT OUTER JOIN Cobranca.dbo.AcionamentoResultado AS a2 ON (a1.cd_acionamento_resultado=a2.cd_acionamento_resultado)'.
                ' LEFT OUTER JOIN Cobranca.dbo.AcionamentoDiscador AS a4 ON (a1.cd_id = a4.cd_id) ';
        $sql .= ' WHERE a1.cd_processo=:cd_processo'.
                $SQL_data_base_acionamento;

        switch ($filterCall) {
            case 'Alo':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_Alo( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'CPC':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_CPC( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'Trabalhado':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_Trabalhado( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'Agendamento':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_Agendamento( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'RecebimentoSMS':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_RecebimentoSMS( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'AcordoBoleto':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_AcordoBoleto( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'PromessaPagamento':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_PromessaPagamento( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'Pesquisa':
                $sql .= ' AND Cobranca.dbo.MostraAcionamento_Pesquisa( a1.cd_acionamento_contato, a1.cd_acionamento_resultado ) = 1 ';
                break;
            case 'Todos':
                $sql .= '';
                break;
        }

        # Montando filtro por datas
        $sql .= (isset($data_de) && !empty($data_de)) ? ' AND a1.dt_data >= CAST(:data_de AS DATE)' : '';
        $sql .= (isset($data_ate) && !empty($data_ate)) ? ' AND a1.dt_data <= CAST(:data_ate AS DATE)' : '';

        # Montando o filtro a partir de um código de status informado
        if (!is_array($cdStatus) && isset($cdStatus)) {
            $sql .= ' AND a1.cd_acionamento_contato = '.$cdStatus;
        }

        # Montando filtro por fase
        if (!empty($fase)) {
            foreach ($fase as $key => $value) {
                if (empty($value)) {
                    unset($fase[$key]);
                }
            }

            if (!empty($fase)) {
                $ft_fase = '';
                foreach ($fase as $ls) {
                    !empty($ft_fase) ? $ft_fase .= ',' : '';
                    $ft_fase .= $ls;
                }
                if ($ft_fase != '') {
                    $sql .= ' AND a1.cd_acionamento_resultado IN ('.$ft_fase.') ';
                }
            }
        }

        $sql .= ' ORDER BY a1.dt_data DESC ';

        if (!is_null($offset)) {
            $sql .= ' OFFSET '.$offset.' ROWS FETCH NEXT '.$limiter.' ROWS ONLY ';
        }

        $stmt = $conn->prepare($sql);

        # Building Values
        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        if (isset($data_de) && !empty($data_de)) {
            $stmt->bindValue(':data_de', $data_de, \PDO::PARAM_STR);
        }

        if (isset($data_ate) && !empty($data_ate)) {
            $date = new \DateTime($data_ate);
            $date->modify('+1 day');
            $data_ate = $date->format('Ymd');
            $stmt->bindValue(':data_ate', $data_ate, \PDO::PARAM_STR);
        }

        try {
            $stmt->execute();
            $i = 1;
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                if ($i <= $limiter && is_null($offset)) {
                    # Foi passado a opção "Todos os registros", então retornará a quantidade de acordo com o limitador por página.
                    $result['calls'][] = [
                        'processCode' => !empty($row['processCode']) ? $row['processCode'] : '',
                        'calledCode' => !empty($row['calledCode']) ? $row['calledCode'] : '',
                        'called' => !empty($row['called']) ? $row['called'] : '',
                        'branch' => !empty($row['branch']) ? $row['branch'] : '',
                        'eventDate' => !empty($row['eventDate']) ? date('d/m/Y H:i:s', strtotime($row['eventDate'])) : '',
                        'type' => !empty($row['type']) ? $row['type'] : '',
                        'actionType' => !empty($row['actionType']) ? $row['actionType'] : '',
                        'result' => !empty($row['result']) ? $row['result'] : '',
                        'complement' => !empty($row['complement']) ? $row['complement'] : '',
                        'description' => !empty($row['description']) ? $row['description'] : '',
                        'idCall' => !empty($row['idCall']) ? $row['idCall'] : '',
                        'phone' => !empty($row['phone']) ? $row['phone'] : '',
                        'email' => !empty($row['email']) ? $row['email'] : '',
                        'middle' => !empty($row['middle']) ? $row['middle'] : '',
                        'nr_duracao' => $row['nr_duracao'],
                        'nr_conversado' => $row['nr_conversado'],
                        'nr_aftercall' => $row['nr_aftercall'],
                        'tp_desligamento' => $row['tp_desligamento'],
                    ];
                    ++$i;
                } elseif (is_numeric($index)) {
                    # Se foi passado apenas por SELECT TOP, no caso, "Os últimos ... registros
                    $result['calls'][] = [
                        'processCode' => !empty($row['processCode']) ? $row['processCode'] : '',
                        'calledCode' => !empty($row['calledCode']) ? $row['calledCode'] : '',
                        'called' => !empty($row['called']) ? $row['called'] : '',
                        'branch' => !empty($row['branch']) ? $row['branch'] : '',
                        'eventDate' => !empty($row['eventDate']) ? date('d/m/Y H:i:s', strtotime($row['eventDate'])) : '',
                        'type' => !empty($row['type']) ? $row['type'] : '',
                        'actionType' => !empty($row['actionType']) ? $row['actionType'] : '',
                        'result' => !empty($row['result']) ? $row['result'] : '',
                        'complement' => !empty($row['complement']) ? $row['complement'] : '',
                        'description' => !empty($row['description']) ? $row['description'] : '',
                        'idCall' => !empty($row['idCall']) ? $row['idCall'] : '',
                        'phone' => !empty($row['phone']) ? $row['phone'] : '',
                        'email' => !empty($row['email']) ? $row['email'] : '',
                        'middle' => !empty($row['middle']) ? $row['middle'] : '',
                        'nr_duracao' => $row['nr_duracao'],
                        'nr_conversado' => $row['nr_conversado'],
                        'nr_aftercall' => $row['nr_aftercall'],
                        'tp_desligamento' => $row['tp_desligamento'],
                    ];
                } elseif (!is_null($offset)) {
                    # Se está vindo da paginação
                    $result['calls'][] = [
                        'processCode' => !empty($row['processCode']) ? $row['processCode'] : '',
                        'calledCode' => !empty($row['calledCode']) ? $row['calledCode'] : '',
                        'called' => !empty($row['called']) ? $row['called'] : '',
                        'branch' => !empty($row['branch']) ? $row['branch'] : '',
                        'eventDate' => !empty($row['eventDate']) ? date('d/m/Y H:i:s', strtotime($row['eventDate'])) : '',
                        'type' => !empty($row['type']) ? $row['type'] : '',
                        'actionType' => !empty($row['actionType']) ? $row['actionType'] : '',
                        'result' => !empty($row['result']) ? $row['result'] : '',
                        'complement' => !empty($row['complement']) ? $row['complement'] : '',
                        'description' => !empty($row['description']) ? $row['description'] : '',
                        'idCall' => !empty($row['idCall']) ? $row['idCall'] : '',
                        'phone' => !empty($row['phone']) ? $row['phone'] : '',
                        'email' => !empty($row['email']) ? $row['email'] : '',
                        'middle' => !empty($row['middle']) ? $row['middle'] : '',
                        'nr_duracao' => $row['nr_duracao'],
                        'nr_conversado' => $row['nr_conversado'],
                        'nr_aftercall' => $row['nr_aftercall'],
                        'tp_desligamento' => $row['tp_desligamento'],
                    ];
                }
            }

            $result['totalCalls'] = $stmt->rowCount();
            $result['offset'] = !empty($offset) ? $offset : 0;
            
            # error_log('Ficha: ' . $cdProcesso);
            # error_log('SQL: ' . $sql);
            # error_log('totalCalls: ' . $result['totalCalls']);
            # error_log('offset: ' . $result['offset']);
            # error_log('limiter: ' . $limiter);

        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();

        return $result;
    }

    function listStatusCall()
    {
        global $conn;

        $sql = " SELECT DISTINCT UPPER(Cobranca.dbo.MostraAcionamentoTipo(a1.cd_tipo)) + ' - ' + UPPER(a1.de_acionamento_contato) AS statusName, a1.cd_acionamento_contato AS statusCode ";
        $sql .= ' FROM AcionamentoResultado AS r1, AcionamentoContato AS a1, AcionamentoContatoResultado AS a2 ';
        $sql .= ' WHERE a1.cd_acionamento_contato=a2.cd_acionamento_contato '.
                ' AND r1.cd_acionamento_resultado=a2.cd_acionamento_resultado ';

        $stmt = $conn->prepare($sql);
        $stmt->execute();

        $cur = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        if (empty($cur)) {
            $cur = array('NENHUM REGISTRO ENCONTRADO');
        }

        $stmt->closeCursor();

        return $cur;
    }

    function getContract($cdProcesso, $nMostrarEnderecoCliente)
    {
        global $conn;
        $form = [];
        $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

        # DADOS TITULO BASE COBRANCA
        $res = $conn->query('SELECT COUNT(*) FROM BaseCobranca.dbo.BaseCobranca AS Bas WHERE Bas.cd_processo='.$cdProcesso, \PDO::FETCH_ASSOC);
        $result = $res->fetchColumn();

        $BaseCobranca = 'BaseCobranca.dbo.BaseCobranca';
        $TOP1BaseCobranca = '';
        $BaseCobrancaOrderBy = '';
        $dtBase = '';

        try {
            if (!$result > 0) {
                $BaseCobranca = 'Congelado.dbo.BaseDistribuicao';
                $dtBase = ' AND DATEPART(YEAR, dt_base) >= '.substr($cdProcesso, 0, 4);
                $TOP1BaseCobranca = 'TOP 1';
                $BaseCobrancaOrderBy = 'ORDER BY DT_BASE DESC';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $sql = 'SELECT '.$TOP1BaseCobranca.' Bas.cd_state, Bas.cd_especie, Bas.cd_rating, Bas.vl_risco'.
               ', Cobranca.dbo.MostraGrupoProdutoCodigo(Bas.cd_grupo_produto) AS GrupoProduto'.
               ', Cobranca.dbo.MostraGrupoProduto1Codigo(Bas.cd_grupo_produto1) AS GrupoProduto1'.
               ', Cobranca.dbo.MostraStatusProduto(Bas.cd_status_produto) AS StatusProduto'.
               ', Cobranca.dbo.MostraStatusCliente(Bas.cd_status_cliente) AS StatusCliente'.
               ' , PcPago = CASE WHEN nr_parcela_total=0 THEN 0 ELSE (((CASE WHEN (Bas.nr_parcela_numero - 1) < 0 THEN 0 ELSE (Bas.nr_parcela_numero - 1) END) / Bas.nr_parcela_total) * 100) END'; //PARA AJUSTAR OS CASOS ONDE O TOTAL DE PARCELAS ESTA IGUAL A ZERO
        $sql .= ' FROM '.$BaseCobranca.' AS Bas';
        $sql .= ' WHERE Bas.cd_processo=:cd_processo';
        $sql .= $dtBase;
        $sql .= ' '.$BaseCobrancaOrderBy;

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $marcacao = $stmt->fetch();
                $form['marcacao']['cd_state'] = !empty($marcacao['cd_state']) ? $marcacao['cd_state'] : '';
                $form['marcacao']['cd_especie'] = !empty($marcacao['cd_especie']) ? $marcacao['cd_especie'] : '';
                $form['marcacao']['cd_rating'] = !empty($marcacao['cd_rating']) ? $marcacao['cd_rating'] : 0;
                $form['marcacao']['vl_risco'] = !empty($marcacao['vl_risco']) ? $marcacao['vl_risco'] : '';
                $form['marcacao']['GrupoProduto'] = !empty($marcacao['GrupoProduto']) ? $marcacao['GrupoProduto'] : '';
                $form['marcacao']['GrupoProduto1'] = !empty($marcacao['GrupoProduto1']) ? $marcacao['GrupoProduto1'] : '';
                $form['marcacao']['StatusProduto'] = !empty($marcacao['StatusProduto']) ? $marcacao['StatusProduto'] : '';
                $form['marcacao']['StatusCliente'] = !empty($marcacao['StatusCliente']) ? $marcacao['StatusCliente'] : '';
                $form['marcacao']['PcPago'] = !empty($marcacao['PcPago']) ? (int) $marcacao['PcPago'] : '';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM DADOS TITULO BASE COBRANCA

        # VERIFICA SE É FERIADO NA CIDADE DO CONTRATO
        $sql = 'SELECT Cobranca.dbo.VerificaFeriadoFicha('.$cdProcesso.') AS Feriado';

        $stmt = $conn->prepare($sql);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $feriado = $stmt->fetch();
                $form['feriado']['Feriado'] = !empty($feriado['Feriado']) ? $feriado['Feriado'] : '';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM VERIFICA SE É FERIADO NA CIDADE DO CONTRATO

        # Verifica se a ficha possuí avisos
        $sql = 'SELECT de_aviso AS Aviso FROM CobrancaAviso';
        $sql .= ' WHERE dt_limite>=CAST(GETDATE() AS DATE)'.
                ' AND cd_processo=:cd_processo';
        $sql .= ' ORDER BY cd_ordem';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $form['avisos'] = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM VERIFICA AVISOS

        # Verifica dados da ficha
        $sql = 'SELECT Cob.dt_cadastro, Cob.dt_judicial, Cob.fl_cedidos_bv, Cob.cd_avalista, Das.fl_revisional,'.
               ' Cob.nr_codigo_cliente, CobBv.de_bvmais, CobBv.de_bvdoc,'.
               ' Cob.cd_regiao_abn, Cob.cd_clpdd_finasa, Cob.cd_coefjuros_finasa, Cob.cd_taxajuros_finasa,'.
               ' Cob.cd_causa_abn, Cob.de_dados_sicoob, Cob.de_loja, Cob.de_obs_loja,'.
               " CASE WHEN Cobranca.dbo.VerificaAcaoContra(Cob.cd_processo) = 'NÃO'".
               ' THEN Cobranca.dbo.MostraAbreviacaoFilial(Dev.cd_filialss)'.
               ' ELSE Cobranca.dbo.MostraAbreviacaoFilial(Cli.cd_filialss)'.
               ' END AS FILIALSS, Cobranca.dbo.MostraGrupoCliente(Cli.cd_grupo_cliente) AS GRUPOCLIENTENOME,'.
               ' Cobranca.dbo.MostraContratoUBBFicha(Cob.cd_processo) AS CTUBB,'.
               ' Cob.cd_rating_pan, Cobranca.dbo.MostraState(Cob.cd_processo) AS STATE,'.
               ' Dis.cd_cobrador, Cobranca.dbo.MostraCliente(Dis.cd_cobrador) AS COBRADOR1,'.
               ' Dis.cd_cobrador2, Cobranca.dbo.MostraCliente(Dis.cd_cobrador2) AS COBRADOR2,'.
               ' Dis.cd_cobrador_auxiliar, Cobranca.dbo.MostraCliente(Dis.cd_cobrador_auxiliar) AS COBRADOR3,'.
               ' Cobranca.dbo.MostraClienteNome(Cob.cd_avalista) AS AVALISTA,'.
               ' Cob.cd_cliente, Cli.cd_grupo_cliente AS CDGRUPOCLI, Cli.no_cliente AS CLIENTE, '.
               ' Cob.cd_devedor, Dev.no_cliente AS DEVEDOR, Dev.cd_grupo_cliente AS CDGRUPODEV, Dev.de_observacao,'.
               ' Cobranca.dbo.VerificaAcaoContra(Cob.cd_processo) AS EACAOCONTRA,'.
               ' cob.cd_alerta, Cli.fl_calculo_geral, Cobranca.dbo.MostraCNPJCPF(Cob.cd_avalista) AS CPFCNPJAVALISTA,'.
               ' Cobranca.dbo.MostraCNPJCPF(Cob.cd_devedor) AS CPFCNPJDEVEDOR,'.
               ' Cobranca.dbo.MostraEnderecoCompletoCodigo(Cob.cd_devedor,1) AS ENDERECODEVEDOR,'.
               ' Cobranca.dbo.MostraEnderecoCompletoMascaraCodigo(Cob.cd_devedor,1) AS ENDERECODEVEDORMASCARA,'.
               ' Cobranca.dbo.MostraCarteiraContaCodigoBradescoFicha(Cob.cd_processo) AS AGENCIACONTABRADESCO,'.
               ' Cobranca.dbo.MostraMarcacaoFicha(Cob.cd_processo) AS MARCACAO,'.
               ' Cobranca.dbo.MostraClienteMascara(Cob.cd_devedor) AS NOMEDEVEDORMASCARA,'.
               ' Cobranca.dbo.MostraClienteMascara(Cob.cd_cliente) AS NOMECLIENTEMASCARA,'.
               ' CASE WHEN DEV.tp_pessoa = \'F\' THEN '.
               ' LEFT(COBRANCA.DBO.FormataNumeroTamanho(Dev.nr_cpf,11), 3) + \'******\' + RIGHT(COBRANCA.DBO.FormataNumeroTamanho(Dev.nr_cpf,11), 2) ELSE '.
               ' LEFT(COBRANCA.DBO.FormataNumeroTamanho(Dev.nr_cgc,14), 5) + \'*******\' + RIGHT(COBRANCA.DBO.FormataNumeroTamanho(Dev.nr_cgc,14), 2) END '.
               ' AS CPFCNPJDEVEDORMASCARA ';
        # echo $nMostrarEnderecoCliente; comentar com o Petuco depois o que pode ser esse JNQ<K
        if ($nMostrarEnderecoCliente) {
            $sql .= ', Cobranca.dbo.MostraEnderecoCompletoCodigo(Cob.cd_cliente,1) AS ENDERECOCLIENTE,';
            $sql .= ' Cobranca.dbo.MostraCNPJCPF(Cob.cd_cliente) AS CPFCNPJCLIENTE';
        }

        $sql .= ' FROM Cobranca AS Cob'.
                ' LEFT JOIN Distribuicao AS Dis ON (Cob.cd_processo=Dis.cd_processo)'.
                ' INNER JOIN Cliente AS Cli ON (Cob.cd_cliente=Cli.cd_cliente)'.
                ' INNER JOIN Cliente AS Dev ON (Cob.cd_devedor=Dev.cd_cliente)'.
                ' INNER JOIN CobrancaDados AS Das ON (Cob.cd_processo=Das.cd_processo)'.
                ' LEFT OUTER JOIN CobrancaBv AS CobBv ON (Cob.cd_processo=CobBv.cd_processo)';
        $sql .= ' WHERE Cob.cd_processo=:cd_processo';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();

            if ($stmt->rowCount()) {
                $contrato = $stmt->fetch();
                $form['dt_cadastro'] = !empty($contrato['dt_cadastro']) ? $contrato['dt_cadastro'] : '';
                $form['dt_judicial'] = !empty($contrato['dt_judicial']) ? $contrato['dt_judicial'] : '';
                $form['fl_cedidos_bv'] = !empty($contrato['fl_cedidos_bv']) ? $contrato['fl_cedidos_bv'] : '';
                $form['cd_avalista'] = !empty($contrato['cd_avalista']) ? $contrato['cd_avalista'] : '';
                $form['fl_revisional'] = !empty($contrato['fl_revisional']) ? $contrato['fl_revisional'] : '';
                $form['nr_codigo_cliente'] = !empty($contrato['nr_codigo_cliente']) ? $contrato['nr_codigo_cliente'] : '';
                $form['de_bvmais'] = !empty($contrato['de_bvmais']) ? $contrato['de_bvmais'] : '';
                $form['de_bvdoc'] = !empty($contrato['de_bvdoc']) ? $contrato['de_bvdoc'] : '';
                $form['cd_causa_abn'] = !empty($contrato['cd_causa_abn']) ? $contrato['cd_causa_abn'] : '';
                $form['cd_regiao_abn'] = !empty($contrato['cd_regiao_abn']) ? $contrato['cd_regiao_abn'] : '';
                $form['de_dados_sicoob'] = !empty($contrato['de_dados_sicoob']) ? $contrato['de_dados_sicoob'] : '';
                $form['de_loja'] = !empty($contrato['de_loja']) ? $contrato['de_loja'] : '';
                $form['de_obs_loja'] = !empty($contrato['de_obs_loja']) ? $contrato['de_obs_loja'] : '';
                $form['GRUPOCLIENTENOME'] = !empty($contrato['GRUPOCLIENTENOME']) ? $contrato['GRUPOCLIENTENOME'] : '';
                $form['CTUBB'] = !empty($contrato['CTUBB']) ? $contrato['CTUBB'] : '';
                $form['cd_rating_pan'] = !empty($contrato['cd_rating_pan']) ? $contrato['cd_rating_pan'] : '';
                $form['STATE'] = !empty($contrato['STATE']) ? $contrato['STATE'] : '';
                $form['cd_cobrador'] = !empty($contrato['cd_cobrador']) ? $contrato['cd_cobrador'] : '';
                $form['COBRADOR1'] = !empty($contrato['COBRADOR1']) ? $contrato['COBRADOR1'] : '';
                $form['cd_cobrador2'] = !empty($contrato['cd_cobrador2']) ? $contrato['cd_cobrador2'] : '';
                $form['COBRADOR2'] = !empty($contrato['COBRADOR2']) ? $contrato['COBRADOR2'] : '';
                $form['cd_cobrador_auxiliar'] = !empty($contrato['cd_cobrador_auxiliar']) ? $contrato['cd_cobrador_auxiliar'] : '';
                $form['COBRADOR3'] = !empty($contrato['COBRADOR3']) ? $contrato['COBRADOR3'] : '';
                $form['AVALISTA'] = !empty($contrato['AVALISTA']) ? $contrato['AVALISTA'] : '';
                $form['cd_cliente'] = !empty($contrato['cd_cliente']) ? $contrato['cd_cliente'] : '';
                $form['CDGRUPOCLI'] = !empty($contrato['CDGRUPOCLI']) ? $contrato['CDGRUPOCLI'] : '';
                $form['CLIENTE'] = !empty($contrato['CLIENTE']) ? $contrato['CLIENTE'] : '';
                $form['NOMECLIENTEMASCARA'] = !empty($contrato['NOMECLIENTEMASCARA']) ? $contrato['NOMECLIENTEMASCARA'] : '';
                $form['cd_devedor'] = !empty($contrato['cd_devedor']) ? $contrato['cd_devedor'] : '';
                $form['CDGRUPODEV'] = !empty($contrato['CDGRUPODEV']) ? $contrato['CDGRUPODEV'] : '';
                $form['de_observacao'] = !empty($contrato['de_observacao']) ? $contrato['de_observacao'] : '';
                $form['EACAOCONTRA'] = !empty($contrato['EACAOCONTRA']) ? ($contrato['EACAOCONTRA'] === 'SIM' ? true : false) : false;
                $form['cd_alerta'] = !empty($contrato['cd_alerta']) ? $contrato['cd_alerta'] : '';
                $form['fl_calculo_geral'] = !empty($contrato['fl_calculo_geral']) ? $contrato['fl_calculo_geral'] : '';
                $form['ENDERECODEVEDOR'] = !empty($contrato['ENDERECODEVEDOR']) ? $contrato['ENDERECODEVEDOR'] : '';
                $form['ENDERECODEVEDORMASCARA'] = !empty($contrato['ENDERECODEVEDORMASCARA']) ? $contrato['ENDERECODEVEDORMASCARA'] : '';
                $form['MARCACAO'] = !empty($contrato['MARCACAO']) ? $contrato['MARCACAO'] : '';
                $form['DEVEDOR'] = !empty($contrato['DEVEDOR']) ? $contrato['DEVEDOR'] : '';
                $form['CPFCNPJDEVEDOR'] = !empty($contrato['CPFCNPJDEVEDOR']) ? Utils\formata_cpf_cnpj(trim($contrato['CPFCNPJDEVEDOR'])) : '';
                $form['NOMEDEVEDORMASCARA'] = !empty($contrato['NOMEDEVEDORMASCARA']) ? $contrato['NOMEDEVEDORMASCARA'] : '';
                $form['CPFCNPJDEVEDORMASCARA'] = !empty($contrato['CPFCNPJDEVEDORMASCARA']) ? $contrato['CPFCNPJDEVEDORMASCARA'] : '';
                $form['CPFCNPJAVALISTA'] = !empty($contrato['CPFCNPJAVALISTA']) ? $contrato['CPFCNPJAVALISTA'] : '';

                # DEVEDOR CPF/CNPJ CABEÇALHO
                if (strlen($contrato['CPFCNPJDEVEDOR']) === 11) {
                    $form['TIPOPESSOA'] = 'CPF';
                } else {
                    $form['TIPOPESSOA'] = 'CNPJ';
                }

                if ($nMostrarEnderecoCliente) {
                    $form['ENDERECOCLIENTE'] = $contrato['ENDERECOCLIENTE'];
                    $form['CPFCNPJCLIENTE'] = $contrato['CPFCNPJCLIENTE'];
                }

                if ($form['CDGRUPOCLI'] === '47' || $form['CDGRUPOCLI'] === '135') {
                    $form['dadosBradesco']['cd_coefjuros_finasa'] = !empty($contrato['cd_coefjuros_finasa']) ? $contrato['cd_coefjuros_finasa'] : '';
                    $form['dadosBradesco']['cd_taxajuros_finasa'] = !empty($contrato['cd_taxajuros_finasa']) ? $contrato['cd_taxajuros_finasa'] : '';
                    $form['dadosBradesco']['cd_clpdd_finasa'] = !empty($contrato['cd_clpdd_finasa']) ? $contrato['cd_clpdd_finasa'] : '';
                }

                if ($form['CDGRUPOCLI'] === '142') {
                    $form['AGENCIACONTABRADESCO'] = !empty($contrato['AGENCIACONTABRADESCO']) ? $contrato['AGENCIACONTABRADESCO'] : '';
                }
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM VERIFICA DADOS FICHA

        # VERIFICA INFORMAÇÕES FICHA
        $sql = 'SELECT TOP 1 cd_titulo, MIN(cd_parcela) AS Parcela, MAX(nr_total_parcelas) AS Plano, MIN(dt_vencimento) AS Vencimento, MIN(vl_titulo) AS ValorParcela'.
               ', COUNT(cd_parcela) AS ParcelasVencida, DATEDIFF(DAY, MIN(dt_vencimento), CAST(GETDATE() AS DATE)) AS Atraso'.
               ', MAX(dt_cadastro) AS Cadastro, SUM(vl_titulo) AS ValorAberto'.
               ', Cobranca.dbo.MostraValorRisco(cd_processo) AS ValorRisco'.
               ', MAX(dt_fim_cob) AS dt_fim_cob';
        $sql .= ' FROM CobrancaTitulo';
        $sql .= ' WHERE cd_processo=:cd_processo'.
                ' AND dt_vencimento<=GETDATE()'.
                " AND dt_vencimento<>'01/01/1900'".
                ' AND dt_vencimento IS NOT NULL'.
                ' AND ISNUMERIC(cd_parcela)=1'.
                " AND (dt_baixa='01/01/1900' OR dt_baixa IS NULL)".
                " AND (dt_devolucao='01/01/1900' OR dt_devolucao IS NULL)".
                " AND (dt_inibicao='01/01/1900' OR dt_inibicao IS NULL)";
        $sql .= ' GROUP BY cd_processo, cd_titulo';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $informacoes = $stmt->fetch();
                $form['informacoes']['cd_titulo'] = !empty($informacoes['cd_titulo']) ? $informacoes['cd_titulo'] : '';
                $form['informacoes']['Parcela'] = !empty($informacoes['Parcela']) ? $informacoes['Parcela'] : '';
                $form['informacoes']['Plano'] = !empty($informacoes['Plano']) ? $informacoes['Plano'] : '';
                $form['informacoes']['Vencimento'] = !empty($informacoes['Vencimento']) ? $informacoes['Vencimento'] : '';
                $form['informacoes']['DataVencimento'] = !empty($form['informacoes']['Vencimento']) ? date('Y-m-d', strtotime($form['informacoes']['Vencimento'])) : '';
                $form['informacoes']['ValorParcela'] = !empty($informacoes['ValorParcela']) ? $informacoes['ValorParcela'] : '';
                $form['informacoes']['ParcelasVencida'] = !empty($informacoes['ParcelasVencida']) ? $informacoes['ParcelasVencida'] : '';
                $form['informacoes']['Atraso'] = !empty($informacoes['Atraso']) ? $informacoes['Atraso'] : '';
                $form['informacoes']['Cadastro'] = !empty($informacoes['Cadastro']) ? $informacoes['Cadastro'] : '';
                $form['informacoes']['DataCadastro'] = !empty($form['informacoes']['Cadastro']) ? date('Y-m-d', strtotime($form['informacoes']['Cadastro'])) : '';
                $form['informacoes']['ValorAberto'] = !empty($informacoes['ValorAberto']) ? $informacoes['ValorAberto'] : '';
                $form['informacoes']['ValorRisco'] = !empty($informacoes['ValorRisco']) ? $informacoes['ValorRisco'] : '';
                $form['informacoes']['dt_fim_cob'] = !empty($informacoes['dt_fim_cob']) ? $informacoes['dt_fim_cob'] : '';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();

        $sql = 'SELECT TOP 1 cd_titulo, MIN(cd_parcela) AS Parcela, MAX(nr_total_parcelas) AS Plano, MIN(dt_vencimento) AS Vencimento, MIN(vl_titulo) AS ValorParcela'.
               ', COUNT(cd_parcela) AS ParcelasVencida, DATEDIFF(DAY, MIN(dt_vencimento), CAST(GETDATE() AS DATE)) AS Atraso'.
               ', MAX(dt_cadastro) AS Cadastro, SUM(vl_titulo) AS ValorAberto'.
               ', Cobranca.dbo.MostraValorRisco(cd_processo) AS ValorRisco';
        $sql .= ' FROM CobrancaTitulo';
        $sql .= ' WHERE cd_processo=:cd_processo'.
                ' AND dt_vencimento<=GETDATE()'.
                " AND dt_vencimento<>'01/01/1900'".
                ' AND dt_vencimento IS NOT NULL'.
                ' AND ISNUMERIC(cd_parcela)=1';
        $sql .= 'GROUP BY cd_processo, cd_titulo';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $informacoes2 = $stmt->fetch();
                $form['informacoes2']['cd_titulo'] = !empty($informacoes2['cd_titulo']) ? $informacoes2['cd_titulo'] : '';
                $form['informacoes2']['Parcela'] = !empty($informacoes2['Parcela']) ? $informacoes2['Parcela'] : '';
                $form['informacoes2']['Plano'] = !empty($informacoes2['Plano']) ? $informacoes2['Plano'] : '0';
                $form['informacoes2']['Vencimento'] = !empty($informacoes2['Vencimento']) ? $informacoes2['Vencimento'] : '';
                $form['informacoes2']['DataVencimento'] = !empty($form['informacoes2']['Vencimento']) ? date('Y-m-d', strtotime($form['informacoes2']['Vencimento'])) : '';
                $form['informacoes2']['ValorParcela'] = !empty($informacoes2['ValorParcela']) ? $informacoes2['ValorParcela'] : '';
                $form['informacoes2']['ParcelasVencida'] = !empty($informacoes2['ParcelasVencida']) ? $informacoes2['ParcelasVencida'] : '';
                $form['informacoes2']['Atraso'] = !empty($informacoes2['Atraso']) ? $informacoes2['Atraso'] : '';
                $form['informacoes2']['Cadastro'] = !empty($informacoes2['Cadastro']) ? $informacoes2['Cadastro'] : '';
                $form['informacoes2']['DataCadastro'] = !empty($form['informacoes2']['Cadastro']) ? date('Y-m-d', strtotime($form['informacoes2']['Cadastro'])) : '';
                $form['informacoes2']['ValorAberto'] = !empty($informacoes2['ValorAberto']) ? $informacoes2['ValorAberto'] : '';
                $form['informacoes2']['ValorRisco'] = !empty($informacoes2['ValorRisco']) ? $informacoes2['ValorRisco'] : '';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # /FIM VERIFICA INFORMAÇÕES FICHA

        # INÍCIO - OBTENDO RESTRIÇÕES DE BOLETO 
        $sql = "SELECT CAST(dt_bloqueio AS DATE) AS dt_bloqueio, dt_criacao, CASE WHEN RIGHT(de_origem_bloqueio,4)='.TXT' THEN 'PAGAMENTO BOLETO' ELSE de_origem_bloqueio END AS de_origem_bloqueio FROM BloqueioDiscagemTemporario ";
        $sql .= "WHERE cd_processo=:cd_processo";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        $form['BloqueioDiscagemTemporario'] = null;

        try{
            $stmt->execute();
            while($row = $stmt->fetch(\PDO::FETCH_ASSOC)){                
                $form['BloqueioDiscagemTemporario'][] = array(
                    'dt_bloqueio' => !empty($row['dt_bloqueio']) ? $row['dt_bloqueio'] : '', 
                    'dt_criacao' => !empty($row['dt_criacao']) ? $row['dt_criacao'] : '',
                    'de_origem_bloqueio' => !empty($row['de_origem_bloqueio']) ? $row['de_origem_bloqueio'] : '',
                );
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        
		# FIM - OBTENDO RESTRIÇÕES DE BOLETO

        # BANCO PAN
        if ($form['CDGRUPOCLI'] === '11' || $form['CDGRUPOCLI'] === '78') {
            $sql = 'SELECT de_fpd, de_cessionario, fl_seguro, dt_vigencia_seguro, de_score, cd_score2, fl_refin, fl_contrato_reneg, de_notificacao, '.
                   ' dt_notificacao, fl_elegivel_parcelamento, fl_elegivel_entrega, dt_acordo_quebrado, dt_acordo_parc_quebrado, '.
                   ' Qtd_acordo_quebrado, Qtd_acordo_parc_quebrado, fl_score_ajuizado, nr_parcela_notificada, dt_notificacao_aju, cd_veiculo, vl_veiculo ';
            $sql .= ' FROM CobrancaPanamericano';
            $sql .= ' WHERE cd_processo=:cd_processo';

            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

            try {
                $stmt->execute();
                if ($stmt->rowCount()) {
                    $bancoPAN = $stmt->fetch(\PDO::FETCH_ASSOC);
                    $form['bancoPAN']['de_fpd'] = !empty($bancoPAN['de_fpd']) ? $bancoPAN['de_fpd'] : '';
                    $form['bancoPAN']['de_cessionario'] = !empty($bancoPAN['de_cessionario']) ? $bancoPAN['de_cessionario'] : '';
                    $form['bancoPAN']['fl_seguro'] = !empty($bancoPAN['fl_seguro']) ? $bancoPAN['fl_seguro'] : '';
                    $form['bancoPAN']['dt_vigencia_seguro'] = !empty($bancoPAN['dt_vigencia_seguro']) ? $bancoPAN['dt_vigencia_seguro'] : '';
                    $form['bancoPAN']['dt_vigencia_seguro'] = !empty($form['bancoPAN']['dt_vigencia_seguro']) ? date('d/m/Y', strtotime($form['bancoPAN']['dt_vigencia_seguro'])) : '';
                    $form['bancoPAN']['de_score'] = !empty($bancoPAN['de_score']) ? $bancoPAN['de_score'] : '';
                    $form['bancoPAN']['cd_score2'] = !empty($bancoPAN['cd_score2']) ? $bancoPAN['cd_score2'] : '';
                    $form['bancoPAN']['fl_refin'] = !empty($bancoPAN['fl_refin']) ? $bancoPAN['fl_refin'] : '';
                    $form['bancoPAN']['fl_contrato_reneg'] = !empty($bancoPAN['fl_contrato_reneg']) ? $bancoPAN['fl_contrato_reneg'] : '';
                    $form['bancoPAN']['de_notificacao'] = !empty($bancoPAN['de_notificacao']) ? $bancoPAN['de_notificacao'] : '';
                    $form['bancoPAN']['dt_notificacao'] = !empty($bancoPAN['dt_notificacao']) ? $bancoPAN['dt_notificacao'] : '';
                    $form['bancoPAN']['dt_notificacao'] = !empty($form['bancoPAN']['dt_notificacao']) ? date('d/m/Y', strtotime($form['bancoPAN']['dt_notificacao'])) : '';
                    $form['bancoPAN']['fl_elegivel_parcelamento'] = !empty($bancoPAN['fl_elegivel_parcelamento']) ? $bancoPAN['fl_elegivel_parcelamento'] : '';
                    $form['bancoPAN']['fl_elegivel_entrega'] = !empty($bancoPAN['fl_elegivel_entrega']) ? $bancoPAN['fl_elegivel_entrega'] : '';
                    $form['bancoPAN']['dt_acordo_quebrado'] = !empty($bancoPAN['dt_acordo_quebrado']) ? $bancoPAN['dt_acordo_quebrado'] : '';
                    $form['bancoPAN']['dt_acordo_quebrado'] = !empty($form['bancoPAN']['dt_acordo_quebrado']) ? date('d/m/Y', strtotime($form['bancoPAN']['dt_acordo_quebrado'])) : '';
                    $form['bancoPAN']['dt_acordo_parc_quebrado'] = !empty($bancoPAN['dt_acordo_parc_quebrado']) ? $bancoPAN['dt_acordo_parc_quebrado'] : '';
                    $form['bancoPAN']['dt_acordo_parc_quebrado'] = !empty($form['bancoPAN']['dt_acordo_parc_quebrado']) ? date('d/m/Y', strtotime($form['bancoPAN']['dt_acordo_parc_quebrado'])) : '';
                    $form['bancoPAN']['Qtd_acordo_quebrado'] = !empty($bancoPAN['Qtd_acordo_quebrado']) ? $bancoPAN['Qtd_acordo_quebrado'] : '';
                    $form['bancoPAN']['Qtd_acordo_parc_quebrado'] = !empty($bancoPAN['Qtd_acordo_parc_quebrado']) ? $bancoPAN['Qtd_acordo_parc_quebrado'] : '';
                    $form['bancoPAN']['fl_score_ajuizado'] = !empty($bancoPAN['fl_score_ajuizado']) ? $bancoPAN['fl_score_ajuizado'] : '';
                    $form['bancoPAN']['nr_parcela_notificada'] = !empty($bancoPAN['nr_parcela_notificada']) ? $bancoPAN['nr_parcela_notificada'] : '';
                    $form['bancoPAN']['dt_notificacao_aju'] = !empty($bancoPAN['dt_notificacao_aju']) ? $bancoPAN['dt_notificacao_aju'] : '';
                    $form['bancoPAN']['dt_notificacao_aju'] = !empty($form['bancoPAN']['dt_notificacao_aju']) ? date('d/m/Y', strtotime($form['bancoPAN']['dt_notificacao_aju'])) : '';
                    $form['bancoPAN']['cd_veiculo'] = !empty($bancoPAN['cd_veiculo']) ? $bancoPAN['cd_veiculo'] : '';
                    $form['bancoPAN']['vl_veiculo'] = !empty($bancoPAN['vl_veiculo']) ? $bancoPAN['vl_veiculo'] : '';
                    $form['bancoPAN']['Plano'] = !empty($informacoes['Plano']) ? $informacoes['Plano'] : '';
                    $form['bancoPAN']['Plano'] = !empty($informacoes2['Plano']) ? $informacoes2['Plano'] : '';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();

            # BANCO PAN VEICULO
            if (!empty($form['informacoes2'])) {
                $cdContrato = $form['informacoes2']['cd_titulo'];
            } else {
                $cdContrato = '';
            }

            $sql = 'SELECT top 1 veiculocodigo FROM logpan.dbo.remessagarantias ';
            $sql .= " WHERE cd_contrato='".$cdContrato."' GROUP BY veiculocodigo";

            $stmt = $conn->prepare($sql);

            try {
                $stmt->execute();
                if ($stmt->rowCount()) {
                    $bancoPANVeiculo = $stmt->fetch();
                    $form['bancoPANVeiculo']['veiculocodigo'] = !empty($bancoPANVeiculo['veiculocodigo']) ? $bancoPANVeiculo['veiculocodigo'] : '';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();
            # FIM BANCO PAN VEICULO

            # LOG BATIMENTO PAN
            $sql = 'SELECT CONVERT(VARCHAR(10), dt_primeiro_env_cob, 103) AS DATAPRIMEIRACOB, CONVERT(VARCHAR(10), dt_ultimo_env_cob, 103) AS DATAULTIMACOB, '.
                   ' CONVERT(VARCHAR(10), dt_primeiro_env_aju, 103) AS DATAPRIMEIROAJU, CONVERT(VARCHAR(10), dt_ultimo_env_aju, 103) AS DATAULTIMAAJU, '.
                   " CASE  WHEN status_processo_env = 'A' THEN 'AJUIZADO' WHEN status_processo_env = 'E' THEN 'ENCERRADO' ELSE status_processo_env END AS STATUSPROCESSO ";
            $sql .= ' FROM logpan.dbo.logbatimento ';
            $sql .= ' WHERE cd_processo=:cd_processo';

            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

            try {
                $stmt->execute();
                if ($stmt->rowCount()) {
                    $logBatimentoPAN = $stmt->fetch();
                    $form['logBatimentoPAN']['DATAPRIMEIRACOB'] = !empty($logBatimentoPAN['DATAPRIMEIRACOB']) ? $logBatimentoPAN['DATAPRIMEIRACOB'] : '';
                    $form['logBatimentoPAN']['DATAULTIMACOB'] = !empty($logBatimentoPAN['DATAULTIMACOB']) ? $logBatimentoPAN['DATAULTIMACOB'] : '';
                    $form['logBatimentoPAN']['DATAPRIMEIROAJU'] = !empty($logBatimentoPAN['DATAPRIMEIROAJU']) ? $logBatimentoPAN['DATAPRIMEIROAJU'] : '';
                    $form['logBatimentoPAN']['DATAULTIMAAJU'] = !empty($logBatimentoPAN['DATAULTIMAAJU']) ? $logBatimentoPAN['DATAULTIMAAJU'] : '';
                    $form['logBatimentoPAN']['STATUSPROCESSO'] = !empty($logBatimentoPAN['STATUSPROCESSO']) ? $logBatimentoPAN['STATUSPROCESSO'] : '';
                } else {
                    $form['logBatimentoPAN']['NoResult'] = 'ENVIADO NO BATIMENTO : NÃO';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();
            # FIM LOG BATIMENTO PAN
        }
        # FIM BANCO PAN

        # RECOVERY
        if ($form['CDGRUPOCLI'] === '66') {
            $sql = 'SELECT id_operacao_sir, saldo_traspaso, saldo_operativo, grupo ';
            $sql .= 'FROM CobrancaRecovery ';
            $sql .= 'WHERE cd_processo=:cd_processo';

            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

            try {
                $stmt->execute();
                if ($stmt->rowCount()) {
                    $recovery = $stmt->fetch();
                    $form['recovery']['id_operacao_sir'] = !empty($recovery['id_operacao_sir']) ? $recovery['id_operacao_sir'] : '';
                    $form['recovery']['saldo_traspaso'] = !empty($recovery['saldo_traspaso']) ? $recovery['saldo_traspaso'] : '';
                    $form['recovery']['saldo_operativo'] = !empty($recovery['saldo_operativo']) ? $recovery['saldo_operativo'] : '';
                    $form['recovery']['grupo'] = !empty($recovery['grupo']) ? $recovery['grupo'] : '';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();
        }
        # FIM RECOVERY

        # BANCO BV
        if ($form['CDGRUPOCLI'] === '26' || $form['CDGRUPOCLI'] === '48' || $form['CDGRUPODEV'] === '26' || $form['CDGRUPODEV'] === '48') {
            $sql = ' SELECT tb1.vl_mora, tb1.vl_multa, tb1.cd_tipo_bem, tb1.de_tipo_bem, tb1.cd_produto, tb1.de_produto, tb1.cd_modalidade, tb1.de_modalidade, tb1.cd_filial '.
                   ', tb1.de_filial, tb1.cd_regiao, tb1.de_regiao, tb1.tx_juros, tb1.tx_cet, tb1.vl_risco, tb1.de_empresa, tb1.cd_score, tb1.de_regiao_nova '.
                   ', tb1.cd_regiao_nova, tb1.vl_bem, tb1.vl_contabil, tb1.nr_dia_recorrente, tb1.nr_proposta, tb1.fl_suspenso, tb1.motivo_bloqueio, '.
                   ' tb2.vl_financiado, tb3.dt_bloqueio, tb1.de_motivo_contrato_financeiro ';
            $sql .= ' FROM Cobranca.dbo.CobrancaBV AS tb1 '.
                    ' INNER JOIN Cobranca.dbo.Cobranca AS tb2 ON (tb1.cd_processo=tb2.cd_processo) '.
                    ' LEFT JOIN BloqueioDiscagemTemporario AS tb3 ON (tb1.cd_processo=tb3.cd_processo) ';
            $sql .= ' WHERE tb1.cd_processo=:cd_processo';

            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

            try {
                $stmt->execute();

                if ($stmt->rowCount()) {
                    $bancoBV = $stmt->fetch();
                    $form['bancoBV']['vl_mora'] = !empty($bancoBV['vl_mora']) ? $bancoBV['vl_mora'] : '';
                    $form['bancoBV']['vl_multa'] = !empty($bancoBV['vl_multa']) ? $bancoBV['vl_multa'] : '';
                    $form['bancoBV']['cd_tipo_bem'] = !empty($bancoBV['cd_tipo_bem']) ? $bancoBV['cd_tipo_bem'] : '';
                    $form['bancoBV']['de_tipo_bem'] = !empty($bancoBV['de_tipo_bem']) ? $bancoBV['de_tipo_bem'] : '';
                    $form['bancoBV']['cd_produto'] = !empty($bancoBV['cd_produto']) ? $bancoBV['cd_produto'] : '';
                    $form['bancoBV']['de_produto'] = !empty($bancoBV['de_produto']) ? $bancoBV['de_produto'] : '';
                    $form['bancoBV']['cd_modalidade'] = !empty($bancoBV['cd_modalidade']) ? $bancoBV['cd_modalidade'] : '';
                    $form['bancoBV']['de_modalidade'] = !empty($bancoBV['de_modalidade']) ? $bancoBV['de_modalidade'] : '';
                    $form['bancoBV']['cd_filial'] = !empty($bancoBV['cd_filial']) ? $bancoBV['cd_filial'] : '';
                    $form['bancoBV']['de_filial'] = !empty($bancoBV['de_filial']) ? $bancoBV['de_filial'] : '';
                    $form['bancoBV']['cd_regiao'] = !empty($bancoBV['cd_regiao']) ? $bancoBV['cd_regiao'] : '';
                    $form['bancoBV']['de_regiao'] = !empty($bancoBV['de_regiao']) ? $bancoBV['de_regiao'] : '';
                    $form['bancoBV']['tx_juros'] = !empty($bancoBV['tx_juros']) ? $bancoBV['tx_juros'] : '';
                    $form['bancoBV']['tx_cet'] = !empty($bancoBV['tx_cet']) ? $bancoBV['tx_cet'] : '';
                    $form['bancoBV']['vl_risco'] = !empty($bancoBV['vl_risco']) ? $bancoBV['vl_risco'] : '';
                    $form['bancoBV']['de_empresa'] = !empty($bancoBV['de_empresa']) ? $bancoBV['de_empresa'] : '';
                    $form['bancoBV']['cd_score'] = !empty($bancoBV['cd_score']) ? $bancoBV['cd_score'] : '';
                    $form['bancoBV']['de_regiao_nova'] = !empty($bancoBV['de_regiao_nova']) ? $bancoBV['de_regiao_nova'] : '';
                    $form['bancoBV']['cd_regiao_nova'] = !empty($bancoBV['cd_regiao_nova']) ? $bancoBV['cd_regiao_nova'] : '';
                    $form['bancoBV']['vl_bem'] = !empty($bancoBV['vl_bem']) ? $bancoBV['vl_bem'] : '';
                    $form['bancoBV']['vl_contabil'] = !empty($bancoBV['vl_contabil']) ? $bancoBV['vl_contabil'] : '';
                    $form['bancoBV']['nr_dia_recorrente'] = !empty($bancoBV['nr_dia_recorrente']) ? $bancoBV['nr_dia_recorrente'] : '';
                    $form['bancoBV']['nr_proposta'] = !empty($bancoBV['nr_proposta']) ? $bancoBV['nr_proposta'] : '';
                    $form['bancoBV']['fl_suspenso'] = !empty($bancoBV['fl_suspenso']) ? $bancoBV['fl_suspenso'] : '';
                    $form['bancoBV']['motivo_bloqueio'] = !empty($bancoBV['motivo_bloqueio']) ? $bancoBV['motivo_bloqueio'] : '';
                    $form['bancoBV']['vl_financiado'] = !empty($bancoBV['vl_financiado']) ? $bancoBV['vl_financiado'] : '';
                    $form['bancoBV']['dt_bloqueio'] = !empty($bancoBV['dt_bloqueio']) ? date('d/m/Y', strtotime($bancoBV['dt_bloqueio'])) : '';
                    $form['bancoBV']['de_motivo_contrato_financeiro'] = !empty($bancoBV['de_motivo_contrato_financeiro']) ? $bancoBV['de_motivo_contrato_financeiro'] : '';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();
        }
        # FIM BANCO BV

        # BANCO SANTANDER
        if ($form['CDGRUPOCLI'] === '4' || $form['CDGRUPOCLI'] === '82' || $form['CDGRUPOCLI'] === '86') {
            $sql = 'SELECT subsegmento FROM Cobranca.dbo.CobrancaSantander ';
            $sql .= ' WHERE cd_processo=:cd_processo';

            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

            try {
                $stmt->execute();
                if ($stmt->rowCount() || !$stmt->rowCount()) {
                    $dadosSantander = $stmt->fetch();
                    $form['dadosSantander']['subsegmento'] = !empty($dadosSantander['subsegmento']) ? $dadosSantander['subsegmento'] : '';
                }
            } catch (PDOException $e) {
                error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
                throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            }

            $stmt->closeCursor();
        }
        # FIM BANCO SANTANDER

        # PESQUISA OS DADOS DAS PARCELAS
        $sql = 'SELECT cd_titulo, cd_parcela, nr_total_parcelas, CONVERT(VARCHAR, dt_vencimento, 103) as dt_vencimento, vl_titulo';
        $sql .= ' FROM CobrancaTitulo';
        $sql .= ' WHERE cd_processo=:cd_processo'.
                ' AND dt_vencimento<=GETDATE()'.
                " AND (dt_baixa='01/01/1900' OR dt_baixa IS NULL)".
                " AND (dt_devolucao='01/01/1900' OR dt_devolucao IS NULL)";
        $sql .= ' ORDER BY cd_parcela ASC';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        $dataAtual = date('Y-m-d');
        $datetime1 = date_create($dataAtual);

        try {
            $stmt->execute();
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                $date = $row['dt_vencimento'];
                $replaceDate = str_replace('/', '-', $date);
                $dateFormat = date('Y-m-d', strtotime($replaceDate));
                $datetime2 = date_create($dateFormat);
                $interval = date_diff($datetime1, $datetime2);

                $form['dadosParcela'][] = [
                    'cd_titulo' => $row['cd_titulo'],
                    'cd_parcela' => $row['cd_parcela'],
                    'nr_total_parcelas' => $row['nr_total_parcelas'],
                    'dt_vencimento' => $row['dt_vencimento'],
                    'vl_titulo' => $row['vl_titulo'],
                    'dias_atraso' => $interval->format('%a'),
                ];
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM PESQUISA DADOS PARCELA

        # PESQUISA OS DADOS DAS GARANTIAS
        $sql = 'SELECT nr_bem, de_veiculo_modelo, de_veiculo_marca, de_veiculo_cor, de_veiculo_placa,'.
               ' de_ano_fabricacao, de_ano_modelo, nr_renavam, de_chassi, cd_codigo_molicar, de_tipo_bem';
        $sql .= ' FROM CobrancaBem';
        $sql .= ' WHERE cd_processo=:cd_processo';
        $sql .= " AND de_chassi <> '0' ";
        $sql .= ' ORDER BY nr_bem';

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $form['dadosGarantia'] = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM PESQUISA DADOS GARANTIA

        # PESQUISA OS DADOS DAS DESPESAS
        $sql = ' SELECT de_custas, vl_valor, CONVERT(DATE, dt_cadastro, 103) as dt_cadastro, '.
               " CASE WHEN (CONVERT(VARCHAR, dt_reembolso, 103)='01/01/1900' OR CONVERT(VARCHAR, dt_reembolso, 103) IS NULL) THEN '' ".
               ' ELSE CONVERT(VARCHAR, dt_reembolso, 103) END as dt_reembolso ';
        $sql .= ' FROM Despesa';
        $sql .= ' WHERE cd_processo=:cd_processo'.
                ' AND (fl_devedor=0 OR fl_devedor IS NULL)'.
                " AND de_custas NOT IN ('SERVIÇO INTERNO', 'DESPESAS PROCESSUAIS', 'DILIGENCIA DO COBRADOR EXTERNO')".
                " AND fl_tipo='D'".
                ' AND CAST(dt_cadastro AS DATE)<=CAST(GETDATE() AS DATE)'.
                " AND (dt_sem_reembolso='01/01/1900' OR dt_sem_reembolso IS NULL)".
                " AND (dt_bloqueio='01/01/1900' OR dt_bloqueio IS NULL)";
        $sql .= ' ORDER BY dt_cadastro ';

        # Soma as despesas
        $somaDespesa = $conn->query('SELECT SUM(vl_valor) AS total FROM Despesa WHERE cd_processo='.$cdProcesso." AND (fl_devedor=0 OR fl_devedor IS NULL) AND de_custas NOT IN ('SERVIÇO INTERNO', 'DESPESAS PROCESSUAIS', 'DILIGENCIA DO COBRADOR EXTERNO') AND fl_tipo='D' AND CAST(dt_cadastro AS DATE)<=CAST(GETDATE() AS DATE) AND (dt_sem_reembolso='01/01/1900' OR dt_sem_reembolso IS NULL) AND (dt_bloqueio='01/01/1900' OR dt_bloqueio IS NULL)")->fetchColumn();

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $form['dadosDespesa'] = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                $form['dadosSomaDespesa'] = $somaDespesa;
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM PESQUISA DADOS DESPESA

        # ESPESAS A VENCER NO DIA
        $sql = 'SELECT MIN(dt_cadastro) AS dt_cadastro, SUM(vl_valor) AS vl_valor';
        $sql .= ' FROM Despesa';
        $sql .= ' WHERE cd_processo=:cd_processo'.
                ' AND (fl_devedor=0 OR fl_devedor IS NULL)'.
                " AND de_custas NOT IN ('SERVIÇO INTERNO', 'DESPESAS PROCESSUAIS', 'DILIGENCIA DO COBRADOR EXTERNO')".
                " AND fl_tipo='D'".
                ' AND CAST(dt_cadastro AS DATE)>CAST(GETDATE() AS DATE)'.
                " AND (dt_sem_reembolso='01/01/1900' or dt_sem_reembolso IS NULL)".
                " AND (dt_bloqueio='01/01/1900' OR dt_bloqueio IS NULL)";

        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':cd_processo', $cdProcesso, \PDO::PARAM_INT);

        try {
            $stmt->execute();
            if ($stmt->rowCount()) {
                $form['dadosDespesaVencer'] = !empty($bancoBV['dadosDespesaVencer']) ? $form['dadosDespesaVencer'] = $stmt->fetch(\PDO::FETCH_ASSOC) : '';
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();
        # FIM PESQUISA DESPESASA A VENCER NO DIA

        return $form;
    }

    function getDateDataBaseCall()
    {
        global $conn;
        $form = [];
        $sql = 'SELECT GETDATE()-45 AS dt_base_acionamento FROM Cobranca.dbo.Configuracao';

        $stmt = $conn->prepare($sql);

        try {
            $stmt->execute();

            if ($stmt->rowCount()) {
                $dt_base_acionamento = $stmt->fetchColumn();
                if ($dt_base_acionamento !== '') {
                    $form['dt_base_acionamento'] = date('Ymd', strtotime(str_replace('-', '/', $dt_base_acionamento)));
                    $form['lb_data_base_acionamento'] = date('d/m/Y', strtotime(str_replace('-', '/', $dt_base_acionamento))); //str_pad(2, '0', STR_PAD_RIGHT, date('d', strtotime(str_replace('-','/', $dt_base_acionamento))));
                } else {
                    $form['dt_base_acionamento'] = date('Ymd');
                    $form['lb_data_base_acionamento'] = date('d/m/Y');
                }
            } else {
                $form['dt_base_acionamento'] = date('Ymd');
                $form['lb_data_base_acionamento'] = date('d/m/Y');
            }
        } catch (PDOException $e) {
            error_log('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
            throw new \Exception('Problema ao efetuar a consulta na base de dados: '.$e->getCode().' - '.$e->getMessage());
        }

        $stmt->closeCursor();

        return $form;
    }

    function waterMark($cdUser, $ip)
    {
        header('Content-type: image/png');
        $string = $cdUser.'-'.$ip;
        $im = imagecreatefrompng('images/i.png');
        $orange = imagecolorallocate($im, 220, 210, 60);
        $px = (imagesx($im) - 7.5 * strlen($string)) / 2;
        imagestring($im, 3, $px, 9, $string, $orange);
        imagepng($im);
        imagedestroy($im);
    }
}
