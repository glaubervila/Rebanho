--
-- Apagando dados da tabela `usuarios`
--
delete from usuarios;
--
-- Incluindo Campo na Tabela usuarios`
--
ALTER TABLE `usuarios` ADD `confinamento_id` INT NULL AFTER `email` ;
--
-- Incluindo dados da tabela `usuarios`
--
INSERT INTO `usuarios` (`id`, `nome`, `login`, `senha`, `email`, `confinamento_id`) VALUES
(1, 'Glauber Costa Vila-Verde', 'gverde', '2030abee0fb9718bf4eee0d1d3bcd091a3265900', 'glauber.vila.verde@gmail.com', 0),
(2, 'Tarciso Meira', 'tarcisio', '2030abee0fb9718bf4eee0d1d3bcd091a3265900', NULL, 0),
(3, 'Fazenda São Marcos', 'saomarcos', '2030abee0fb9718bf4eee0d1d3bcd091a3265900', NULL, 1),
(4, 'Fazenda Entre Rios', 'entrerios', '2030abee0fb9718bf4eee0d1d3bcd091a3265900', NULL, 2),
(5, 'Sitio Gramado', 'gramado', '2030abee0fb9718bf4eee0d1d3bcd091a3265900', NULL, 3);

--
-- Incluindo dados da tabela `confinamentos`
--
INSERT INTO `rebanho`.`confinamentos` (`id` ,`confinamento`) VALUES ('0', 'Selecione o Confinamento');


--
-- Alterando Restricoes da Tabela Animais
--
ALTER TABLE `animais` DROP FOREIGN KEY `fk_animais_compras1` ;

ALTER TABLE `animais` ADD FOREIGN KEY ( `compra_id` ) REFERENCES `rebanho`.`compras` (
`id`
) ON DELETE CASCADE ON UPDATE NO ACTION ;

--
-- Alterando Restricoes da Tabela Ocorrencias
--
ALTER TABLE `ocorrencias` DROP FOREIGN KEY `fk_ocorrencias_animais1` ;

ALTER TABLE `ocorrencias` ADD FOREIGN KEY ( `animal_id` ) REFERENCES `rebanho`.`animais` (
`id`
) ON DELETE CASCADE ON UPDATE NO ACTION ;

--
-- Alterando Restricoes da Tabela animais_codigos
--
ALTER TABLE `animais_codigos` DROP FOREIGN KEY `fk_animais_codigos_animais1` ;

ALTER TABLE `animais_codigos` ADD FOREIGN KEY ( `animal_id` ) REFERENCES `rebanho`.`animais` (
`id`
) ON DELETE CASCADE ON UPDATE NO ACTION ;


--
-- Alterando Restricoes da Tabela pesagens
--
ALTER TABLE `pesagens` DROP FOREIGN KEY `fk_pesagens_animais1` ;

ALTER TABLE `pesagens` ADD FOREIGN KEY ( `animal_id` ) REFERENCES `rebanho`.`animais` (
`id`
) ON DELETE CASCADE ON UPDATE NO ACTION ;


--
-- Alterando a Tabela Pesagens o Campo Peso, aumentando as casas decimais
--
ALTER TABLE `pesagens` CHANGE `peso` `peso` DECIMAL( 6, 2 ) NULL DEFAULT NULL 