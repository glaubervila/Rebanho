<?php
header('Content-Type: text/javascript; charset=UTF-8');
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
                        table, td, th
                        {
                            border:1px solid black;
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

//SELECT sexo, COUNT(*) as qtd_mortos  FROM animais WHERE compra_id = 18 and status = 0 GROUP BY sexo;
                // Para Cada Compra recuperar os animais
                $data->compra_id = $compra->id;
                $animais = Relatorios::getAnimais($data);

                $compra->animais = $animais;
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

        $sql = "SELECT * FROM vw_animais " ;
        $sql .= Relatorios::makeFilters($data);
        $sql .= " ORDER BY codigo ASC";
        #echo $sql;
        // Executar a Query
        $stm = $db->prepare($sql);
        $stm->execute();
        $animais = $stm->fetchAll(\PDO::FETCH_OBJ);

        $registros = array();
        // Para Cada Animal Recuperar os Pesos
        foreach($animais as $animal){
            $animal->pesagens = Relatorios::getPesagens($animal);
            array_push($registros, $animal);
        }

        return $registros;
//         var_dump($registros);
    }

    public function getPesagens($animal){
        $db = $this->getDb();

        $sql = "SELECT * FROM pesagens WHERE animal_id = {$animal->id}";
        $sql .= " ORDER BY data ASC";
        #echo $sql;
        // Executar a Query
        $stm = $db->prepare($sql);
        $stm->execute();
        $pesagens = $stm->fetchAll(\PDO::FETCH_OBJ);

        return $pesagens;
    }

    public function makeFilters($data){
        // -------------------------< FILTROS >------------------------- //
        // Confinamento Id
        $filtros[] = "WHERE confinamento_id = '{$data->confinamento_id}'";

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
        $sql = implode(' AND ', $filtros);

        return $sql;
    }
    
    
    // -------------------------< HTML >------------------------- //

    public function makeReportHtml($result){
        $result = json_decode($result);
        $reportHtml = "";
        if ($result->compras){
            foreach($result->compras as $compra){
                $reportHtml .= "<div class='group' style=\"border:3px solid #056894\">";
                $reportHtml .= Relatorios::makeTableCompra($compra);
                $reportHtml .= "</div>";
                $reportHtml .= "<br>";
                $reportHtml .= "<hr>";
            }
        }
        return $reportHtml;
    }
    public function makeTableCompra($compra){
        //var_dump($compra->id);
        $table = "<br>";
        $table .= "<div class='compra' style=\"border:3px solid #f5ec09\">";
        // ======================< COMPRA >======================
        $table .= "<div class='table_compra'>";
        $table .=   "<table border=1>";
        $table .=     "  <tr>";
        $table .=     "    <td colspan=6>{$compra->fazenda} ({$compra->nome}) - ({$compra->municipio} - {$compra->uf})</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Data Compra:</td><td>{$compra->data_compra}</td>";
        $table .=     "    <td class='td_label'>Nota Fiscal:</td><td>{$compra->numero_nota}</td>";
        $table .=     "    <td class='td_label'>Serie Nota:</td><td>{$compra->numero_nota}</td>";
        $table .=     "  </tr>";
        $table .=   "</table>";
        $table .= "</div>";
        // ======================< COMPRA TOTAIS >======================
        $table .= "<br>";
        $table .= "<div class='table_estatisticas' style=\"display:table;border:1px solid\" >";
        $table .= "<div class='table_compra_ativos' style=\"display:table-cell;border:1px solid #FF0000\">";
        $table .=   "<table border=1>";
        $table .=     "<thead>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'></td>";
        $table .=     "    <td class='td_label'>Compra</td>";
        $table .=     "    <td class='td_label'>Ativos</td>";
        $table .=     "    <td class='td_label'>Vendidos</td>";
        $table .=     "    <td class='td_label'>Morto</td>";
        $table .=     "  </tr>";
        $table .=     "</thead>";
        $table .=     "<tbody>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Machos:</td>";
        $table .=     "    <td>{$compra->qtd_machos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_machos_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Femeas:</td>";
        $table .=     "    <td>{$compra->qtd_femeas}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_femeas_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr class='row_total'>";
        $table .=     "    <td class='td_label'>Total:</td>";
        $table .=     "    <td>{$compra->quantidade}</td>";
        $table .=     "    <td>{$compra->qtd_ativos}</td>";
        $table .=     "    <td>{$compra->qtd_vendidos}</td>";
        $table .=     "    <td>{$compra->qtd_mortos}</td>";
        $table .=     "  </tr>";
        $table .=     "</tbody>";
        $table .=   "</table>";
        $table .=   "</div>";
        // ======================< COMPRA PESOS >======================
        $table .= "<div class='table_compra_pesos' style=\"display:table-cell;padding-left:10px;border:1px solid #00FF00\">";
        $table .=   "<table border=1>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Peso Total:</td>";
        $table .=     "    <td>#PESO_TOTAL</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Peso Medio:</td>";
        $table .=     "    <td>#PESO_MEDIO</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Ganho Total:</td>";
        $table .=     "    <td>#GANHO_TOTAL</td>";
        $table .=     "  </tr>";
        $table .=     "  <tr>";
        $table .=     "    <td class='td_label'>Ganho Médio:</td>";
        $table .=     "    <td>#GANHO_MEDIO</td>";
        $table .=     "  </tr>";
        $table .=   "</table>";
        $table .= "</div>";
        $table .= "</div>";
        $table .= "</div>";

        return $table;
    }

    public function codificacao($string) {
        return mb_detect_encoding($string.'x', 'UTF-8, ISO-8859-1');
    }
}
