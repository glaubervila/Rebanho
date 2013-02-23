SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

ALTER TABLE `rebanho`.`animais` ADD COLUMN `data_nascimento` DATE NULL DEFAULT NULL  AFTER `status` , ADD COLUMN `mae_id` INT(11) NULL DEFAULT NULL  AFTER `data_nascimento` , ADD COLUMN `pai_id` INT(11) NULL DEFAULT NULL  AFTER `mae_id`;

ALTER TABLE `rebanho`.`ocorrencias` CHANGE COLUMN `descricao` `descricao` VARCHAR(250) NULL DEFAULT NULL;

ALTER TABLE `rebanho`.`clientes` CHANGE COLUMN `id` `id` INT(11) NULL DEFAULT NULL AUTO_INCREMENT  ;

ALTER TABLE `rebanho`.`vacinas` DROP COLUMN `vacina`
, ADD UNIQUE INDEX `id_UNIQUE` (`id` ASC);



ALTER TABLE `rebanho`.`vacinas` ADD COLUMN `vacinas` VARCHAR(100) NULL DEFAULT NULL  AFTER `validade` ;
ALTER TABLE `rebanho`.`vacinas` CHANGE COLUMN `vacinas` `vacina` VARCHAR(100) NULL DEFAULT NULL;

ALTER TABLE `rebanho`.`animais` DROP FOREIGN KEY `fk_animais_compras1` , DROP FOREIGN KEY `fk_animais_fornecedores1`;
ALTER TABLE `rebanho`.`animais` CHANGE COLUMN `compra_id` `compra_id` INT(11) NULL DEFAULT NULL  , CHANGE COLUMN `fornecedor_id` `fornecedor_id` INT(11) NULL DEFAULT NULL  ,
  ADD CONSTRAINT `fk_animais_compras1`
  FOREIGN KEY (`compra_id` )
  REFERENCES `rebanho`.`compras` (`id` )
  ON DELETE CASCADE
  ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_animais_fornecedores1`
  FOREIGN KEY (`fornecedor_id` )
  REFERENCES `rebanho`.`fornecedores` (`id` )
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
