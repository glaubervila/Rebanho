SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE VIEW vw_animais AS SELECT
    a.*,
    b.idade AS idade_entrada,
    b.numero_nota,
    b.serie_nota,
    c.confinamento,
    d.quadra,
    e.nome as fornecedor_razao,
    e.fazenda as fornecedor_fazenda,
    f.codigo as cod_caracteristica,
    f.descricao as caracteristica
 FROM animais a
    JOIN compras b
    ON a.compra_id = b.id
    JOIN confinamentos c
    ON a.confinamento_id = c.id
    JOIN quadras d
    ON a.quadra_id = d.id
    JOIN fornecedores e
    ON a.fornecedor_id = e.id
    JOIN caracteristicas f
    ON a.caracteristica_id = f.id;



