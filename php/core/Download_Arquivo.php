<?php

    $file = $_GET['file'];
    $path = $_GET['path'];
    $filename = $_GET['filename'];
    $mime = $_GET['mime'];

    $file_result = "../$path/$file";

    //echo getcwd();


header('Access-Control-Allow-Origin: *');


if (file_exists($file_result) && is_readable($file_result)) {

    //header("Content-Type: application/text");

    switch ($mime){
        case 'pdf':
            header("Content-Type: application/pdf");
        break;
        default:
            header("Content-Type: application/text");
        break;
    }

//     header("Content-Type: application/text");
    header("Content-Disposition: inline; filename=\"$filename\"");
//     header('Expires: ' . gmdate('D, d M Y H:i:s', gmmktime() - 3600) . ' GMT');
//     header("Content-Length: " . filesize($file_result));
    // Special headers for IE 6
//     header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
//     header('Pragma: public');
    var_dump($file_result);
    $fp = fopen($file_result, "rb");
    fpassthru($fp);
    fclose($fp);

} else {
    die("Arquivo \"$file_result\" n&atilde;o foi encontrado ou est&aacute; inacessivel.");
}


?>