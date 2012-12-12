<?php
// Biblioteca FPDF
define('FPDF_FONTPATH','../php/libs/FPDF/font/');
require_once('../php/libs/FPDF/FPDF.php');
//require_once('../php/libs/FPDF/PDF_Code128.php');

//Desliga o notice e warning do PHP.INI
ini_set('error_reporting','E_ALL & ~E_NOTICE');
ini_set('memory_limit', '16M');
session_start();

$base_path = getcwd();
define("BASE_PATH", $base_path);

//header('Content-Type: text/javascript; charset=UTF-8');

//     if(PHP_OS == 'WINNT') {
//         $base_path = getcwd();

        //echo getcwd();
//     }
//     else {
        //echo getcwd();
        //$path = "../log";
//     }
    





/**
 * função __autoload()
 *  Carrega uma classe quando ela é instânciada pela primeira vez.
 */
function __autoload($classe) {

    $pastas = array(
        '../php',
        '../php/core',
        '../php/models',
        '../php/reports',
    );

    foreach ($pastas as $pasta) {
        if (file_exists("{$pasta}/{$classe}.php")){
            include_once "{$pasta}/{$classe}.php";
        }
    }
}

class Application {

    static public function run(){

        if ($_SERVER['REQUEST_METHOD']) {
 
            switch ($_SERVER['REQUEST_METHOD']) {

                case 'GET':
                    $class  = $_REQUEST['classe'];

                    // Se Nao Houver Parametro Action executa action 'LOAD'
                    $action = $_REQUEST['action'] ? $_REQUEST['action'] : 'load';

                    // Se Nao Houver Parametro Data Passa todo o Post
                    $info = $_REQUEST['data'] ? json_decode($_REQUEST['data']) : $_REQUEST;

                    $data = $info;

                    break;

                case 'POST':
                    $class= $_REQUEST['classe'];

                    // Se Nao Houver Parametro Action executa action 'SAVE'
                    $action = $_REQUEST['action'] ? $_REQUEST['action'] : 'save';

                    // Se Nao Houver Parametro Data Passa todo o Post
                    $info = $_POST['data'] ? json_decode($_POST['data']) : $_POST;

                    $data = $info;

                break;

                case 'PUT':
                    parse_str(file_get_contents("php://input"), $post_vars);

                    $class= $post_vars['classe'];

                    // Se Nao Houver Parametro Action executa action 'SAVE'
                    $action = $post_vars['action'] ? $post_vars['action'] : 'save';

                    $info = $post_vars['data'];

                    $data = json_decode($info);

                break;

                case 'DELETE':
                    parse_str(file_get_contents("php://input"), $post_vars);

                    $class= $post_vars['classe'];

                    // Se Nao Houver Parametro Action executa action 'SAVE'
                    $action = $post_vars['action'] ? $post_vars['action'] : 'destroy';

                    $info = $post_vars['data'];

                    $data = json_decode($info);


                break;
            }

            if (class_exists($class)){
                $pagina = new $class;
                ob_start();
                $pagina->$action($data);
                $content = ob_get_contents();
                ob_end_clean();
            }
            echo $content;
        }
    }
}

Application::run();

?>