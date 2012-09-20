<?php
header('Content-Type: text/javascript; charset=UTF-8');

class CompraAnimais extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "compras";

    public function insert($data) {

        $db = $this->getDb();

        $db->beginTransaction();

        $query = 'INSERT INTO compras (fornecedor_id, caracteristica_id, confinamento_id, data_compra, numero_nota, serie_nota, status, quantidade, valor_nota, data_pesagem, peso_entrada, peso_saida, classificacao, escore, idade, qtd_machos, qtd_femeas, corretor, valor_comissao, frete, valor_frete, imposto, valor_imposto, valor_arroba, premio, quadra_id) VALUES (:fornecedor_id, :caracteristica_id, :confinamento_id, :data_compra, :numero_nota, :serie_nota, :status, :quantidade, :valor_nota, :data_pesagem, :peso_entrada, :peso_saida, :classificacao, :escore, :idade, :qtd_machos, :qtd_femeas, :corretor, :valor_comissao, :frete, :valor_frete, :imposto, :valor_imposto, :valor_arroba, :premio, :quadra_id)';


        $stm = $db->prepare($query);

        // Convertendo Data
        $data_compra  = $this->DateToMysql($data->data_compra);
        $data_pesagem = $this->DateToMysql($data->data_pesagem);

        // Na criacao de Uma compra o Status e 1 - Aberta
        $status = 1;

        $stm->bindValue(':fornecedor_id', $data->fornecedor_id);
        $stm->bindValue(':caracteristica_id', $data->caracteristica_id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':data_compra', $data_compra);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':status', $status);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':data_pesagem', $data_pesagem);
        $stm->bindValue(':peso_entrada', $data->peso_entrada);
        $stm->bindValue(':peso_saida', $data->peso_saida);
        $stm->bindValue(':classificacao', $data->classificacao);
        $stm->bindValue(':escore', $data->escore);
        $stm->bindValue(':idade', $data->idade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':valor_comissao', $data->valor_comissao);
        $stm->bindValue(':frete', $data->frete);
        $stm->bindValue(':valor_frete', $data->valor_frete);
        $stm->bindValue(':imposto', $data->imposto);
        $stm->bindValue(':valor_imposto', $data->valor_imposto);
        $stm->bindValue(':valor_arroba', $data->valor_arroba);
        $stm->bindValue(':premio', $data->premio);
        $stm->bindValue(':quadra_id', $data->quadra_id);

        $stm->execute();

        $insert = $db->lastInsertId($query);

        $error = $stm->errorInfo();

        //var_dump($error);
        //var_dump($insert);

        if ($error[0] != 0 ){
            // desfaz operacoes realizadas durante a transacao
            $db->rollback();

            $this->ReturnJsonError($error);
        }
        else {

            $db->commit();
            $newData = $data;
            $newData->id = $insert;

            $this->ReturnJsonSuccess($msg,$data);
        }
    }

    public function update($data) {


        $db = $this->getDb();

        // Convertendo Data
        $data_compra  = $this->DateToMysql($data->data_compra);
        $data_pesagem = $this->DateToMysql($data->data_pesagem);

        $query = 'UPDATE compras set fornecedor_id = :fornecedor_id, caracteristica_id = :caracteristica_id, confinamento_id = :confinamento_id, data_compra = :data_compra, numero_nota = :numero_nota, serie_nota = :serie_nota, status = :status, quantidade = :quantidade, valor_nota = :valor_nota, data_pesagem = :data_pesagem, peso_entrada = :peso_entrada, peso_saida = :peso_saida, classificacao = :classificacao, escore = :escore, idade = :idade, qtd_machos = :qtd_machos, qtd_femeas =:qtd_femeas, corretor =:corretor, valor_comissao = :valor_comissao, frete =:frete, valor_frete =:valor_frete, imposto = :imposto, valor_imposto = :valor_imposto, valor_arroba = :valor_arroba, premio = :premio, quadra_id = :quadra_id WHERE id = :id';


        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':fornecedor_id', $data->fornecedor_id);
        $stm->bindValue(':caracteristica_id', $data->caracteristica_id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':data_compra', $data_compra);
        $stm->bindValue(':numero_nota', $data->numero_nota);
        $stm->bindValue(':serie_nota', $data->serie_nota);
        $stm->bindValue(':status', $data->status);
        $stm->bindValue(':quantidade', $data->quantidade);
        $stm->bindValue(':valor_nota', $data->valor_nota);
        $stm->bindValue(':data_pesagem', $data_pesagem);
        $stm->bindValue(':peso_entrada', $data->peso_entrada);
        $stm->bindValue(':peso_saida', $data->peso_saida);
        $stm->bindValue(':classificacao', $data->classificacao);
        $stm->bindValue(':escore', $data->escore);
        $stm->bindValue(':idade', $data->idade);
        $stm->bindValue(':qtd_machos', $data->qtd_machos);
        $stm->bindValue(':qtd_femeas', $data->qtd_femeas);
        $stm->bindValue(':corretor', $data->corretor);
        $stm->bindValue(':valor_comissao', $data->valor_comissao);
        $stm->bindValue(':frete', $data->frete);
        $stm->bindValue(':valor_frete', $data->valor_frete);
        $stm->bindValue(':imposto', $data->imposto);
        $stm->bindValue(':valor_imposto', $data->valor_imposto);
        $stm->bindValue(':valor_arroba', $data->valor_arroba);
        $stm->bindValue(':premio', $data->premio);
        $stm->bindValue(':quadra_id', $data->quadra_id);

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }


    public function load(){

        $data = $this->fetchAll();

        foreach ($data->data as $row){
            $record = $row;

            // Para Cada Registro Recuperar o Nome do Fornecedor e a Fazenda
            $fornecedor = $this->find($record->fornecedor_id, 'fornecedores');
            $record->fornecedor_nome    = $fornecedor->nome;
            $record->fornecedor_fazenda = $fornecedor->fazenda;

            // Para Cada Registro Recuperar o Nome do Confinamento
            $confinamento = $this->find($record->confinamento_id, 'confinamentos');
            $record->confinamento_nome  = $confinamento->confinamento;

            $record->status_nome  = $this->getStatusNome($record->status);

            $records[] = $record;
        }

        $data->data = $records;

        echo json_encode($data);
    }

    /** Metodo: updateStatus($status)
     * Este metodo troca o status de uma compra
     * @param:$status(int)
     *    1 - Aberta
     *    2 - Fechada
     *    3 - Cancelada
     *    4 - Aguardando Pesagem
     */
    public function updateStatus($compra_id, $status){

        $db = $this->getDb();

        $query = 'UPDATE compras set status = :status WHERE id = :id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $compra_id);
        $stm->bindValue(':status', $status);

        $update = $stm->execute();

        $result = new StdClass();

        if ($update) {
            $result->success = true;
        }
        else {
            $result->success = false;
            $result->msg = "Falha ao Trocar o Status!";
            $result->error = $stm->errorInfo();
        }

        return $result;

    }
    /** Metodo finalizaCompra()
     * Este metodo faz os calculos estatisticas para a compra
     * atualiza os campos com os valores de media
     * @param:{int}data = Request
     * @param:{float}peso_entrada = peso total dos animais na nota
     */
    public function finalizaCompra($data, $peso_entrada){

        $db = $this->getDb();

        $id = $data["nota_aberta"];
        $data_pesagem = $data["data_pesagem"];

        // Recuperar a Nota, Para fazer os calculos de estatisticas
        $compra = $this->find($id, 'compras');

        $qtd_animais = $compra->quantidade;
        $peso_saida  = $compra->peso_saida;
        $valor_compra = $compra->valor_nota;


        $peso_medio  = ($peso_entrada / $qtd_animais);
        $diferenca_total = ($peso_saida - $peso_entrada);
        $diferenca_media = (($peso_saida - $peso_entrada)/$qtd_animais);
        $valor_kg_vivo = ($valor_compra / $peso_saida);



        // Formatando
        $peso_medio = number_format($peso_medio, 3, '.',',');
        $diferenca_total = number_format($diferenca_total, 3, '.',',');
        $diferenca_media = number_format($diferenca_media, 3, '.',',');
        $valor_kg_vivo = number_format($valor_kg_vivo, 2, '.',',');

        $query = 'UPDATE compras set data_pesagem = :data_pesagem, peso_entrada = :peso_entrada, peso_medio = :peso_medio, valor_kg_vivo = :valor_kg_vivo, diferenca_total = :diferenca_total, diferenca_media = :diferenca_media WHERE id = :id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $id);
        $stm->bindValue(':data_pesagem', $data_pesagem);
        $stm->bindValue(':peso_entrada', $peso_entrada);
        $stm->bindValue(':peso_medio', $peso_medio);
        $stm->bindValue(':valor_kg_vivo', $valor_kg_vivo);
        $stm->bindValue(':diferenca_total', $diferenca_total);
        $stm->bindValue(':diferenca_media', $diferenca_media);


        $update = $stm->execute();

        $result = new StdClass();

        if ($update) {
            $result->success = true;
            $result->msg = "Compra de Animais Encerrada com Sucesso!";
        }
        else {
            $result->success = false;
            $result->msg = "Falha ao Finalizar a Compra de Animais!";
            $result->error = $stm->errorInfo();
        }

        return $result;
    }

    /** Metodo: getStatusNome()
     * Retorna o Nome de um Status
     * @param:{int}status = Chave do Status
     * @return:{string}status_nome =  Nome do Status
     *  Status da Nota
     *  1 - Aberta
     *  2 - Fechada
     *  3 - Cancelada
     *  4 - Aguardando Pesagem
     */
    public function getStatusNome($status){

        $aStatus = array();
        $aStatus[1] = "Aberta";
        $aStatus[2] = "Fechada";
        $aStatus[3] = "Cancelada";
        $aStatus[4] = "Aguardando Pesagem";

        return $aStatus[$status];
    }


    /** Metodo: delete($data)
     * Este metodo so exclui um registro por vez
     * Verifica o Status da Nota, se estiver Fechada = 2 NAO EXCLUI
     * Se estiver em outro status exclui mas usando as regras do banco
     * exclui todos os animais relacionados a compra
     * exclui todos as ocorrencias dos animais relacionados a compra
     * exclui todas as pesagens dos animais relacionados a compra
     * exclui todos os codigos dos animais relacionados a compra
     * @param:$data = Objeto CompraAnimais
     */
    public function delete($data){

        $result = new StdClass();

        $db = $this->getDb();

        $compra_id = $data->id;

        if ($data->status == 2) {

            $msg = "Está Nota <font color= 'red'>NÃO</font> pode ser excluída por que já esta fechada!<br> Somente notas que ainda não foram finalizadas podem ser excluidas.";

            $result->failure = true;
            $result->message = $msg;

            return $result;
        }
        else {
            // Recuperar todos os id de animais da compra
            $ids_animais = $this->filter('id', 'animais', "compra_id = {$compra_id}");
            foreach ($ids_animais as $id_animal){
                $str_ids[] = $id_animal->id;
            }
            $str_ids = implode(', ', $str_ids);

            // Iniciando uma Transacao
            $db->beginTransaction();

            $query1 = "DELETE FROM animais WHERE animal_id IN ($str_ids);";
            $stm = $db->prepare($query1);
            $stm->execute();

            $query2 = "DELETE FROM compras WHERE id = {$compra_id};";
            $stm = $db->prepare($query2);
            $stm->execute();

            $error = $stm->errorInfo();

            // Se tiver Dado Erro ao Excluir os Animais
            if ($error[0] != 0){

                // desfaz operacoes realizadas durante a transacao
                $db->rollback();

                $codigo = $error[1];
                $erro   = $error[2];

                $msg = "Desculpe mas houve uma falha,<br> e <font color=\"red\"><b>Não</b></font> foi possivel <font color=\"red\"><b>Excluir</b></font> o(s) Registros(s). <br> Se o problema persistir entre em contato com o administrador do sistema e informe a mensagem abaixo.<br>Código: $codigo  <br>Mensagem: $erro.";

                $result->failure = true;
                $result->message = $msg;

            }
            else {

                $db->commit();

                $result->success = true;
                $result->message = "Nota de Compra Excluida com <font color='green'>Sucesso</font>!<br>Obs: Todos os registros referentes aos animais da compra foram excluidos.";

            }
            return $result;
        }
    }



}


