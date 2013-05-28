<?php
ini_set('memory_limit', '128M');
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Transferencias
 *  @date: 2012-10-10
 */

/** Status da Transferencias
 * 0 - Saida
 * 1 - Transito
 * 2 - Entrada
 * 3 - Concluida
 */

class Transferencias extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "transferencias";


    public function insert($data, $json = true) {

        //var_dump($data);

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO transferencias (status, origem, destino, quantidade, machos, femeas, data_saida, data_entrada, animais) VALUES (:status, :origem, :destino, :quantidade, :machos, :femeas, :data_saida, :data_entrada, :animais)';

        $stm = $db->prepare($query);

        // Convertendo Data
        $data_saida   = $this->DateToMysql($data->data_saida);
        $data_entrada = $this->DateToMysql($data->data_entrada);

        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':origem', $data->origem);
        $stm->bindValue(':destino', $data->destino);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':machos', $data->machos);
        $stm->bindValue(':femeas', $data->femeas);
        $stm->bindValue(':data_saida', $data_saida);
        $stm->bindValue(':data_entrada', $data_entrada);
        $stm->bindValue(':animais', $data->animais);


        $stm->execute();

        $insert = $db->lastInsertId($query);

        $error = $stm->errorInfo();

        if ($error[0] != 0 ){
            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $result->failure = true;
            $result->msg = "Falha ao Alterar o Registro de Transferencia!";
            $result->error = $stm->errorInfo();
        }
        else {

            $db->commit();
            $newData = $data;
            $newData->id = $insert;

            $result->success = true;
            $result->data = $newData;
            $result->msg = "Registro Criado com Sucesso!";

        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }

    public function update($data, $json = true){

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'UPDATE `transferencias` SET `status` = :status, `origem` = :origem, `destino` = :destino, `quantidade` = :quantidade, `machos` = :machos, `femeas` = :femeas, `data_saida` = :data_saida, `data_entrada` = :data_entrada, `animais` = :animais, `quadra_id` = :quadra_id WHERE id = :id;';

        $stm = $db->prepare($query);

        // Convertendo Data
        $data_saida   = $this->DateToMysql($data->data_saida);
        $data_entrada = $this->DateToMysql($data->data_entrada);

        $stm->bindValue(':id', $data->id);

        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':origem', $data->origem);
        $stm->bindValue(':destino', $data->destino);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':machos', $data->machos);
        $stm->bindValue(':femeas', $data->femeas);
        $stm->bindValue(':data_saida', $data_saida);
        $stm->bindValue(':data_entrada', $data_entrada);
        $stm->bindValue(':animais', $data->animais);
        $stm->bindValue(':quadra_id', $data->quadra_id);

        $update = $stm->execute();


        // Alterar o Confinamento dos Animais na Transferencia
        $aAnimais = explode(';', $data->animais);

        foreach ($aAnimais as $animal_id ){

            $query = "UPDATE animais SET confinamento_id = {$data->destino}, quadra_id = {$data->quadra_id} WHERE id = {$animal_id};";

            $stm = $db->prepare($query);

            $stm->execute();
        }


        $result = new StdClass();

        $error = $stm->errorInfo();

        // Se tiver Dado Erro
        if ($error[0] != 0){

            $db->rollback();

            $result->failure = true;
            $result->msg = "Falha ao Alterar o Registro de Transferencia!";
            $result->error = $stm->errorInfo();

        }
        else {

            $db->commit();

            $result->success = true;
            $result->data = $data;
            $result->msg = "Registro Alterado com Sucesso!";

        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    /** getAnimal($data)
     * Metodo usado para retornar um obj animal no formato do model de transferencia
     * para a grid de pesagen de saida
     * executa o metodo de localizar animal pelo codigo na classe animal,
     * cria um novo obj no formato do model de transferenciaAnimal
     */ 
    public function getAnimal($data, $json = true){

        $animal = Animais::getAnimalResumido(false, $data['codigo'], $data['origem'], false);

        if ($json){
            echo json_encode($animal);
        }
        else {
            return $animal;
        }
    }


    public function insertAnimaisTransferencia($data, $json = true){

        $result = new StdClass();

        // Se na tiver nenhum animal
        if (!$data[0]){
            $result->failure = true;
            $result->msg = "Nenhum animal a ser Trasferido";
        }
        else {
            //converter a data de saida
            $data_saida = $this->DateToMysql($data[0]->data_saida);

            $origem  = $data[0]->origem;
            $destino = $data[0]->destino;
            $origem_nome  = Confinamentos::getNome($origem);
            $destino_nome = Confinamentos::getNome($destino);

            $erros = array();

            // Array dos animais na transferencia
            $animais_id = array();

            // Para Cada Registro de Animal a ser Transferido
            foreach ($data as $animal){

                // Atributos Facilitadores.
                $animal->animal_id    = $animal->id;
                $animal->data_saida   = $data_saida;
                $animal->data         = $data_saida;
                $animal->origem_nome  = $origem_nome;
                $animal->destino_nome = $destino_nome;

                // Controle de Erro
                $erro = new StdClass();

                // Criar a Pesagem de Saida
                $pesagem = Pesagens::criarPesagemSaida($animal, false);

                if ($pesagem->success){

                    $ocorrencia = Ocorrencias::criarOcorrenciaTransferencia($animal, false);

                    if (!$ocorrencia->success){
                        // Se der erro na Ocorrencia
                        $erro->animal_id = $animal_id;
                        $erro->msg = $ocorrencia->msg;
                    }

                    $animais_id[] = $animal->animal_id;
                }
                else {
                    // Se der erro na Pesagem
                    $erro->animal_id = $animal_id;
                    $erro->msg = $pesagem->msg;
                }

                // Se tiver erro adiciona no array de erro para tratamento
                if ($erro->animal_id) {
                    $erros[] = $erro;
                }
            }

            // Se tiver tido algum erro tratar aki
            if (count($erros) > 0){

            }
            else {
                $result->success = true;
                $result->msg = "Todos os animais foram salvos com Sucesso";
                $result->data = implode(';', $animais_id);
            }
        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }

    public function load(){

        $data = $this->fetchAll();

        foreach ($data->data as $row){
            $record = $row;

            // Para Cada Registro Recuperar o Nome do Confinamento de origem e destino
            $record->origem_nome  = Confinamentos::getNome($record->origem);
            $record->destino_nome  = Confinamentos::getNome($record->destino);

            $record->status_nome  = $this->getStatusNome($record->status);

            $records[] = $record;
        }

        $data->data = $records;

        echo json_encode($data);
    }

    public function getstatusNome($id){

        $status = array();

        $status[0] = "Saida";
        $status[1] = "Transito";
        $status[2] = "Entrada";
        $status[3] = "Concluida";

        return $status[$id];
    }

    public function getAnimaisTransferencia($data, $json = true){

        $result = new StdClass();


        $transferencia_id = $data['transferencia_id'];

        // Recuperar a transferencia
        $transferencia = $this->filter(null, 'transferencias', "id = {$transferencia_id}", null, false);

        $transferencia = $transferencia[0];

        if ($transferencia) {

            // Transformar o campo animais em um array
            $animais_id = explode(';', $transferencia->animais);

            // Para Cada Animal retornar o animalResumido
            $animais = array();
            foreach ($animais_id as $id) {
                $animal = Animais::getAnimalResumido($id, false, false, false);
                $animal = $animal->animal;

                // Recuperando o Codigo do animal na Origem
                $codigos = Animais::getCodigosById($animal->id, $transferencia->origem);
                $animal->codigo_antigo = $codigos[0]->codigo;

                // Se a transferencia for estiver com status de entrada recuperar o peso
                if ($transferencia->status > 1) {
                    $peso_entrada = Pesagens::getPesagemEntrada($animal->id, $animal->confinamento_id);
                    $animal->peso = $peso_entrada->peso;
                }

                //var_dump($animal);
                $animais[] = $animal;
            }

            if($animais[0]){
                // Se tiver Animais Retorno de Sucesso
                $result->success = true;
                $result->transferencia_id = $transferencia_id;
                $result->data = $animais;
            }

        }
        else {
            // Retornar erro pq na encontrou a transferencia
        }


        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }
    }


    public function entradaAnimais($data,$json = true){

        //var_dump($data);

        $result = new StdClass();

        //converter a data de entrada
        $data_entrada = $this->DateToMysql($data[0]->data_entrada);

        $origem  = $data[0]->origem;
        $destino = $data[0]->destino;
        $transferencia_id = $data[0]->transferencia_id;
        $origem_nome  = Confinamentos::getNome($origem);
        $destino_nome = Confinamentos::getNome($destino);


        foreach ($data as $animal){

            // Controle de Erro
            $erro = new StdClass();

            $animal->data_entrada = $data_entrada;
            $animal->peso_entrada = $animal->peso;

            // Criar a Pesagem de Entrada

            $pesagem = Pesagens::criarPesagemEntrada($animal, false);

            if ($pesagem->success){

                // Criar Ocorrencia de Entrada no Confinamento
                $descricao = "Entrada - {$destino_nome}";

                $objOcorrencia->confinamento_id = $animal->confinamento_id;
                $objOcorrencia->animal_id = $animal->id;
                $objOcorrencia->tipo = 1;
                $objOcorrencia->ocorrencia = 'Entrada';
                $objOcorrencia->quadra_id = $animal->quadra_id;
                $objOcorrencia->descricao = $descricao;
                $objOcorrencia->data = $data_entrada;

                $ocorrencia = Ocorrencias::insert($objOcorrencia, false);

                if (!$ocorrencia->success){
                    // Se der erro na Ocorrencia
                    $erro->animal_id = $animal->id;
                    $erro->msg = $ocorrencia->msg;
                }
                else {
                    // Cadastrar o Codigo

                    $codigo = Animais::criarCodigoSisbov($animal, $animal->codigo, false);

                    if (!$codigo->success){
                        // Se der erro na Ocorrencia
                        $erro->animal_id = $animal->id;
                        $erro->msg = $codigo->msg;
                    }
                }
            }
            else {
                // Se der erro na Pesagem
                $erro->animal_id = $animal_id;
                $erro->msg = $pesagem->msg;
            }

            // Se tiver erro adiciona no array de erro para tratamento
            if ($erro->animal_id) {
                $erros[] = $erro;
            }
        }
        // Se tiver tido algum erro tratar aki
        if (count($erros) > 0){
            foreach ($erros as $erro) {
                $msgs[] = $erro->msg;
            }
            $result->failure = true;
            $result->msg = implode('<br>',$msgs);
            $result->data = $data;
            $result->transferencia_id = $transferencia_id;

        }
        else {
            $result->success = true;
            $result->msg = "Todos os animais foram salvos com Sucesso";
            $result->evento = 'entrada';
            $result->data = $data;
        }

        if ($json){
            echo json_encode($result);
        }
        else {
            return $result;
        }

    }


    public function destroy($data){

        if ($data){

            // Se tiver animais na Transferencia Desfazer as Ocorrencias, Pesagens e a troca de confinamento
            if ($data->animais) {
                echo "{failure:'true'}";
            }
            else{
                // Se nao tiver animas somente excluir o registro
                $result = $this->delete($data);
            }

            $this->ReturnJson($result);
        }

    }


    public function getTransferenciasResumidoReport($data){


        // Primeiro Passo Montar o Filtro
        // 1 Filtro - Confinamento pelo confinamento e tipo

        // Se for um relatorio de entrada resumido
        if (($data->tipo_relatorio == 0)||($data->tipo_relatorio == 1)){

            // Entao o Confinamento selecionado e a ORIGEM
            $filtros[] = "destino = {$data->confinamento_id}";

            // Seto o Campo de data do where como data_saida
            $campo_data = 'data_entrada';

        }

        // Se for um relatorio de saida resumido
        else if (($data->tipo_relatorio == 2)||($data->tipo_relatorio == 3)){

            // Entao o Confinamento selecionado e a ORIGEM
            $filtros[] = "origem = {$data->confinamento_id}";

            // Seto o Campo de data do where como data_saida
            $campo_data = 'data_saida';
        }

        // 2 Filtro - Periodo pela data da pesagem
        if ((!empty($data->data_inicial)) || ($data->data_inicial != null)){
            // Tem data Inicial Verificar se tem tambem a data final
            if ((!empty($data->data_final)) || ($data->data_final != null)){
                // Tem data Inicial e Data Final  pesquisar pelo periodo
                $filtros[] = "$campo_data BETWEEN '{$data->data_inicial}' AND '{$data->data_final}'";
            }
            else {
                // Tem data Inicial e NAO TEM Data Final - Pesquisar apartir de";
                $filtros[] = "$campo_data >= '{$data->data_inicial}'";
            }
        }
        else {
            // Nao tem data inicial
            // Verificar se tem data Final
            if ((!empty($data->data_final)) || ($data->data_final != null)){
                //Tem somente data final pesquisar pela data igual a data final
                $filtros[] = "$campo_data = '{$data->data_final}'";
            }
            else {
                // Nao tem nem data de entrada nem de saida
            }
        }


        $filter .= implode(' AND ', $filtros);
        
        //echo $filter;
        $transferencias = $this->filter(null, 'transferencias', "$filter", null, false);

        //var_dump($transferencias);

        foreach ($transferencias as $row){
            $record = $row;

            // Para Cada Registro Recuperar o Nome do Confinamento de origem e destino
            $record->origem_nome   = Confinamentos::getNome($record->origem);
            $record->destino_nome  = Confinamentos::getNome($record->destino);

            $record->status_nome  = Transferencias::getStatusNome($record->status);

            // Para Cada Transferencia saber as estatisticas
            $estatisticas = Transferencias::getEstatisticas($record);
            // Estatisticas de Entrada
            $record->entrada_peso_total = number_format($estatisticas->entrada->peso_total, 2, '.','.');
            $record->entrada_maior_peso = number_format($estatisticas->entrada->maior_peso, 2, '.','.');
            $record->entrada_menor_peso = number_format($estatisticas->entrada->menor_peso, 2, '.','.');
            $record->entrada_peso_medio = number_format($estatisticas->entrada->peso_medio, 2, '.','.');


            // Estatisticas de saida
            $record->saida_peso_total = number_format($estatisticas->saida->peso_total, 2, '.','.');
            $record->saida_maior_peso = number_format($estatisticas->saida->maior_peso, 2, '.','.');
            $record->saida_menor_peso = number_format($estatisticas->saida->menor_peso, 2, '.','.');
            $record->saida_peso_medio = number_format($estatisticas->saida->peso_medio, 2, '.','.');


            $records[] = $record;
            $record = null;
        }

        $return = new StdClass();

        if (count($records) > 0){

            $return->success = true;
            $return->data = $records;
        }
        else {
            $return->failure = true;
            $return->msg = "Desculpe mas Nenhum resultado Foi Encontrado!";
        }

        return $return;
    }


    public function getTransferenciasReport($data){

        // Primeiro Passo Recuperar os Transferencias Resumido

        $resumos = Transferencias::getTransferenciasResumidoReport($data);

        if ($resumos->success){

            $transferencias = $resumos->data;

            foreach ($transferencias as $row){

                $record = $row;

                // Separar os ids dos animais
                $animais_id = str_replace(';', ', ',$row->animais);

                $aIds = explode(', ', $animais_id);

                $permanencias = array();
                $ganhos_media = array();
                $ganhos       = array();
                $entradas     = array();

                foreach ($aIds as $id){
                    //$animal = new StdClass();

                    $animal_id = $id;
                    $origem = $row->origem;
                    $destino = $row->destino;

                    $animal = Transferencias::getInfoAnimal($animal_id, $origem, $destino);

                    array_push($permanencias,$animal->origem_dias_confinado);
                    array_push($ganhos_media,$animal->origem_ganho_medio);
                    array_push($ganhos,$animal->origem_ganho);
                    array_push($entradas,$animal->origem_peso_entrada);

                    $record->a_animais[] = $animal;

                }
                // Totais adicionais 

                $media_permanencia = array_sum($permanencias)/count($permanencias);
                $media_permanencia = (int)$media_permanencia;

                $ganho_medio_media = array_sum($ganhos_media)/count($ganhos_media);
                $ganho_medio_media = number_format($ganho_medio_media, 2, '.','.');
                
                $ganho_total = array_sum($ganhos);
                $ganho_total = number_format($ganho_total, 2, '.','.');

                $ganho_total_media = array_sum($ganhos)/count($ganhos);
                $ganho_total_media = number_format($ganho_total_media, 2, '.','.');
                
                $entradas_total = array_sum($entradas);
                $entradas_total = number_format($entradas_total, 2, '.','.');
                
                $entradas_total_media = array_sum($entradas)/count($entradas);
                $entradas_total_media = number_format($entradas_total_media, 2, '.','.');
                
                // Linhas de Totais
                // SOMA
                $row_total = new StdClass();
                $row_total->ROW_STYLE = 'totais';
                $row_total->LINENUNBER = FALSE;
                // Label da Row Soma
                $row_total->origem_codigo = 'Soma:';
                // Soma dos pesos de entrada
                $row_total->origem_peso_entrada = $entradas_total;
                // Soma dos pesos de Saida
                $row_total->origem_peso_saida = $row->saida_peso_total;
                // Soma ganho total
                $row_total->origem_ganho = $ganho_total;

                // MEDIA
                $row_media = new StdClass();
                $row_media->ROW_STYLE = 'totais';
                $row_media->LINENUNBER = FALSE;
                // Label da Row Media
                $row_media->origem_codigo = 'Média:';
                // Media dos pesos de entrada
                $row_media->origem_peso_entrada = $entradas_total_media;
                // Media dos pesos de Saida
                $row_media->origem_peso_saida = $row->saida_peso_medio;
                // Media ganho medio
                $row_media->origem_ganho_medio = $ganho_medio_media;
                // Media ganho total
                $row_media->origem_ganho = $ganho_total_media;
                // Media da Permanencia
                $row_media->origem_dias_confinado = $media_permanencia;

                array_push($record->a_animais,$row_total);
                array_push($record->a_animais,$row_media);


                // Acrescentar a permanencia media na transferencia
                $row->permanencia_media = $media_permanencia;
                // Acrescentar a ganho_medio media na transferencia
                $row->ganho_medio_media = $ganho_medio_media;
                // Acrescentar a ganho_total na transferencia
                $row->ganho_total = $ganho_total;
                // Acrescentar a ganho_total media na transferencia
                $row->ganho_total_media = $ganho_total_media;

                $records[] = $record;
            }
            //var_dump($records);
        }
        else {
            return $resumos;
        }
        //var_dump($records);
        $return = new StdClass();

        if (count($records) > 0){

            $return->success = true;
            $return->data = $records;
        }
        else {
            $return->failure = true;
            $return->msg = "Desculpe mas Nenhum resultado Foi Encontrado!";
        }

        return $return;
    }




    public function getEstatisticas($transferencia){
        $estatisticas = new StdClass();

        // Pegar os animais_id e trocar ; por ,
        $animais_id = str_replace(';', ', ',$transferencia->animais);

        // Fazer uma query para estatisticas de entrada
        $cols =   "SUM(peso) as peso_total, MAX(peso) as maior_peso, MIN(peso) as menor_peso, COUNT(*) as total_animais, (SUM(peso)/COUNT(*)) as peso_medio";

        $filtros[] = "confinamento_id = '{$transferencia->destino}'";
        $filtros[] = "data = '{$transferencia->data_entrada}'";
        $filtros[] = "tipo = 1"; // tipo de pesagem de entrada
        $filtros[] = "animal_id IN ({$animais_id})";

        $filter = implode(' AND ', $filtros);

        $result_entrada = $this->filter($cols, 'pesagens', "$filter", null, false);


        // Fazer query para estatisticas de saida
        $cols =   "SUM(peso) as peso_total, MAX(peso) as maior_peso, MIN(peso) as menor_peso,     COUNT(*) as total_animais, (SUM(peso)/COUNT(*)) as peso_medio";

        $filtros = null;
        $filtros[] = "confinamento_id = '{$transferencia->origem}'";
        $filtros[] = "data = '{$transferencia->data_saida}'";
        $filtros[] = "tipo = 4";
        $filtros[] = "animal_id IN ({$animais_id})";

        $filter = implode(' AND ', $filtros);

        $result_saida = $this->filter($cols, 'pesagens', "$filter", null, false);

        $estatisticas->entrada = $result_entrada[0];
        $estatisticas->saida   = $result_saida[0];

        return $estatisticas;
    }

    public function getInfoAnimal($animal_id, $origem, $destino){

        $animal = Animais::getInfoAnimal($animal_id);

        // Codigo na Origem
        $animal->origem_codigo = $animal->dados_confinamento[$origem]->codigo;
        // Data Entrada Origem
        $animal->origem_data_entrada = $animal->dados_confinamento[$origem]->data_entrada;
        // Peso Entrada Origem
        $animal->origem_peso_entrada = $animal->dados_confinamento[$origem]->peso_entrada;
        // Peso Saida Origem
        $animal->origem_data_saida = $animal->dados_confinamento[$origem]->data_saida;
        // Peso Saida Origem
        $animal->origem_peso_saida = $animal->dados_confinamento[$origem]->peso_saida;
        // Dias Confinado
        $animal->origem_dias_confinado = $animal->dados_confinamento[$origem]->dias_confinado;
        // Ganho Total
        $animal->origem_ganho = $animal->dados_confinamento[$origem]->ganho;
        // Ganho Medio
        $animal->origem_ganho_medio = $animal->dados_confinamento[$origem]->ganho_medio;
        // Cor Classificacao
        $animal->origem_corClassificacao = $animal->dados_confinamento[$origem]->corClassificacao;



        // Codigo no Destino
        $animal->destino_codigo = $animal->dados_confinamento[$destino]->codigo;
        // Codigo no Destino
        $animal->destino_data_entrada = $animal->dados_confinamento[$destino]->data_entrada;
        // Peso Entrada Destino
        $animal->destino_peso_entrada = $animal->dados_confinamento[$destino]->peso_entrada;
        // Peso Saida Destino
        $animal->destino_peso_saida = $animal->dados_confinamento[$destino]->peso_saida;
        // Dias Confinado
        $animal->destino_dias_confinado = $animal->dados_confinamento[$destino]->dias_confinado;
        // Ganho Total
        $animal->destino_ganho = $animal->dados_confinamento[$destino]->ganho;
        // Ganho Medio
        $animal->destino_ganho_medio = $animal->dados_confinamento[$destino]->ganho_medio;
        // Cor Classificacao
        $animal->destino_corClassificacao = $animal->dados_confinamento[$destino]->corClassificacao;



        return $animal;
    }

}
