<?php

class Connection {


    public function getConnection($config) {

        $dsn = $config['adapter'] . ":host=" . $config['hostname'] . ";dbname=" . $config['dbname'];
        try {

            if (empty(self::$conn)){

                $conn = new PDO($dsn, $config['user'], $config['password']);

                return $conn;

            }

        } catch (PDOException $e) {
            die($e->getMessage());
        }
    }

}