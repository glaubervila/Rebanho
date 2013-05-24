ALTER TABLE `animais_codigos` CHANGE COLUMN `tipo` `tipo` VARCHAR(2) NULL DEFAULT NULL COMMENT '0 or null = brinco normal,\n1 = sisbov.\n'  ;

CREATE  TABLE IF NOT EXISTS `transferencias` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
  `status` VARCHAR(1) NULL DEFAULT NULL COMMENT 'status da transferencia\n0 - Saida\n1 - Transito\n2 - Entrada\n3 - concluida' ,
  `origem` INT(11) NOT NULL COMMENT 'id confinamento de origem.' ,
  `destino` INT(11) NOT NULL COMMENT 'id  confinamento de destino.' ,
  `quantidade` INT(11) NULL DEFAULT NULL COMMENT 'quantidade total de animais na transferencia.' ,
  `machos` INT(11) NULL DEFAULT NULL ,
  `femeas` INT(11) NULL DEFAULT NULL ,
  `data_saida` DATE NULL DEFAULT NULL COMMENT 'data da saida da origem.' ,
  `data_entrada` DATE NULL DEFAULT NULL COMMENT 'data de entrada no destino.' ,
  `animais` TEXT NULL DEFAULT NULL ,
  `quadra_id` INT(11) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `index_saida` (`origem` ASC, `data_saida` ASC) ,
  INDEX `index_entrada` (`destino` ASC, `data_entrada` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;



