<?php

/*** mysql hostname ***/
$hostname = 'localhost';

/*** mysql username ***/
$username = 'root';

/*** mysql password ***/
$password = 'gverde';

/*** mysql DB ***/
$dbname = 'mmagropec';

echo "Transferir animais\n";
try {
    $db = new PDO("mysql:host=$hostname;dbname=$dbname", $username, $password);
    /*** echo a message saying we have connected ***/
    echo "Connected to database\n";
}
catch(PDOException $e){
    echo $e->getMessage();
}
try {

    $count = 0;

    $db->beginTransaction();

    $sql = "SELECT * FROM transferencias WHERE status NOT IN (3);";
    echo ("RECUPERANDO TRANSFERENCIA ABERTA = $sql\n");
    $stmt = $db->query($sql);
    $transferencias = $stmt->fetchAll(PDO::FETCH_OBJ);
    foreach ($transferencias as $transferencia){
        echo "----------------------------------------------TRANSFERENCIA [{$transferencia->id}]----------------------------------------------\n";

        $sql = "UPDATE `transferencias` SET `status` = 3, `data_entrada` = '{$transferencia->data_saida}', `quadra_id` = 18 WHERE id = {$transferencia->id};";

        echo ("TRANSFERENCIA = $sql\n");
        $db->exec($sql);

        //var_dump($animais_id);
    }
    $db->commit();

    echo "----------------------------------------------< >----------------------------------------------\n";
}
catch(PDOException $e){
    echo ("ROLLBACK");
    echo $e->getMessage();
    $db->rollback();
}

echo ("COUNT [ $count ]");

?>