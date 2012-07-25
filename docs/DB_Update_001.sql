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