<?php
header('Content-Type: text/javascript; charset=UTF-8');
ini_set('error_reporting','E_ALL & ~E_NOTICE');
ini_set('memory_limit', '1024M');
/** @Class: Relatorios
 *  @date: 2012-09-18
 * Animal Status
 * 0 - Morto
 * 1 - Ativo
 * 2 - Vendido
 * 
 */

class Relatorios extends Base {

    public function getRelatorios($data) {
        // Montar o Cabecalho do Relatorio
        $html = '<!DOCTYPE html>';
        $html .= "<html>";
        $html .=   '<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">';
        $html .=   "<style>
                        table
                        {
                        border-collapse:collapse;
                        }

                        tr { background-color: #FFF;}
                        .tr_initial { background-color: #FFF;}
                        .tr_normal { background-color: #FFF;}
                        .tr_highlight {
                            background-color: #DEDBDB;
                            border:1px solid blue;!important;
                        }

                        table, td, th
                        {
                            border:1px solid black;
                            padding:5px;
                        }
                        table, td {
                            text-align:center;
                        }
                        .td_label
                        {
                            text-align:left;
                            font-weight:bold;
                        }
                        .row_total
                        {
                            font-weight:bold;
                            background-color:#ECD29A;
                        }
                        .row_animal
                        {
                        }
                        .row_animal_morto td
                        {
                            color: #FF0000;
                        }
                        .noBorder
                        {
                           -- border-right-style:hidden;!important;
                            border-left-style:hidden;!important;
                        }
                    </style>";
        $html .= "<header>";
        $html .= "</header>";
        $html .= "</body>";

        // Se tiver agrupamento montar primeiro os grupos
        if ($data->group_by){
           $result = Relatorios::getGrupos($data);
        }

        $html .= Relatorios::makeReportHtml(json_encode($result));
        //Relatorios::getAnimais($data);

        $html .= "</body>";
        $html .= "</html>";

        $aResult['success'] = "true";
        $aResult['content']  = $html;
        $aResult['mime']  = "text/html";
        echo json_encode($aResult);
    }
    public function getGrupos($data){
        $db = $this->getDb();
        $db->beginTransaction();

        // AGRUPADO POR LOTE DE COMPRA
        if ($data->group_by == "compra_id"){

            $filtro = Relatorios::makeFilters($data);
            // Recuperar as compras para este filtro
            $sql_ids = "SELECT DISTINCT(compra_id) FROM vw_animais $filtro";
            $sql = "SELECT a.id as compra_id, a.*, b.id as forncedor_id, b.* FROM compras a INNER JOIN fornecedores b ON a.fornecedor_id = b.id WHERE a.id IN ($sql_ids);";
            //echo "$sql\n";
            $stm = $db->prepare($sql);
            $stm->execute();
            $compras = $stm->fetchAll(\PDO::FETCH_OBJ);

            $registros = array();
            foreach ($compras as $compra){
                $registro = new StdClass();

                // Para cada Compra recuperar os totais ATIVOS
                $sql = "SELECT sexo, COUNT(*) as qtd_ativos  FROM animais WHERE compra_id = {$compra->compra_id} and status = 1 GROUP BY sexo;";
                $stm = $db->prepare($sql);
                $stm->execute();
                $ativos = $stm->fetchAll(\PDO::FETCH_OBJ);
                foreach ($ativos as $ativo){
                    $compra->qtd_ativos += $ativo->qtd_ativos;
                    if ($ativo->sexo == "F"){
                        $compra->qtd_femeas_ativos = $ativo->qtd_ativos;
                    }
                    else {
                        $compra->qtd_machos_ativos = $ativo->qtd_ativos;
                    }
                }
                // Para cada Compra recuperar os totais TRANSFERIDOS
                $sql = "SELECT sexo, COUNT(*) as qtd_transferidos  FROM animais WHERE compra_id = {$compra->compra_id} and confinamento_id <> {$compra->confinamento_id} and status = 1 GROUP BY sexo;";
                $stm = $db->prepare($sql);
                $stm->execute();
                $ativos = $stm->fetchAll(\PDO::FETCH_OBJ);
                foreach ($ativos as $ativo){
                    $compra->qtd_transferidos += $ativo->qtd_transferidos;
                    if ($ativo->sexo == "F"){
                        $compra->qtd_femeas_transferidos = $ativo->qtd_transferidos;
                    }
                    else {
                        $compra->qtd_machos_transferidos = $ativo->qtd_transferidos;
                    }
                }
                // Para cada Compra recuperar os totais VENDIDOS
                $sql = "SELECT sexo, COUNT(*) as qtd_vendidos  FROM animais WHERE compra_id = {$compra->compra_id} and status = 2 GROUP BY sexo;";
                $stm = $db->prepare($sql);
                $stm->execute();
                $ativos = $stm->fetchAll(\PDO::FETCH_OBJ);
                foreach ($vendidos as $vendido){
                    $compra->qtd_vendidos += $ativo->qtd_vendido;
                    if ($ativo->sexo == "F"){
                        $compra->qtd_femeas_vendidos = $ativo->qtd_vendidos;
                    }
                    else {
                        $compra->qtd_machos_vendidos = $ativo->qtd_vendidos;
                    }
                }
                // Para cada Compra recuperar os totais MORTOS
                $sql = "SELECT sexo, COUNT(*) as qtd_mortos  FROM animais WHERE compra_id = {$compra->compra_id} and status = 0 GROUP BY sexo;";
                $stm = $db->prepare($sql);
                $stm->execute();
                $ativos = $stm->fetchAll(\PDO::FETCH_OBJ);
                foreach ($ativos as $ativo){
                    $compra->qtd_mortos += $ativo->qtd_mortos;
                    if ($ativo->sexo == "F"){
                        $compra->qtd_femeas_mortos = $ativo->qtd_mortos;
                    }
                    else {
                        $compra->qtd_machos_mortos = $ativo->qtd_mortos;
                    }
                }

                // Para Cada Compra recuperar os animais
                $data->compra_id = $compra->compra_id;
                // Recuperar todos os animais ou so os animais no confinamento
                $data->confinamento_id = null;
                $animais = Relatorios::getAnimais($data);
                $compra->animais = $animais;

                // Estatisticas da compra
                $k = 0;
                foreach ($animais as $animal){
                    $estatistica = $animal->pesagens->estatisticas;

                    $compra->total_ganho_diario[$k] = $estatistica->ganho_diario;
                    $compra->total_ganho[$k] = $estatistica->peso_ganho;
                    $compra->total_dias_confinamento[$k] = $estatistica->dias_confinamento;
                    $compra->total_pesos[$k] = $estatistica->peso_atual;
                    $k++;
                }
                $compra->total_peso_atual = array_sum($compra->total_pesos);
                $compra->total_peso_atual = number_format($compra->total_peso_atual, 2, '.',',');

                $compra->total_dias_confinamento_medio = array_sum($compra->total_dias_confinamento) / count($compra->total_dias_confinamento);
                $compra->total_dias_confinamento_medio = round($compra->total_dias_confinamento_medio);

                $compra->total_peso_medio = array_sum($compra->total_pesos) / count($compra->total_pesos);
                $compra->total_peso_medio = number_format($compra->total_peso_medio, 2, '.',',');

                $compra->total_peso_maior = max($compra->total_pesos);
                $compra->total_peso_menor = min($compra->total_pesos);

                $compra->total_media_ganho_diario = array_sum($compra->total_ganho_diario) / count($compra->total_ganho_diario);
                $compra->total_media_ganho_diario = number_format($compra->total_media_ganho_diario, 3, '.',',');

                $compra->total_media_ganho = array_sum($compra->total_ganho) / count($compra->total_ganho);
                $compra->total_media_ganho = number_format($compra->total_media_ganho, 2, '.',',');

                $compra->total_ganho = array_sum($compra->total_ganho);
                $compra->total_ganho = number_format($compra->total_ganho, 2, '.',',');

                $compra->total_classificacao =  Pesagens::getClassificacaoMediaDia($compra->total_media_ganho_diario);
                $compra->total_cor_classificacao = Pesagens::getCorClassificacao($compra->total_classificacao);


                $filtro = $data;
                $filtro->compra_id = $compra->compra_id;
                // Recuperar as datas das pesagens de Rotina
//                $sql = "SELECT DISTINCT(data) FROM pesagens p INNER JOIN vw_animais a ON p.animal_id = a.id WHERE a.compra_id = {$compra->compra_id} AND p.tipo = 2 ORDER BY p.data ASC;";
                $sql = "SELECT DISTINCT(data) FROM pesagens INNER JOIN vw_animais ON pesagens.animal_id = vw_animais.id ";
                $sql .= Relatorios::makeFilters($filtro);
                $sql .= "  AND tipo = 2";
                $sql .= " ORDER BY data ASC;";
                $stm = $db->prepare($sql);
                $stm->execute();
                $data_pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);
                foreach ($data_pesagens as $datas){
                    $compra->data_pesagens[] = $datas->data;
                }
                //var_dump($compra);

                $registro = $compra;
                array_push($registros, $registro);
            }
            $result = new StdClass();
            $result->compras = $registros;
            //echo json_encode($result);
            return $result;
        }

    }

    public function getAnimais($data){
        $db = $this->getDb();

        // Recuperar todos os animais
        $data->status = -1;

        $sql = "SELECT * FROM vw_animais " ;
        $sql .= Relatorios::makeFilters($data);
        $sql .= " ORDER BY codigo ASC";
        //echo "$sql\n";
        // Executar a Query
        $stm = $db->prepare($sql);
        $stm->execute();
        $animais = $stm->fetchAll(\PDO::FETCH_OBJ);

        $registros = array();
        // Para Cada Animal Recuperar os Pesos
        foreach($animais as $animal){
            $pesagens = Relatorios::getPesagens($animal);
            $animal->pesagens = $pesagens;

            array_push($registros, $animal);
        }
        return $registros;
    }

    public function getPesagens($animal){
        $db = $this->getDb();

        $sql = "SELECT pesagens.* FROM pesagens INNER JOIN vw_animais ON pesagens.animal_id = vw_animais.id WHERE animal_id = {$animal->id}";
        $sql .= " ORDER BY data ASC, tipo DESC";

        //echo $sql;
        // Executar a Query
        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);

        $registros = new StdClass;
        $registros->pesagens = array();
        //$registros->estatisticas = Animais::getEstatiscaPorAnimal($animal->id);
        //var_dump($registros->estatisticas);
        $data_anterior = "";
        $peso_anterior = "";

        $estatisticas = new StdClass();

        foreach ($pesagens as $pesagem){
            //var_dump($pesagem);
            //$registro = new StdClass();
            if ($pesagem->tipo == 3){
                $registros->compra_peso = $pesagem->peso;
                $registros->compra_data = $pesagem->data;
            }
            else if ($pesagem->tipo == 1){
                $registros->entrada_peso = $pesagem->peso;
                $registros->entrada_data = $pesagem->data;
                $estatisticas->peso_entrada = $pesagem->peso;
                $estatisticas->data_entrada = $pesagem->data;
            }
            else if ($pesagem->tipo == 4){
                $registros->saida_peso = $pesagem->peso;
                $registros->saida_data = $pesagem->data;
            }

            $registro = $pesagem;
            if ($data_anterior != ""){
                $registro->data_intervalo = Relatorios::diferencaEntreDatas($data_anterior, $pesagem->data);
                if ($registro->data_intervalo != 0){
                    $ganho = $pesagem->peso - $peso_anterior;
                    $registro->ganho = number_format($ganho, 2, '.','.');

                    $ganho_diario = $pesagem->ganho / $registro->data_intervalo;
                    $registro->ganho_diario = number_format($ganho_diario, 3, '.','.');

                    $registro->classificacao = Pesagens::getClassificacaoMediaDia($registro->ganho_diario);
                    $registro->cor_classificacao = Pesagens::getCorClassificacao($registro->classificacao);
                }
            }

            $data_anterior = $pesagem->data;
            $peso_anterior = $pesagem->peso;


            $estatisticas->peso_atual = $pesagem->peso;
            $estatisticas->data_ultima_pesagem = $pesagem->data;
            $estatisticas->dias_confinamento = Relatorios::diferencaEntreDatas($estatisticas->data_entrada, $estatisticas->data_ultima_pesagem);
            $peso_ganho = ($estatisticas->peso_atual - $estatisticas->peso_entrada);
            $estatisticas->peso_ganho = number_format($peso_ganho, 2, '.',',');

            $ganho_diario = ($estatisticas->peso_ganho / $estatisticas->dias_confinamento);
            $estatisticas->ganho_diario = number_format($ganho_diario, 3, '.',',');

            $estatisticas->classificacao = Pesagens::getClassificacaoMediaDia($estatisticas->ganho_diario);
            $estatisticas->cor_classificacao = Pesagens::getCorClassificacao($estatisticas->classificacao);

            $registros->datas[] = $pesagem->data;

            array_push($registros->pesagens, $registro);
        }
        $registros->estatisticas = $estatisticas;

        return $registros;
    }

    public function makeFilters($data){
        //var_dump($data);
        // -------------------------< FILTROS >------------------------- //
        // Confinamento Id
        if ($data->confinamento_id != null){
            $filtros[] = "confinamento_id = '{$data->confinamento_id}'";
        }
        // Status = a -1 nao filtra por status
        if ($data->status >= 0){
            $filtros[] = "status = '{$data->status}'";
        }
        // Fornecedor
        if ($data->fornecedor_id != 0){
            $filtros[] = "fornecedor_id = '{$data->fornecedor_id}'";
        }
        // Quadra
        if ($data->quadra_id != 0){
            $filtros[] = "quadra_id = '{$data->quadra_id}'";
        }
        // Compra
        if ($data->compra_id != 0){
            $filtros[] = "compra_id = '{$data->compra_id}'";
        }
        $sql = "WHERE ".implode(' AND ', $filtros);

        // Sexo
        if (($data->sexo == 'M') || ($data->sexo == 'F')){
            $filtros[] = "sexo = '{$data->sexo}'";
        }
        $sql = "WHERE ".implode(' AND ', $filtros);
        
        return $sql;
    }


    // -------------------------< HTML >------------------------- //

    public function makeReportHtml($result){
        $result = json_decode($result);
        $reportHtml = "";
        if ($result->compras){
            foreach($result->compras as $compra){
                //var_dump($compra);
                $reportHtml .= "<div class='group'>";
                $reportHtml .= Relatorios::makeTableCompra($compra);
                $reportHtml .= Relatorios::makeTableAnimais($compra);
                $reportHtml .= "</div>";
                $reportHtml .= "<br>";
                $reportHtml .= "<hr>";
            }
        }
        return $reportHtml;
    }
    public function makeTableCompra($compra){
    
        $data_compra = $this->dateBr($compra->data_compra);
        $ganho_diario = 
        //var_dump($compra->id);
        $table = "<br>";
        $table = "Compra ID = {$compra->compra_id}";
        $table .= "<div class='compra'>";
        // ======================< COMPRA >======================
        $table .= "<div class='table_compra'>";
        $table .=   "<table border=1>";
        $table .=     "  <tr>";
        $table .=     "    <td colspan=6>{$compra->fazenda} ({$compra->nome}) - ({$compra->municipio} - {$compra->uf})</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        //$table .=     "    <td class='td_label'>Data Compra:</td><td>{$compra->data_compra}</td>";
        $table .=     "    <td class='td_label'>Data Compra:</td><td>{$data_compra}</td>";
        $table .=     "    <td class='td_label'>Nota Fiscal:</td><td>{$compra->numero_nota}</td>";
        $table .=     "    <td class='td_label'>Serie Nota:</td><td>{$compra->numero_nota}</td>";
        $table .=     "  </tr>";
        $table .=   "</table>";
        $table .= "</div>";
        // ======================< COMPRA TOTAIS >======================
        $table .= "<br>";
        $table .= "<div class='table_estatisticas' style=\"display:table;\">";
        $table .= "<div class='table_compra_ativos' style=\"display:table-cell;\">";
        $table .=   "<table border=1>";
        $table .=     "<thead>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'></td>";
        $table .=     "    <td class='td_label'>Compra</td>";
        $table .=     "    <td class='td_label'>Ativos</td>";
        $table .=     "    <td class='td_label'>Transf</td>";
        $table .=     "    <td class='td_label'>Vendidos</td>";
        $table .=     "    <td class='td_label'>Morto</td>";
        $table .=     "  </tr>";
        $table .=     "</thead>";
        $table .=     "<tbody>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Machos:</td>";
        $table .=     "    <td>{$compra->qtd_machos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_transferidos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Femeas:</td>";
        $table .=     "    <td>{$compra->qtd_femeas}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_transferidos}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr class='row_total'>";
        $table .=     "    <td class='td_label'>Total:</td>";
        $table .=     "    <td>{$compra->quantidade}</td>";
        $table .=     "    <td>{$compra->qtd_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_transferidos}</td>";
        $table .=     "    <td>{$compra->qtd_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "</tbody>";
        $table .=   "</table>";
        $table .=   "</div>";
        // ======================< COMPRA PESOS >======================
        $table .= "<div class='table_compra_pesos' style=\"display:table-cell;padding-left:10px;\">";
        $table .=   "<table border=1>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Peso Total:</td>";
        $table .=     "    <td>{$compra->total_peso_atual}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Ganho/Dia:</td>";
        $table .=     "    <td style=\"background-color:{$compra->total_cor_classificacao}\">{$compra->total_media_ganho_diario}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Ganho Total:</td>";
        $table .=     "    <td>{$compra->total_ganho}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Ganho Médio:</td>";
        $table .=     "    <td>{$compra->total_media_ganho}</td>";
        $table .=     "  </tr>";
        $table .=   "</table>";
        $table .= "</div>";
        // ======================< COMPRA MEDIAS >======================
        $table .= "<div class='table_compra_medias' style=\"display:table-cell;padding-left:10px;\">";
        $table .=   "<table border=1>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Perm. Média:</td>";
        $table .=     "    <td>{$compra->total_dias_confinamento_medio}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Maior Peso:</td>";
        $table .=     "    <td>{$compra->total_peso_maior}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Peso Médio:</td>";
        $table .=     "    <td>{$compra->total_peso_medio}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Menor Peso:</td>";
        $table .=     "    <td>{$compra->total_peso_menor}</td>";
        $table .=     "  </tr>";
        $table .=   "</table>";
        $table .= "</div>";
        $table .= "</div>";
        $table .= "</div>";

        return $table;
    }

    public function makeTableAnimais($registro){
        //var_dump($registro);
        $animais = $registro->animais;
        $rows = '';
        foreach ($animais as $animal){
            //var_dump($animal);
            $row_background = "#FFF";
            $class = "row_animal";
            // Se for um animal Transferido
            if ($animal->confinamento_id != $registro->confinamento_id){ $row_background = "#FFFFD2";}

            // Se for um animal Morto
            if ($animal->status == 0){ $class = "row_animal_morto";}

            $estatisticas = $animal->pesagens->estatisticas;
            $pesagens = $animal->pesagens;

            // Convertendo Datas
            $data_ultima_pesagem = $this->dateBr($estatisticas->data_ultima_pesagem);
            $data_entrada = $this->dateBr($pesagens->entrada_data);

            //$row =     "  <tr class=\"$class\" style=\"background-color:$row_background\">";
            $row =     "  <tr class=\"tr_initial\" onMouseOver=\"this.className='tr_highlight'\" onMouseOut=\"this.className='tr_normal'\">";
            
            $row .=     "    <td>{$animal->codigo}</td><td>{$animal->sexo}</td>";
            $row .=     "    <td>{$animal->data_nascimento}</td>";
            $row .=     "    <td>{$animal->cod_caracteristica}</td>";
            $row .=     "    <td>{$animal->confinamento_id}</td>";
            $row .=     "    <td>{$animal->quadra}</td>";
            $row .=     "    <td>{$estatisticas->peso_atual}</td><td>{$data_ultima_pesagem}</td>";
            $row .=     "    <td>{$estatisticas->dias_confinamento}</td><td>{$estatisticas->peso_ganho}</td><td style=\"background-color:{$estatisticas->cor_classificacao}\">{$estatisticas->ganho_diario}</td>";
            $row .=     "    <td>{$pesagens->compra_peso}</td>";
            $row .=     "    <td>{$pesagens->entrada_peso}</td><td>{$data_entrada}</td>";
            // PARA CADA DATA DE PESAGEM
            foreach($registro->data_pesagens as $data_pesagem){
                // PARA CADA PESAGEM ADICIONAR UMA LINHA
                $flag = false;
                foreach($pesagens->pesagens as $pesagem){
                    if ($pesagem->data == $data_pesagem){
                        $row .=     "    <td>{$pesagem->data_intervalo}</td>";
                        $row .=     "    <td class='noBorder'>{$pesagem->peso}</td>";
                        $row .=     "    <td class='noBorder'>{$pesagem->ganho}</td>";
                        $row .=     "    <td  style=\"background-color:{$pesagem->cor_classificacao}\">{$pesagem->ganho_diario}</td>";

                        $flag = true;
                        break;
                    }
                }
                if (!$flag){
                    $row .=     "    <td></td>";
                    $row .=     "    <td class='noBorder'></td>";
                    $row .=     "    <td class='noBorder'></td>";
                    $row .=     "    <td></td>";
                }
            }


            $row .=     "  <tr>";
            $rows .= $row;
        }
        $table = "<br>";
        $table .= "<div class='animais'>";
        // ======================< Animais >======================
        $table .= "<div class='table_animais'>";
        $table .=   "<table>";
        $table .=     "<thead>";
        $table .=     "  <tr>";
        $table .=     "    <th colspan=2>Registro</th>";
        $table .=     "    <th>Data Nasc.</th>";
        $table .=     "    <th>Raça</th>";
        $table .=     "    <th>Conf.</th>";
        $table .=     "    <th>Quadra</th>";
        $table .=     "    <th colspan=2>Última Pesagem</th>";
        $table .=     "    <th colspan=3>Perm / Peso / Média</th>";
        $table .=     "    <th>Compra<br>{$pesagens->compra_data}</th>";
        $table .=     "    <th colspan=2>Entrada</th>";
        // PARA CADA PESAGEM ADICIONAR UMA COLUNA
        foreach($registro->data_pesagens as $data_pesagen){
            $data_pesagen = $this->dateBr($data_pesagen);
            $table .="    <th colspan=4>$data_pesagen</th>";
        }
        $table .=     "  <tr>";
        $table .=     "</thead>";
        $table .=     "<tbody>";
        $table .=     $rows;
        $table .=     "</tbody>";
        $table .=   "</table>";
        $table .= "</div>";
        $table .= "</div>";

        return $table;
    }


    public function codificacao($string) {
        return mb_detect_encoding($string.'x', 'UTF-8, ISO-8859-1');
    }

    /** diferencaEntreDatas($data_inicial, $data_final)
     * Recebe 2 datas no formato 'Y-m-d' '2012-10-25'
     * transforma em time stamp, faz a subtracao e transforma a diferenca em dias
     * @Return: retorna a quantidade de dias de diferenca
     * @param: $data_inicial
     * @param: $data_final
     */
    public function diferencaEntreDatas($data_inicial, $data_final){

        // Usa a função strtotime() e pega o timestamp das duas datas:
        $time_inicial = strtotime($data_inicial);
        $time_final = strtotime($data_final);

        // Calcula a diferença de segundos entre as duas datas:
        $diferenca = $time_final - $time_inicial; // 19522800 segundos

        // Calcula a diferença de dias
        $dias = (int)floor( $diferenca / (60 * 60 * 24)); // 225 dias

        return $dias;
    }

}
