ALTER TABLE `clientes` DROP FOREIGN KEY `fk_fornecedores_confinamentos10` ,
ADD FOREIGN KEY ( `confinamento_id` ) REFERENCES `mmagropec`.`confinamentos` (
`id`
) ON DELETE NO ACTION ON UPDATE NO ACTION ;

-- -----------------------------------------------------
-- Table `mmagropec`.`clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mmagropec`.`clientes` ;

CREATE  TABLE IF NOT EXISTS `clientes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT ,
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
  CONSTRAINT `fk_fornecedores_confinamentos`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 0
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `mmagropec`.`vendas`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `vendas` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `confinamento_id` INT(11) NOT NULL ,
  `cliente_id` INT(11) NOT NULL ,
  `data` DATE NOT NULL ,
  `quantidade` INT NULL ,
  `qtd_machos` INT NULL ,
  `qtd_femeas` INT NULL ,
  `status` CHAR NULL ,
  `numero_nota` VARCHAR(20) NULL ,
  `serie_nota` VARCHAR(5) NULL ,
  `valor_nota` DECIMAL(10,2) NULL ,
  `peso_saida` DECIMAL(10,3) NULL ,
  `peso_medio` DECIMAL(6,3) NULL ,
  `maior_peso` DECIMAL(6,3) NULL ,
  `menor_peso` DECIMAL(6,3) NULL ,
  `permanencia_media` DECIMAL(5,2) NULL ,
  `ganho_medio` DECIMAL(6,3) NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `fk_vendas_clientes` (`cliente_id` ASC) ,
  INDEX `fk_vendas_confinamentos` (`confinamentos_id` ASC) ,
  CONSTRAINT `fk_vendas_clientes`
    FOREIGN KEY (`cliente_id` )
    REFERENCES `clientes` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vendas_confinamentos`
    FOREIGN KEY (`confinamento_id` )
    REFERENCES `confinamentos` (`id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_general_ci;


