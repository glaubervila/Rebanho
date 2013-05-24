SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

DROP SCHEMA IF EXISTS `rebanho` ;
CREATE SCHEMA IF NOT EXISTS `rebanho` DEFAULT CHARACTER SET utf8 ;
USE `rebanho` ;

-- -----------------------------------------------------
-- Table `rebanho`.`caracteristicas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`caracteristicas` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`caracteristicas` (
  `id` INT NULL AUTO_INCREMENT ,
  `codigo` VARCHAR(10) NOT NULL ,
  `descricao` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) ,
  UNIQUE INDEX `id_caracteristicas_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`confinamentos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`confinamentos` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`confinamentos` (
  `id` INT NULL AUTO_INCREMENT ,
  `confinamento` VARCHAR(50) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_confinamentos_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`quadras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`quadras` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`quadras` (
  `id` INT NULL AUTO_INCREMENT ,
  `confinamento_id` INT NOT NULL ,
  `quadra` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_confinamentos_UNIQUE` (`id` ASC) ,
  INDEX `fk_quadras_confinamentos1` (`confinamento_id` ASC) ,
  CONSTRAINT `fk_quadras_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`fornecedores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`fornecedores` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`fornecedores` (
  `id` INT NULL AUTO_INCREMENT ,
  `nome` VARCHAR(150) NOT NULL ,
  `fazenda` VARCHAR(150) NULL ,
  `cnpj_cpf` VARCHAR(20) NOT NULL ,
  `ie_rg` VARCHAR(20) NULL ,
  `logradouro` VARCHAR(150) NULL ,
  `numero` VARCHAR(10) NULL ,
  `complemento` VARCHAR(45) NULL ,
  `municipio` VARCHAR(45) NULL ,
  `uf` VARCHAR(2) NULL ,
  `cep` VARCHAR(10) NULL ,
  `corretor` VARCHAR(45) NULL ,
  `telefone` VARCHAR(15) NULL ,
  `telefone2` VARCHAR(15) NULL ,
  `email` VARCHAR(250) NULL ,
  `observacao` TEXT NULL ,
  `confinamento_id` INT NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_fornecedores_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `cnpj_cpf_UNIQUE` (`cnpj_cpf` ASC) ,
  INDEX `fk_fornecedores_confinamentos1` (`confinamento_id` ASC) ,
  CONSTRAINT `fk_fornecedores_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`cepea`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`cepea` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`cepea` (
  `id` INT NULL AUTO_INCREMENT ,
  `data` DATE NOT NULL ,
  `valor` DECIMAL(5,2) NOT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_cepea_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `data_UNIQUE` (`data` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`compras`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`compras` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`compras` (
  `id` INT NULL AUTO_INCREMENT ,
  `fornecedor_id` INT NOT NULL ,
  `caracteristica_id` INT NOT NULL ,
  `confinamento_id` INT NOT NULL ,
  `data_compra` DATE NOT NULL ,
  `numero_nota` VARCHAR(20) NULL ,
  `serie_nota` VARCHAR(5) NULL ,
  `status` CHAR(1) NULL COMMENT 'Status da Nota \n1 - Aberta\n2 - Fechada\n3 - Cancelada\n4 - Aguardando Pesagem' ,
  `quantidade` INT NOT NULL ,
  `valor_nota` DECIMAL(10,2) NOT NULL ,
  `data_pesagem` DATE NULL ,
  `peso_entrada` DECIMAL(10,2) NULL ,
  `peso_saida` DECIMAL(10,2) NULL ,
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
  `quadra_id` INT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `data_compra_UNIQUE` (`data_compra` ASC, `fornecedor_id` ASC, `numero_nota` ASC) ,
  INDEX `fk_compras_fornecedores` (`fornecedor_id` ASC) ,
  INDEX `fk_compras_caracteristicas1` (`caracteristica_id` ASC) ,
  INDEX `fk_compras_confinamentos1` (`confinamento_id` ASC) ,
  UNIQUE INDEX `numero_nota_UNIQUE` (`numero_nota` ASC, `serie_nota` ASC, `fornecedor_id` ASC) ,
  CONSTRAINT `fk_compras_fornecedores`
    FOREIGN KEY (`fornecedor_id` )
    REFERENCES `rebanho`.`fornecedores` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compras_caracteristicas1`
    FOREIGN KEY (`caracteristica_id` )
    REFERENCES `rebanho`.`caracteristicas` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_compras_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`animais`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`animais` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`animais` (
  `id` INT NULL AUTO_INCREMENT ,
  `confinamento_id` INT NOT NULL ,
  `quadra_id` INT NOT NULL ,
  `compra_id` INT NOT NULL ,
  `fornecedor_id` INT NOT NULL ,
  `caracteristica_id` INT NOT NULL ,
  `sisbov` VARCHAR(15) NULL ,
  `sexo` VARCHAR(1) NULL ,
  `idade` INT NULL ,
  `classificacao` VARCHAR(45) NULL ,
  `escore` VARCHAR(2) NULL ,
  `status` CHAR(1) NULL COMMENT '0 - Morto\n1 - Vivo\n2 - Perdido' ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_animais_compras1` (`compra_id` ASC) ,
  INDEX `fk_animais_quadras1` (`quadra_id` ASC) ,
  INDEX `fk_animais_confinamentos1` (`confinamento_id` ASC) ,
  INDEX `fk_animais_fornecedores1` (`fornecedor_id` ASC) ,
  UNIQUE INDEX `sisbov_UNIQUE` (`sisbov` ASC) ,
  INDEX `fk_animais_caracteristicas1` (`caracteristica_id` ASC) ,
  CONSTRAINT `fk_animais_compras1`
    FOREIGN KEY (`compra_id` )
    REFERENCES `rebanho`.`compras` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_quadras1`
    FOREIGN KEY (`quadra_id` )
    REFERENCES `rebanho`.`quadras` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_fornecedores1`
    FOREIGN KEY (`fornecedor_id` )
    REFERENCES `rebanho`.`fornecedores` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_caracteristicas1`
    FOREIGN KEY (`caracteristica_id` )
    REFERENCES `rebanho`.`caracteristicas` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`ocorrencias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`ocorrencias` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`ocorrencias` (
  `id` INT NULL ,
  `confinamento_id` INT NOT NULL ,
  `quadra_id` INT NOT NULL ,
  `animal_id` INT NOT NULL ,
  `ocorrencia` VARCHAR(45) NOT NULL ,
  `descricao` VARCHAR(100) NULL ,
  `data` DATE NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_ocorrencias_animais1` (`animal_id` ASC) ,
  INDEX `fk_ocorrencias_quadras1` (`quadra_id` ASC) ,
  INDEX `fk_ocorrencias_confinamentos1` (`confinamento_id` ASC) ,
  CONSTRAINT `fk_ocorrencias_animais1`
    FOREIGN KEY (`animal_id` )
    REFERENCES `rebanho`.`animais` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ocorrencias_quadras1`
    FOREIGN KEY (`quadra_id` )
    REFERENCES `rebanho`.`quadras` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ocorrencias_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`pesagens`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`pesagens` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`pesagens` (
  `id` INT NULL AUTO_INCREMENT ,
  `confinamento_id` INT NOT NULL ,
  `quadra_id` INT NOT NULL ,
  `animal_id` INT NOT NULL ,
  `data` DATE NOT NULL ,
  `peso` DECIMAL(5,2) NULL ,
  `tipo` CHAR(1) NULL COMMENT 'Tipo da Pesagem.\n1 - para Peso de Entrada\n2 - para Peso de Rotina\n' ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_pesagens_UNIQUE` (`id` ASC) ,
  INDEX `fk_pesagens_animais1` (`animal_id` ASC) ,
  INDEX `fk_pesagens_confinamentos1` (`confinamento_id` ASC) ,
  INDEX `fk_pesagens_quadras1` (`quadra_id` ASC) ,
  UNIQUE INDEX `pesagem_unique` (`confinamento_id` ASC, `animal_id` ASC, `data` ASC) ,
  CONSTRAINT `fk_pesagens_animais1`
    FOREIGN KEY (`animal_id` )
    REFERENCES `rebanho`.`animais` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pesagens_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_pesagens_quadras1`
    FOREIGN KEY (`quadra_id` )
    REFERENCES `rebanho`.`quadras` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`animais_codigos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`animais_codigos` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`animais_codigos` (
  `id` INT NULL AUTO_INCREMENT ,
  `confinamento_id` INT NOT NULL ,
  `animal_id` INT NOT NULL ,
  `codigo` VARCHAR(20) NOT NULL ,
  `tipo` VARCHAR(2) NULL ,
  `data` DATE NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_animais_codigos_UNIQUE` (`id` ASC) ,
  INDEX `fk_animais_codigos_animais1` (`animal_id` ASC) ,
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC, `confinamento_id` ASC) ,
  INDEX `fk_animais_codigos_confinamentos1` (`confinamento_id` ASC) ,
  CONSTRAINT `fk_animais_codigos_animais1`
    FOREIGN KEY (`animal_id` )
    REFERENCES `rebanho`.`animais` (`id` )
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_animais_codigos_confinamentos1`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `rebanho`.`confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


-- -----------------------------------------------------
-- Table `rebanho`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `rebanho`.`usuarios` ;

CREATE  TABLE IF NOT EXISTS `rebanho`.`usuarios` (
  `id` INT NULL AUTO_INCREMENT ,
  `nome` VARCHAR(45) NOT NULL ,
  `login` VARCHAR(45) NOT NULL ,
  `senha` VARCHAR(45) NOT NULL ,
  `email` VARCHAR(150) NULL ,
  `confinamento_id` INT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `id_usuarios_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `login_UNIQUE` (`login` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `rebanho`.`caracteristicas`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (1, '1/2AA', 'Meio Sangue Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (2, '1/2BR', 'Meio Sangue Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (3, '1/2CH', 'Meio Sangue Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (4, '1/2LI', 'Meio Sangue Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (5, '1/2MR', 'Meio Sangue Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (6, '1/2PH', 'Meio Sangue Polled Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (7, '1/2RA', 'Meio Sangue Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (8, '1/2SI', 'Meio Sangue Simental');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (9, '3/4AA', 'Três Quartos Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (10, '3/4BR', 'Três Quartos Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (11, '3/4CH', 'Três Quartos Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (12, '3/4LI', 'Três Quartos Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (13, '3/4MR', 'Três Quartos Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (14, '3/4N', 'Três Quartos Nelore');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (15, '3/4RA', 'Três Quartos Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (16, '3/4SI', 'Três Quartos Simental');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (17, '3+', 'Three Cross');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (18, 'AA', 'Aberdeen Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (19, 'BBR', 'Black Brangus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (20, 'BR', 'Braford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (21, 'CH', 'Charolês');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (22, 'CRZ', 'Cruzado');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (23, 'HE', 'Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (24, 'LI', 'Limousin');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (25, 'MR', 'Marchigiana');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (26, 'N', 'Nelore');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (27, 'PH', 'Polled Hereford');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (28, 'PS', 'Pardo Suisso');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (29, 'RA', 'Red Angus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (30, 'RBR', 'Red Brangus');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (31, 'SE', 'Senepol');
INSERT INTO `rebanho`.`caracteristicas` (`id`, `codigo`, `descricao`) VALUES (32, 'SI', 'Simental');

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`confinamentos`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`confinamentos` (`id`, `confinamento`) VALUES (1, 'Fazenda São Marcos');
INSERT INTO `rebanho`.`confinamentos` (`id`, `confinamento`) VALUES (2, 'Fazenda Entre Rios');
INSERT INTO `rebanho`.`confinamentos` (`id`, `confinamento`) VALUES (3, 'Sitio Gramado');
INSERT INTO `rebanho`.`confinamentos` (`id`, `confinamento`) VALUES (0, 'Selecione um Confinamento');

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`quadras`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (2, 2, '01');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (3, 2, '02');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (4, 2, '03');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (5, 2, '04');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (6, 2, '05');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (7, 2, '06');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (8, 2, '07');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (9, 2, '99');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (10, 2, 'H Estrada');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (11, 2, 'H Grota');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (12, 2, 'P/ Mudanças');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (13, 2, 'Pasto B');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (14, 2, 'Pasto C');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (15, 2, 'Pasto G');
INSERT INTO `rebanho`.`quadras` (`id`, `confinamento_id`, `quadra`) VALUES (16, 2, 'UTI');

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`fornecedores`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`fornecedores` (`id`, `nome`, `fazenda`, `cnpj_cpf`, `ie_rg`, `logradouro`, `numero`, `complemento`, `municipio`, `uf`, `cep`, `corretor`, `telefone`, `telefone2`, `email`, `observacao`, `confinamento_id`) VALUES (1, 'Fornecedor de Teste', 'Fazenda de Teste', '1111111111111', '22222222', '', '', '', '', '', '', '', '', '', NULL, NULL, 2);

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`cepea`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`cepea` (`id`, `data`, `valor`) VALUES (0, '2012-07-25', 89.89);

COMMIT;

-- -----------------------------------------------------
-- Data for table `rebanho`.`usuarios`
-- -----------------------------------------------------
START TRANSACTION;
USE `rebanho`;
INSERT INTO `rebanho`.`usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES (1, 'Glauber Costa Vila-Verde', 'gverde', '1234', 'glauber.vila.verde@gmail.com', 0);
INSERT INTO `rebanho`.`usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES (2, 'Tarciso Meira', 'tarcisio', '1234', NULL, 0);
INSERT INTO `rebanho`.`usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES (3, 'Fazenda São Marcos', 'saomarcos', '1234', NULL, 1);
INSERT INTO `rebanho`.`usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES (4, 'Fazenda Entre Rios', 'entrerios', '1234', NULL, 2);
INSERT INTO `rebanho`.`usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES (5, 'Sitio Gramado', 'gramado', '1234', NULL, 3);

COMMIT;
