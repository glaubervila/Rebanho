<?php

class Connection {


    public function getConnection($config) {

        $dsn = $config['adapter'] . ":host=" . $config['hostname'] . ";dbname=" . $config['dbname'];
        try {

            if (empty(self::$conn)){

                $conn = new PDO($dsn, $config['user'], $config['password']);

                $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET NAMES utf8");
                $conn->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, "SET character_set_results=utf8");

                return $conn;

            }

        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

}