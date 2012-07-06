<?php
header('Content-Type: text/javascript; charset=UTF-8');
/** @Class: NotasEntrada
 * Classe Reposavel por disponibilizar os  metodos
 * refente a uma nota fiscal de entrada,
 * Usa as Classes de CompraAnimais e Entrada de Animais
 */

class NotasEntrada extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "";


    /** Metodo: getNotasAbertas
     * Retorna uma lista das Notas de Compras
     * que estao com o status = 1
     */
    public function getNotasAbertas(){
        $result = new StdClass();


        $data[] = $this->getAt(null, 'status IN(1,4)', 'compras');

        if ($data){

            foreach ($data as $row){
                $record = $row;

                // Para Cada Registro Recuperar o Nome do Fornecedor e a Fazenda
                $fornecedor = $this->find($record->fornecedor_id, 'fornecedores');
                $record->fornecedor_nome    = $fornecedor->nome;
                $record->fornecedor_fazenda = $fornecedor->fazenda;

                $records[] = $record;
            }

            $result->success = true;
            $result->data = $records;
        }
        else {
            $result->success = false;
        }
        echo json_encode($result);
    }


    /** Metodo: inicioEntradaAnimais
     */
    public function inicioEntradaAnimais ($data) {

        // Recuperando os Paramentros
        $notaAberta    = $data['nota_aberta'];
        $identificacao = $data['identificacao'];

        // Recuperar a Nota
        $objNota = $this->findBy('id', $notaAberta, 'compras');

        $result = new StdClass();

        // Verificar o Status
        if ($objNota->status == 1) {
            // Se o Status For 1 - Aberta Cria os Novos Animais e altera o status para Aguardando Pesagem

            // Parametros
            $inicio = $identificacao;
            $final  = $identificacao + $objNota->quantidade;
            $qtd_machos = $objNota->qtd_machos;
            $qtd_femeas = $objNota->qtd_femeas;

            // Para Cada Animal na Nota, Criar uma Identificacao Usando a primeira,
            // Separar o Sexo dos animais pelo quantidade de machos e femeas
            $sexo = 0;

            for ($k = $identificacao; $k < $final; $k++){

                // Criando Uma Identificacao
                $identificacao = new StdClass();
                $identificacao->confinamento_id = $objNota->confinamento_id;
                $identificacao->codigo          = $k;
                $identificacao->data            = date('Y-m-d');

                // Criando Um Animal
                $animal = new StdClass();
                $animal->confinamento_id    = $objNota->confinamento_id;
                $animal->quadra_id          = $objNota->quadra_id;
                $animal->compra_id          = $objNota->id;
                $animal->fornecedor_id      = $objNota->fornecedor_id;
                $animal->caracteristica_id  = $objNota->caracteristica_id;
                $animal->classificacao      = $objNota->classificacao;
                $animal->escore             = $objNota->escore;
                $animal->idade              = $objNota->idade;
                $animal->codigos            = array($identificacao);

                // Separando Sexos
                if ($sexo < $qtd_machos){
                    $animal->sexo = 'M';
                }
                else {
                    $animal->sexo = 'F';
                }

                $sexo++;

                $animais[] = $animal;
            }


            // Executa o Metodo CadastroAnimais da Classe Animais
            $result = Animais::CadastroAnimais($animais);

            if ($result->success){
                // Se incluiu todos os animais alterar a Compra o status para Aguardando Pesagem
                // e a Data de Entrada

                $db = $this->getDb();

                $query = 'UPDATE compras set status = :status, data_pesagem = :data_pesagem where id=:id';

                $stm = $db->prepare($query);

                $stm->bindValue(':id', $objNota->id);
                $stm->bindValue(':status', 4);
                $stm->bindValue(':data_pesagem', date('Y-m-d'));


                $update = $stm->execute();

                if ($update) {
                    // Todos os Animais Criados e
                    // Compra Alterada com Sucesso
                    $result->success = true;
                }
                else {
                    // Falha ao Alterar o Status da Compra
                    $error = $stm->errorInfo();
                    $this->ReturnJsonError($error);
                }
            }
            else {
                $this->ReturnJsonError($result->error);
            }
        }
        elseif (($objNota->status == 2) OR ($objNota->status == 3)) {
            // Se Estiver Cancelada ou Fechada
            // Nao Permitir Edicao
            echo "Nota Fechada ou Cancelada";
        }
        elseif ($objNota->status == 4){
            // Se estiver Aguardando Pesagem Só Permitir Pesar
            $result->success = true;
        }

        echo json_encode($result);
    }


    public function getAnimaisNota($data){

        // Recuperando os Paramentros
        $filtros = json_decode($data['filter']);

        $nota_aberta = $filtros[0]->value;

        // Recuperando o ObjNota
        $objNota = $this->find($nota_aberta, 'compras');

        $animais = $this->findAllBy('compra_id', $nota_aberta, 'animais');

        // Para Cada Animal Recuperar os codigos
        foreach ($animais as $animal){

            $registro = $animal;

            // Recuperando o Codigo para o Confinamento
            $codigo = Animais::getCodigosById($animal->id, $animal->confinamento_id);
            $registro->codigo = $codigo[0]->codigo;

            // Recuperando o Peso de Entrada
            $peso_entrada = Pesagens::getPesagemEntrada($animal->id, $objNota);
            $registro->peso_entrada = $peso_entrada->peso;

            $registros[] = $registro;

        }

        $result = new StdClass();

        if ($registros) {

            $result->success = true;
            $result->data = $registros;
        }
        else {
            $result->success = false;
        }

        echo json_encode($result);

//
//         $teste = '{"success":true,"data":[{"id":"1","confinamento_id":"2","quadra_id":"2","compra_id":"1","fornecedor_id":"1","caracteristica_id":"1","sisbov":null,"sexo":"M","idade":"24","classificacao":"Boa","escore":"4","status":"1","codigo":"20","pesagens":[{"id":"100", "animal_id":"1", "peso":"1000"}], "codigos":[{"id":"99", "animal_id":"1", "codigo":"21"}]}]}';
// 
//         echo $teste;

    }

    public function getContadores($data){

        $nota_aberta = $data['nota_aberta'];

        // Recuperando os Contadores
        $result = Pesagens::getCntPesados($data);

        $quantidade = $this->getAt('quantidade',"id = $nota_aberta", 'compras');
        $quantidade = $quantidade->quantidade;
        $pesados = $result->pesados;
        $peso_total = $result->peso_total;

        // Calculando Peso Medio - Usando a quantidade de animais pesados
        $media = ($peso_total/$pesados);

        $result->quantidade = $quantidade;
        $result->falta = ($quantidade - $pesados);
        $result->peso_medio = $media;
        $result->success =  true;

        echo json_encode($result);

    }

}


