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

    $origem = 2;
    $destino = 3;
    $quadra_destino = 18;
    
    // Recuperar os id dos animais transferidos. so os que tiverem ocorrencia de saida
    $sql = "SELECT animal_id, data FROM ocorrencias WHERE confinamento_id = 2 AND tipo = 6";
    $stmt = $db->query($sql);
 
    $saidas = $stmt->fetchAll(PDO::FETCH_OBJ);
 
    foreach ($saidas as $saida){
        $animal_id = $saida->animal_id;
        echo "----------------------------------------------ANIMAL [$animal_id] COUNT [$count]----------------------------------------------\n";

        if ($count > 1000){
            $quadra_destino = 19;
        }
        if ($count > 2000){
            $quadra_destino = 20;
        }
        if ($count > 3000){
            $quadra_destino = 21;
        }

        $sql = "UPDATE animais SET quadra_id = $quadra_destino WHERE id=$animal_id;"; 
        echo ("ALTERAÇÃO DA QUADRA = $sql\n");
        $db->exec($sql);



        // Copiar o codigo de origem
        $sql = "REPLACE INTO animais_codigos (confinamento_id, animal_id, codigo, data) 
        SELECT $destino, animal_id, codigo, '{$saida->data}' FROM animais_codigos WHERE animal_id = $animal_id AND tipo is null;";
        echo ("CODIGO = $sql\n");
        $db->exec($sql);

        // Limpar as entradas erradas
        $sql = "DELETE FROM ocorrencias WHERE confinamento_id IN (2,3) AND descricao = 'Entrada - Sitio Gramado';";
        echo ("DELETE ENTRADA = $sql\n");
        $db->exec($sql);

        // COPIAR ENTRADA
        $sql = "INSERT INTO ocorrencias (animal_id, confinamento_id, quadra_id, tipo, ocorrencia, descricao, data)
        SELECT animal_id, $destino, $quadra_destino, tipo, ocorrencia, 'Entrada - Sitio Gramado', '{$saida->data}' FROM ocorrencias WHERE animal_id = $animal_id AND confinamento_id = $origem AND tipo = 1;";
        echo ("ENTRADA = $sql\n");
        $db->exec($sql);

        // SABER SE TEM PESO DE ENTRADA
        $sql = "SELECT * FROM pesagens WHERE confinamento_id = $destino AND animal_id = $animal_id AND tipo = 1;";
        echo ("TESTE PESO ENTRADA = $sql\n");
        $stmt = $db->query($sql);
        $peso_entrada = $stmt->fetchAll(PDO::FETCH_OBJ);
        if (count($peso_entrada) > 0){
            echo "JA POSSUI PESO DE ENTRADA";
        }
        else {
            // Criar um Peso de Entrada
            $sql = "REPLACE INTO pesagens (confinamento_id, quadra_id, animal_id, data, peso, tipo)SELECT $destino, $quadra_destino, animal_id, '{$saida->data}', peso, 1 FROM pesagens WHERE confinamento_id = $origem AND animal_id = $animal_id AND tipo = 4;";
            echo ("PESO ENTRADA = $sql\n");
            $db->exec($sql);

            $sql = "SELECT peso, data FROM pesagens WHERE confinamento_id = $destino AND animal_id = $animal_id AND tipo = 1;";
            $stmt = $db->query($sql);
            $peso_entrada = $stmt->fetch(PDO::FETCH_OBJ);

            $sql = "INSERT INTO ocorrencias (`confinamento_id`,`quadra_id`,`animal_id`,`tipo`,`ocorrencia`,`descricao`,`data`) VALUES ($destino,$quadra_destino, $animal_id, 2, 'Pesagem', 'Pesagem de Entrada - {$peso_entrada->peso} Kg', '{$peso_entrada->data}');"; 
            echo ("OCORRENCIA PESO ENTRADA = $sql\n");
            $db->exec($sql);
        }

        $count++;

    }
 
    //var_dump($animais_id);
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

