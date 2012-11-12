SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE  TABLE IF NOT EXISTS `clientes` (
  `id` INT(11) NULL DEFAULT NULL AUTO_INCREMENT ,
  `confinamento_id` INT(11) NOT NULL ,
  `cnpj_cpf` VARCHAR(20) NOT NULL ,
  `ie_rg` VARCHAR(20) NULL DEFAULT NULL ,
  `nome` VARCHAR(150) NOT NULL ,
  `razao_social` VARCHAR(45) NULL DEFAULT NULL ,
  `logradouro` VARCHAR(150) NULL DEFAULT NULL ,
  `numero` VARCHAR(10) NULL DEFAULT NULL ,
  `bairro` VARCHAR(45) NULL DEFAULT NULL ,
  `municipio` VARCHAR(45) NULL DEFAULT NULL ,
  `uf` VARCHAR(2) NULL DEFAULT NULL ,
  `cep` VARCHAR(10) NULL DEFAULT NULL ,
  `complemento` VARCHAR(45) NULL DEFAULT NULL ,
  `corretor` VARCHAR(45) NULL DEFAULT NULL ,
  `telefone` VARCHAR(15) NULL DEFAULT NULL ,
  `telefone2` VARCHAR(15) NULL DEFAULT NULL ,
  `email` VARCHAR(250) NULL DEFAULT NULL ,
  `observacao` TEXT NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_clientes_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `cnpj_cpf_UNIQUE` (`cnpj_cpf` ASC) ,
  INDEX `fk_clientes_confinamentos` (`confinamento_id` ASC) ,
  CONSTRAINT `fk_fornecedores_confinamentos10`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;

-- -----------------------------------------------------
-- Table `vacinas`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `vacinas` (
  `id` INT NOT NULL ,
  `confinamento_id` INT NULL ,
  `status` CHAR(1) NULL ,
  `nome` VARCHAR(45) NULL ,
  `laboratorio` VARCHAR(45) NULL ,
  `lote` VARCHAR(45) NULL ,
  `fabricacao` VARCHAR(10) NULL ,
  `validade` VARCHAR(10) NULL ,
  PRIMARY KEY (`id`) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
