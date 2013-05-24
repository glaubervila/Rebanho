<?php

header('Content-Type: text/javascript; charset=UTF-8');

class Nascimentos extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "ocorrencias";


    public function insert($data, $json = true){


        //var_dump($data);

        $return = new StdClass();

        // Verificar os campos obrigatorios
        if (($data->confinamento_id != 0) && ($data->caracteristica_id) && ($data->data_nascimento) && ($data->codigo_mae != 0) && ($data->codigo != 0) && ($data->sexo)){

            // Converter a Data
            $data->data_nascimento  = $this->DateToMysql($data->data_nascimento);


            // Verificar se o Codigo está disponivel
            $codigo = $this->findBy(array('codigo'), array($data->codigo), 'animais_codigos');

            //var_dump($codigo);
            if ($codigo){
                $return->failure = true;
                $return->msg = "Verifique o Código.</br> Este código: <font color='blue'>{$data->codigo}</font> já está em uso";
            }
            else {

                // Verificar se a Mae é valido
                $objMae = Animais::getMae($data->codigo_mae);

                if ($objMae){

                    // Atribuindo o ID da Mae
                    $data->mae_id = $objMae->animal_id;

                    if ($data->pai_id) {
                        // Verificar se o Pai é valido
                        $objPai = Animais::getPai($data->codigo_pai);

                        if ($objPai){
                            // Atribuindo o ID do Pai
                            $data->pai_id = $objPai->animal_id;
                        }
                        else {
                            $return->failure = true;
                            $return->msg = "Verifique o Código do Pai.</br> Este código: <font color='blue'>{$data->codigo_pai}</font> não é valido, ou não pertence a um <font color='blue'>Macho</font>.";
                        }
                    }
                    // Ate aqui tudo ocorreu bem criar um obj animal
                    $codigo = new StdClass();
                    $codigo->confinamento_id = $data->confinamento_id;
                    $codigo->codigo = $data->codigo;
                    $codigo->data = $data->data_nascimento;

                    $animal = new StdClass();
                    $animal->nascimento = TRUE;
                    $animal->data_nascimento = $data->data_nascimento;
                    $animal->confinamento_id = $data->confinamento_id;
                    $animal->quadra_id = $data->quadra_id;
                    $animal->caracteristica_id = $data->caracteristica_id;
                    $animal->sexo = $data->sexo;
                    $animal->idade = 1;
                    $animal->mae_id = $data->mae_id;
                    $animal->pai_id = $data->pai_id;
                    $animal->peso = $data->peso;
                    $animal->codigos[] = $codigo;

                    $animais[] = $animal;
                    $result = Animais::CadastroAnimais($animais);

                    if ($result->success){
                        $return->success = true;
                        $return->msg = "Registro Salvo com Sucesso!";
                    }
                    else {
                        $return->failure = true;
                        $return->msg = "Falha ao Inserir o registro do animal, nenhuma alteração foi feita.<br>Error: {$result->error[2]}";
                    }

                        //var_dump($return);

                }
                else {
                    $return->failure = true;
                    $return->msg = "Verifique o Código da Mãe.</br> Este código: <font color='blue'>{$data->codigo_mae}</font> não é valido, ou não pertence a uma <font color='blue'>Femea</font>.";
                }
            }

//             $return->success = true;
//             $return->msg = "Todos os campos validos";

        }
        else {
            $return->failure = true;
            $return->msg = "Falha não foi possivel realizar a operação.</br> verifique se todos os campos estão preenchidos!";
        }


        if ($json){
            echo json_encode($return);
        }
        else {
            return $return;
        }

    }

    public function update($data, $json = true){

    }

    public function load($data){


        $db = $this->getDb();


        $sql = "SELECT animais.*, animais_codigos.* FROM animais a INNER JOIN animais_codigos c ON animais.id = animais_codigos.animal_id WHERE a.confinamento_id = '{$data->confinamento_id}' AND data_nascimento <> '';";

        $stm = $db->prepare($sql);
        $stm->execute();

        $nascimentos = $stm->fetchAll(\PDO::FETCH_OBJ);

        var_dump($nascimentos);

//         $data = $this->fetchAll();
// 
//         foreach ($data->data as $row){
//             $record = $row;
// 
//             // Para Cada Registro Recuperar o Nome do Confinamento
//             $confinamento = $this->find($record->confinamento_id, 'confinamentos');
//             $record->confinamento  = $confinamento->confinamento;
// 
//             // Informacoes da Quadra
//             $quadra = $this->find($row->quadra_id, 'quadras', 'quadra');
//             $record->quadra = $quadra->quadra;
// 
//             $records[] = $record;
//         }
// 
//         $data->data = $records;
// 
//         echo json_encode($data);

    }

}
