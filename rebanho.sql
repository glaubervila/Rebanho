SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `rebanho` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `rebanho` ;

-- -----------------------------------------------------
-- Table `rebanho`.`caracteristicas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`caracteristicas` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`caracteristicas` (
  `id_caracteristicas` INT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(10) NOT NULL ,
  `descricao` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id_caracteristicas`) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) ,
  UNIQUE INDEX `id_caracteristicas_UNIQUE` (`id_caracteristicas` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`confinamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`confinamentos` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`confinamentos` (
  `id_confinamentos` INT NULL AUTO_INCREMENT ,
  `confinamento` VARCHAR(50) NOT NULL ,
  PRIMARY KEY (`id_confinamentos`) ,
  UNIQUE INDEX `id_confinamentos_UNIQUE` (`id_confinamentos` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`quadras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`quadras` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`quadras` (
  `id_quadras` INT NULL AUTO_INCREMENT ,
  `id_confinamentos` INT NOT NULL ,
  `quadra` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id_quadras`) ,
  UNIQUE INDEX `id_confinamentos_UNIQUE` (`id_quadras` ASC) ,
  INDEX `fk_quadras_confinamentos1` (`id_confinamentos` ASC) ,
  CONSTRAINT `fk_quadras_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`fornecedores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`fornecedores` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`fornecedores` (
  `id_fornecedores` INT UNSIGNED NULL AUTO_INCREMENT ,
  `nome` VARCHAR(150) NOT NULL ,
  `fazenda` VARCHAR(150) NULL ,
  `cnpj_cpf` VARCHAR(20) NOT NULL ,
  `ie_rg` VARCHAR(20) NOT NULL ,
  `endereco` VARCHAR(150) NULL ,
  `municipio` VARCHAR(45) NULL ,
  `uf` VARCHAR(2) NULL ,
  `cep` VARCHAR(10) NULL ,
  `corretor` VARCHAR(45) NULL ,
  `telefone` VARCHAR(15) NULL ,
  `telefone2` VARCHAR(15) NULL ,
  PRIMARY KEY (`id_fornecedores`) ,
  UNIQUE INDEX `id_fornecedores_UNIQUE` (`id_fornecedores` ASC) ,
  UNIQUE INDEX `cnpj_cpf_UNIQUE` (`cnpj_cpf` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`cepea`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`cepea` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`cepea` (
  `id_cepea` INT NULL AUTO_INCREMENT ,
  `data` DATE NOT NULL ,
  `valor` DECIMAL(5,2) NOT NULL ,
  PRIMARY KEY (`id_cepea`) ,
  UNIQUE INDEX `id_cepea_UNIQUE` (`id_cepea` ASC) ,
  UNIQUE INDEX `data_UNIQUE` (`data` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`compras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`compras` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`compras` (
  `id_compras` INT NULL AUTO_INCREMENT ,
  `id_fornecedores` INT UNSIGNED NOT NULL ,
  `id_caracteristicas` INT NOT NULL ,
  `id_confinamentos` INT NOT NULL ,
  `data_compra` DATE NOT NULL ,
  `numero_nota` VARCHAR(20) NULL ,
  `serie_nota` VARCHAR(5) NULL ,
  `quantidade` INT NOT NULL ,
  `valor_nota` DECIMAL(10,2) NOT NULL ,
  `data_pesagem` DATE NULL ,
  `peso_entrada` DECIMAL(5,2) NULL ,
  `peso_saida` DECIMAL(5,2) NULL ,
  `classificacao` VARCHAR(45) NULL ,
  `escore` VARCHAR(2) NULL ,
  `idade` VARCHAR(2) NULL ,
  `qtd_machos` INT NULL ,
  `qtd_femeas` INT NULL ,
  `corretor` VARCHAR(45) NULL ,
  `valor_comissao` DECIMAL(10,2) NULL ,
  `frete` VARCHAR(45) NULL ,
  `valor_frete` VARCHAR(45) NULL ,
  `imposto` VARCHAR(45) NULL ,
  `valor_imposto` DECIMAL(10,2) NULL ,
  `valor_arroba` DECIMAL(5,2) NULL ,
  `premio` DECIMAL(5,2) NULL ,
  PRIMARY KEY (`id_compras`) ,
  UNIQUE INDEX `data_compra_UNIQUE` (`data_compra` ASC, `id_fornecedores` ASC) ,
  INDEX `fk_compras_fornecedores` (`id_fornecedores` ASC) ,
  INDEX `fk_compras_caracteristicas1` (`id_caracteristicas` ASC) ,
  INDEX `fk_compras_confinamentos1` (`id_confinamentos` ASC) ,
  UNIQUE INDEX `numero_nota_UNIQUE` (`numero_nota` ASC, `serie_nota` ASC, `id_fornecedores` ASC) ,
  CONSTRAINT `fk_compras_fornecedores`
    FOREIGN KEY (`id_fornecedores` )
    REFERENCES `rebanho`.`fornecedores` (`id_fornecedores` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compras_caracteristicas1`
    FOREIGN KEY (`id_caracteristicas` )
    REFERENCES `rebanho`.`caracteristicas` (`id_caracteristicas` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compras_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`animais`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`animais` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`animais` (
  `id_animais` INT NULL AUTO_INCREMENT ,
  `id_confinamentos` INT NOT NULL ,
  `id_quadras` INT NOT NULL ,
  `id_compras` INT NOT NULL ,
  `id_fornecedores` INT NOT NULL ,
  `id_caracteristicas` INT NOT NULL ,
  `sisbov` VARCHAR(15) NULL ,
  `sexo` VARCHAR(1) NULL ,
  `idade` INT NULL ,
  `classificacao` VARCHAR(45) NULL ,
  `escore` VARCHAR(2) NULL ,
  PRIMARY KEY (`id_animais`) ,
  INDEX `fk_animais_compras1` (`id_compras` ASC) ,
  INDEX `fk_animais_quadras1` (`id_quadras` ASC) ,
  INDEX `fk_animais_confinamentos1` (`id_confinamentos` ASC) ,
  INDEX `fk_animais_fornecedores1` (`id_fornecedores` ASC) ,
  UNIQUE INDEX `sisbov_UNIQUE` (`sisbov` ASC) ,
  INDEX `fk_animais_caracteristicas1` (`id_caracteristicas` ASC) ,
  CONSTRAINT `fk_animais_compras1`
    FOREIGN KEY (`id_compras` )
    REFERENCES `rebanho`.`compras` (`id_compras` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_quadras1`
    FOREIGN KEY (`id_quadras` )
    REFERENCES `rebanho`.`quadras` (`id_quadras` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_fornecedores1`
    FOREIGN KEY (`id_fornecedores` )
    REFERENCES `rebanho`.`fornecedores` (`id_fornecedores` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_caracteristicas1`
    FOREIGN KEY (`id_caracteristicas` )
    REFERENCES `rebanho`.`caracteristicas` (`id_caracteristicas` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`ocorrencias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`ocorrencias` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`ocorrencias` (
  `id_ocorrencias` INT NULL ,
  `id_confinamentos` INT NOT NULL ,
  `id_quadras` INT NOT NULL ,
  `id_animais` INT NOT NULL ,
  `ocorrencia` VARCHAR(45) NOT NULL ,
  `descricao` VARCHAR(100) NULL ,
  PRIMARY KEY (`id_ocorrencias`) ,
  INDEX `fk_ocorrencias_animais1` (`id_animais` ASC) ,
  INDEX `fk_ocorrencias_quadras1` (`id_quadras` ASC) ,
  INDEX `fk_ocorrencias_confinamentos1` (`id_confinamentos` ASC) ,
  CONSTRAINT `fk_ocorrencias_animais1`
    FOREIGN KEY (`id_animais` )
    REFERENCES `rebanho`.`animais` (`id_animais` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ocorrencias_quadras1`
    FOREIGN KEY (`id_quadras` )
    REFERENCES `rebanho`.`quadras` (`id_quadras` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ocorrencias_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`pesagens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`pesagens` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`pesagens` (
  `id_pesagens` INT NULL AUTO_INCREMENT ,
  `id_confinamentos` INT NOT NULL ,
  `id_quadras` INT NOT NULL ,
  `id_animais` INT NOT NULL ,
  `data` DATE NOT NULL ,
  `peso` DECIMAL(5,2) NULL ,
  PRIMARY KEY (`id_pesagens`) ,
  UNIQUE INDEX `id_pesagens_UNIQUE` (`id_pesagens` ASC) ,
  INDEX `fk_pesagens_animais1` (`id_animais` ASC) ,
  INDEX `fk_pesagens_confinamentos1` (`id_confinamentos` ASC) ,
  INDEX `fk_pesagens_quadras1` (`id_quadras` ASC) ,
  CONSTRAINT `fk_pesagens_animais1`
    FOREIGN KEY (`id_animais` )
    REFERENCES `rebanho`.`animais` (`id_animais` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pesagens_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pesagens_quadras1`
    FOREIGN KEY (`id_quadras` )
    REFERENCES `rebanho`.`quadras` (`id_quadras` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`animais_codigos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`animais_codigos` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`animais_codigos` (
  `id_animais_codigos` INT NULL AUTO_INCREMENT ,
  `id_confinamentos` INT NOT NULL ,
  `id_animais` INT NOT NULL ,
  `codigo` VARCHAR(20) NOT NULL ,
  `tipo` VARCHAR(2) NULL ,
  `data` DATE NULL ,
  PRIMARY KEY (`id_animais_codigos`) ,
  UNIQUE INDEX `id_animais_codigos_UNIQUE` (`id_animais_codigos` ASC) ,
  INDEX `fk_animais_codigos_animais1` (`id_animais` ASC) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC, `id_confinamentos` ASC, `id_animais` ASC) ,
  INDEX `fk_animais_codigos_confinamentos1` (`id_confinamentos` ASC) ,
  CONSTRAINT `fk_animais_codigos_animais1`
    FOREIGN KEY (`id_animais` )
    REFERENCES `rebanho`.`animais` (`id_animais` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_codigos_confinamentos1`
    FOREIGN KEY (`id_confinamentos` )
    REFERENCES `rebanho`.`confinamentos` (`id_confinamentos` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rebanho`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`usuarios` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`usuarios` (
  `id_usuarios` INT NULL AUTO_INCREMENT ,
  `nome` VARCHAR(45) NOT NULL ,
  `login` VARCHAR(45) NOT NULL ,
  `senha` VARCHAR(45) NOT NULL ,
  `email` VARCHAR(150) NULL ,
  PRIMARY KEY (`id_usuarios`) ,
  UNIQUE INDEX `id_usuarios_UNIQUE` (`id_usuarios` ASC) ,
  UNIQUE INDEX `login_UNIQUE` (`login` ASC) )
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `rebanho`.`caracteristicas`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (0, '1/2AA', 'Meio Sangue Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (1, '1/2BR', 'Meio Sangue Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (2, '1/2CH', 'Meio Sangue Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (3, '1/2LI', 'Meio Sangue Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (4, '1/2MR', 'Meio Sangue Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (5, '1/2PH', 'Meio Sangue Polled Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (6, '1/2RA', 'Meio Sangue Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (7, '1/2SI', 'Meio Sangue Simental');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (8, '3/4AA', 'Três Quartos Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (9, '3/4BR', 'Três Quartos Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (10, '3/4CH', 'Três Quartos Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (11, '3/4LI', 'Três Quartos Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (12, '3/4MR', 'Três Quartos Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (13, '3/4N', 'Três Quartos Nelore');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (14, '3/4RA', 'Três Quartos Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (15, '3/4SI', 'Três Quartos Simental');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (16, '3+', 'Three Cross');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (17, 'AA', 'Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (18, 'BBR', 'Black Brangus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (19, 'BR', 'Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (20, 'CH', 'Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (21, 'CRZ', 'Cruzado');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (22, 'HE', 'Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (23, 'LI', 'Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (24, 'MR', 'Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (25, 'N', 'Nelore');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (26, 'PH', 'Polled Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (27, 'PS', 'Pardo Suisso');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (28, 'RA', 'Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (29, 'RBR', 'Red Brangus');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (30, 'SE', 'Senepol');
INSERT INTO `rebanho`.`caracteristicas` (`id_caracteristicas`, `codigo`, `descricao`) VALUES (31, 'SI', 'Simental');

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`confinamentos`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`confinamentos` (`id_confinamentos`, `confinamento`) VALUES (1, 'Fazenda São Marcos');
INSERT INTO `rebanho`.`confinamentos` (`id_confinamentos`, `confinamento`) VALUES (2, 'Fazenda Entre Rios');
INSERT INTO `rebanho`.`confinamentos` (`id_confinamentos`, `confinamento`) VALUES (3, 'Sitio Gramado');

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`usuarios`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`usuarios` (`id_usuarios`, `nome`, `login`, `senha`, `email`) VALUES (0, 'Glauber Costa Vila-Verde', 'gverde', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'glauber.vila.verde@gmail.com');
INSERT INTO `rebanho`.`usuarios` (`id_usuarios`, `nome`, `login`, `senha`, `email`) VALUES (1, 'Tarciso Meira', 'tarcisio', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', NULL);
INSERT INTO `rebanho`.`usuarios` (`id_usuarios`, `nome`, `login`, `senha`, `email`) VALUES (2, 'Fazenda São Marcos', 'saomarcos', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', NULL);
INSERT INTO `rebanho`.`usuarios` (`id_usuarios`, `nome`, `login`, `senha`, `email`) VALUES (3, 'Fazenda Entre Rios', 'entrerios', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', NULL);
INSERT INTO `rebanho`.`usuarios` (`id_usuarios`, `nome`, `login`, `senha`, `email`) VALUES (4, 'Sitio Gramado', 'gramado', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', NULL);

COMMIT;
