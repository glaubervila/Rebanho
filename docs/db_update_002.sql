SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `ocorrencias` ADD COLUMN `tipo` CHAR(1) NULL DEFAULT NULL  AFTER `animal_id` ;

ALTER TABLE `ocorrencias` CHANGE `id` `id` INT( 11 ) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `compras` CHANGE `peso_medio_arroba` `valor_kg_vivo` DECIMAL( 10, 3 ) NULL DEFAULT NULL COMMENT 'Valor do Kg vivo, valor_nota / peso_saida' ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
