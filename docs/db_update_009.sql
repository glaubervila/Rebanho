CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_animais` AS select
    a.id AS id,
    a.confinamento_id AS confinamento_id,
    a.quadra_id AS quadra_id,
    a.compra_id AS compra_id,
    a.fornecedor_id AS fornecedor_id,
    a.caracteristica_id AS caracteristica_id,
    a.sisbov AS sisbov,
    a.sexo AS sexo,
    a.idade AS idade,
    a.classificacao AS classificacao,
    a.escore AS escore,
    a.status AS status,
    a.data_nascimento AS data_nascimento,
    a.mae_id AS mae_id,
    a.pai_id AS pai_id,
    b.idade AS idade_entrada,
    b.numero_nota AS numero_nota,
    b.serie_nota AS serie_nota,
    c.confinamento AS confinamento,
    d.quadra AS quadra,
    e.nome AS fornecedor_razao,
    e.fazenda AS fornecedor_fazenda,
    f.codigo AS cod_caracteristica,
    f.descricao AS caracteristica,
    g.codigo 
from
    (((((animais a
    join compras b ON ((a.compra_id = b.id)))
    join confinamentos c ON ((a.confinamento_id = c.id)))
    join quadras d ON ((a.quadra_id = d.id)))
    join fornecedores e ON ((a.fornecedor_id = e.id)))
    join caracteristicas f ON ((a.caracteristica_id = f.id)))
    JOIN animais_codigos g ON ((a.id = g.animal_id) AND (a.confinamento_id = g.confinamento_id));