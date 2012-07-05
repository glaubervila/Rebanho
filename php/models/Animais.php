<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: Animais
 *  @date: 2012-07-01
 */

class Animais extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "";


    /** Metodo: CadastroAnimais
     * @PARAM:$animais - array de objetos animais
     * esse metodo recebe um array de animais,
     * insere um a um criando seus codigos,
     * fazendo lancamento de ocorrencia de entrada,
     * se houver falha eu um dos registros retorna falha e nao grava nenhum
     * Usado para dar entrada em um grupo de animais
     */
    public function CadastroAnimais($animais) {

        $db = $this->getDb();

        // Usar Transacao
        $db->beginTransaction();

        // Recuperar o Ultimo id
        $ultimo_id = $this->getAt('MAX(id) as id', null, 'animais');
        $next_id = ($ultimo_id->id + 1);

        $ultimo_codigo = $this->getAt('MAX(id) as id', null, 'animais_codigos');
        $next_codigo = ($ultimo_codigo->id + 1);

        $ultima_ocorrencia = $this->getAt('MAX(id) as id', null, 'ocorrencias');
        $next_ocorrencia = ($ultima_ocorrencia->id + 1);

        // Para Cada Animal fazer o Insert
        foreach ($animais as $animal) {

            $query = 'INSERT INTO animais (id, confinamento_id, quadra_id, compra_id, fornecedor_id, caracteristica_id, sisbov, sexo, idade, classificacao, escore, status) VALUES (:id, :confinamento_id, :quadra_id, :compra_id, :fornecedor_id, :caracteristica_id, :sisbov, :sexo, :idade, :classificacao, :escore, :status)';

            $stm = $db->prepare($query);
            $stm->bindValue(':id', $next_id);
            $stm->bindValue(':confinamento_id', $animal->confinamento_id);
            $stm->bindValue(':quadra_id', $animal->quadra_id);
            $stm->bindValue(':compra_id', $animal->compra_id);
            $stm->bindValue(':fornecedor_id', $animal->fornecedor_id);
            $stm->bindValue(':caracteristica_id', $animal->caracteristica_id);
            $stm->bindValue(':sisbov', $animal->sisbov);
            $stm->bindValue(':sexo', $animal->sexo);
            $stm->bindValue(':idade', $animal->idade);
            $stm->bindValue(':classificacao', $animal->classificacao);
            $stm->bindValue(':escore', $animal->escore);
            $stm->bindValue(':status', 1);

            $stm->execute();

            $idAnimal = $db->lastInsertId($query);

            $error = $stm->errorInfo();

            // Se tiver Erro Para Tudo
            if ($error[0] != 0 ){
                break;
            }

            // Cadastro dos Codigos

            if ($animal->codigos){
                foreach ($animal->codigos as $codigo){

                    // Query de Insert dos Codigos
                    $query_codigos = "INSERT INTO rebanho.animais_codigos (id, confinamento_id, animal_id, codigo, tipo, data) VALUES (:id, :confinamento_id, :animal_id, :codigo, :tipo, :data);";

                    $stm = $db->prepare($query_codigos);

                    // Setando Valores Codigos
                    $stm->bindValue(':id', $next_codigo);
                    $stm->bindValue(':confinamento_id', $codigo->confinamento_id);
                    $stm->bindValue(':animal_id', $idAnimal);
                    $stm->bindValue(':codigo', $codigo->codigo);
                    $stm->bindValue(':tipo', $codigo->tipo);
                    $stm->bindValue(':data', $codigo->data);

                    $stm->execute();

                    $error = $stm->errorInfo();

                    // Se tiver Erro Para Tudo
                    if ($error[0] != 0 ){
                        break;
                    }
                }
            }

            // Lancamento de Ocorrencia de Entrada

            if ($idAnimal){

                $confinamento = $this->findBy('id', $animal->confinamento_id, 'confinamentos');

                $descricao = "Entrada - {$confinamento->confinamento}";

                $query_ocorrencia = "INSERT INTO rebanho.ocorrencias (id, confinamento_id, quadra_id, animal_id, ocorrencia, descricao, data) VALUES (:id, :confinamento_id, :quadra_id, :animal_id, :ocorrencia, :descricao, :data);";

                $stm = $db->prepare($query_ocorrencia);

                $stm->bindValue(':id', $next_ocorrencia);
                $stm->bindValue(':confinamento_id', $animal->confinamento_id);
                $stm->bindValue(':quadra_id', $animal->quadra_id);
                $stm->bindValue(':animal_id', $idAnimal);
                $stm->bindValue(':ocorrencia', 'Entrada');
                $stm->bindValue(':descricao', $descricao);
                $stm->bindValue(':data', date('Y-m-d'));

                $stm->execute();

                $error = $stm->errorInfo();

                // Se tiver Erro Para Tudo
                if ($error[0] != 0 ){
                    break;
                }
            }

            // incremento do Ultimo Id
            $next_id++;
            $next_codigo++;
            $next_ocorrencia++;
        }

        $result = new StdClass();

        if ($error[0] != 0 ){

            $db->rollback();

            $result->success = false;
            $result->error = $error;
        }
        else {

            $db->commit();
            $result->success = true;
        }

        return $result;
    }


    /** Metodo:getCodigosById
     * @PARAM:$animal_id - Chave do Animal
     * @PARAM:$confinamento_id - Codigo do Confinamento
     * Recebe uma chave de animal e retorna todos os codigos,
     * se tiver confinamento_id so retorna o codigo para aquele confinamento
     */
    public function getCodigosById($animal_id, $confinamento_id){

        // Se Houver o Parametro confinamento_id retornar so o codigo para aquele confinamento
        if ($confinamento_id){

            $sql = "SELECT * FROM animais_codigos WHERE animal_id = {$animal_id} AND confinamento_id = {$confinamento_id}";

        }
        else {
        // Retornar Todos os Codigos para o animal
        }

        $db = $this->getDb();
        $stm = $db->prepare($sql);
        $stm->execute();
        return $stm->fetchAll(\PDO::FETCH_OBJ);
    }


}