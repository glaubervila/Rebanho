<?php

    //chama o arquivo de conexão com o bd
    include("../conectar.php");

    switch ($_SERVER['REQUEST_METHOD']) {

        case 'GET':
                listaUsuarios();
                break;

        case 'POST':
                criaUsuario();
                break;

        case 'PUT':
                atualizaUsuario();
                break;

        case 'DELETE':
                deletaUsuario();
                break;
    }

    function listaUsuarios() {

        //consulta sql
       // $query = mysql_query("SELECT * FROM usuarios") or die(mysql_error());
        $conexao = new PDO("mysql:host=localhost;port=3306;dbname=rebanho", 'root', '');
        $result = $conexao->Query("SELECT * FROM usuarios");
        //faz um looping e cria um array com os campos da consulta
        while ($row = $result->fetchObject()){
            // Armazena no array $results
            $results->usuarios[] = $row;
        }

        //encoda para formato JSON
        echo json_encode($results);
    }

    function deletaUsuario(){

        parse_str(file_get_contents("php://input"), $post_vars);

        $info = $post_vars['usuarios'];

        $data = json_decode(stripslashes($info));


        //echo json_encode(array("success" => true,));
        echo json_encode(array("failure" => true));
    }

    function criaUsuario() {

        $info = $_POST['usuarios'];

        $data = json_decode(stripslashes($info));

        $nome  = $data->nome;
        $email = $data->email;
        $login = $data->login;
        $senha = $data->senha;

        //consulta sql
        $db = new PDO("mysql:host=localhost;port=3306;dbname=rebanho", 'root', '');

        $stm = $db->prepare('INSERT INTO usuarios (nome, login, email, senha) values (:nome, :login, :email, :senha)');
        $stm->bindValue(':nome', $data->nome);
        $stm->bindValue(':login', $data->login);
        $stm->bindValue(':email', $data->email);
        $stm->bindValue(':senha', $data->senha);
        $stm->execute();

        $result = $db->lastInsertId($query);

        if ($result) {
            echo json_encode(array(
                    "success" => true,
                    "usuarios" => array(
                            "id" => $result,
                            "nome" => $nome,
                            "login" => $login,
                            "email" => $email,
                    )
            ));
        }
        else {
            $error = $stm->errorInfo();

            $msg = "Desculpe! Mas não foi possivel Inserir o(s) registro(s)... <br>Message[ $error[2] ] Code [ $error[0] ] ";

            echo json_encode(array(
                "failure" => true,
                "msg" => $msg,
            ));

        }

    }
//
//         function atualizaContato() {
// 
//                 parse_str(file_get_contents("php://input"), $post_vars);
// 
//                 $info = $post_vars['contatos'];
// 
//                 $data = json_decode(stripslashes($info));
// 
//                 $nome = $data->nome;
//                 $email = $data->email;
//                 $id = $data->id;
// 
//                 //consulta sql
//                 $query = sprintf("UPDATE Contato SET nome = '%s', email = '%s' WHERE id=%d",
//                         mysql_real_escape_string($nome),
//                         mysql_real_escape_string($email),
//                         mysql_real_escape_string($id));
// 
//                 $rs = mysql_query($query);
// 
//                 echo json_encode(array(
//                         "success" => mysql_errno() == 0
//                 ));
//         }
// 
//         function deletaContato() {
// 
//                 parse_str(file_get_contents("php://input"), $post_vars);
// 
//                 $info = $post_vars['contatos'];
// 
//                 $data = json_decode(stripslashes($info));
// 
//                 $id = $data->id;
// 
//                 //consulta sql
//                 $query = sprintf("DELETE FROM Contato WHERE id=%d",
//                         mysql_real_escape_string($id));
// 
//                 $rs = mysql_query($query);
// 
//                 echo json_encode(array(
//                         "success" => mysql_errno() == 0
//                 ));
//         }

?>