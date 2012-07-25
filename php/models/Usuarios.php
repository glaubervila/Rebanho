<?php

class Usuarios extends Base {

    private     $valor = null;
    private     $data = null;
    protected   $table = "usuarios";

    public function insert($data) {

        $db = $this->getDb();

        $query = 'Insert into ' . $this->getTable() . ' (confinamento_id, quadra) Values(:confinamento_id, :quadra)';

        $stm = $db->prepare($query);

        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra', $data->quadra);

        $stm->execute();

        $insert = $db->lastInsertId($query);

        if ($insert) {

            $newData = $data;
            $newData->id = $insert;

            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }

    }

    public function update($data) {

        $db = $this->getDb();

        $query = 'update ' . $this->getTable() . ' set confinamento_id = :confinamento_id, quadra = :quadra where id=:id';

        $stm = $db->prepare($query);

        $stm->bindValue(':id', $data->id);
        $stm->bindValue(':confinamento_id', $data->confinamento_id);
        $stm->bindValue(':quadra', $data->quadra);

        $update = $stm->execute();

        if ($update) {
            $this->ReturnJsonSuccess($msg,$data);
        }
        else {
            $error = $stm->errorInfo();
            $this->ReturnJsonError($error);
        }
    }


    /**Method: isLogged()
     * Verifica se um Usuario esta logado no sistema
     */
    public function isLogged($data){
        $return = new StdClass();

        if ($_SESSION['logged']["isLogged"] == TRUE) {

            $logged->user_id            = $_SESSION['logged']["user_id"];
            $logged->user_name          = $_SESSION['logged']["user_name"];
            $logged->user_confinamento  = $_SESSION['logged']["user_confinamento"];
            $logged->confinamento       = $_SESSION['logged']["confinamento"];;

            $return->success = true;
            $return->data = $logged;
        }
        else {
            $return->success = false;
        }

        echo json_encode($return);
    }


    /**Method: tryLogin()
     * Verifica Usuario e senha na base de dados
     * em caso de autenticacao verdadeira crias as sessions do usuarios
     * @param:{object}$data dados vindo do formulario de login
     */
    public function tryLogin($data){
        $return = new StdClass();

        if ($data['login'] and $data['senha']){
            // Verificar Login e Senha
            $usuario = $this->verifica_login_senha($data['login'], $data['senha']);
            //var_dump($usuario);
            if ($usuario){
                // Criando a Sessao do Usuario
                $_SESSION['logged']["isLogged"]    = TRUE;
                $_SESSION['logged']["user_id"]     = $usuario->id;
                $_SESSION['logged']["user_name"]   = $usuario->nome;
                $_SESSION['logged']["start_time"]  = date('Y-m-d H:i:s');
                $_SESSION['logged']["user_confinamento"] = $usuario->confinamento_id;
                $_SESSION['logged']["confinamento"] = $usuario->confinamento;

                // Criando Retorno
                $return->success = true;
                $return->id      = $usuario->id;
                $return->nome    = $usuario->nome;
                $return->confinamento_id = $usuario->confinamento_id;
                $return->confinamento = $usuario->confinamento;
            }
        }
        else {
            $return->success = false;
            $return->msg = 'Preencha Todos os Campos...';
        }

        echo json_encode($return);
    }

    /**Method: verifica_login_senha()
     * Faz uma Query e verifica se o login e a senha conferem
     * @param:{string}$login login do usuarios
     * @param:{string}$senha senha do usuarios
     * @return:{object}$usuario em caso verdadeiro ou retorna {bool} false
     */
    public function verifica_login_senha($login,$senha){

        // Criptografando Senha
        //$senha = sha1($senha);
        //echo "$senha";
        $query = new StdClass();

        $query->sql = "SELECT id, nome, login, confinamento_id FROM usuarios WHERE login ='$login' and senha = '$senha' LIMIT 1";
        $query->limit = false;
        $query->order = false;

        $result = $this->fetchAll($query);

        //var_dump($result);
        if ($result->total != 0) {

            $user = $result->data[0];
            $confinamento = $this->find($user->confinamento_id, 'confinamentos');
            $user->confinamento = $confinamento->confinamento;
            return $user;
        }
        else {
            return FALSE;
        }
    }
}
