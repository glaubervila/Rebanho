<?php

class Connection {


    public function getConnection($config) {

        $dsn = $config['adapter'] . ":host=" . $config['hostname'] . ";dbname=" . $config['dbname'];
        try {

            if (empty(self::$conn)){

                $conn = new PDO($dsn, $config['user'], $config['password']);

                // define para que o PDO lance exceções na ocorrência de erros
                //$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//                 $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
//                 $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET character_set_connection=utf8");
//                 $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET character_set_client=utf8");
//                 $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET character_set_results=utf8");
                return $conn;

            }

        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

}