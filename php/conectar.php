<?php
 
//nome do servidor (Localhost)
$servidor = "localhost";
 
//usuário do banco de dados
$user = "root";
 
//senha do banco de dados
$senha = "";
 
//nome da base de dados
$db = "rebanho";
 
//executa a conexão com o banco, caso contrário mostra o erro ocorrido
//$conexao = mysql_connect($servidor,$user,$senha) or die (mysql_error());



//seleciona a base de dados daquela conexão, caso contrário mostra o erro ocorrido
//$banco = mysql_select_db($db, $conexao) or die(mysql_error());

$conexao = new PDO("mysql:host=localhost;port=3306;dbname=rebanho", 'root', '');
?>