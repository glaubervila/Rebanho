Ext.define('Rebanho.model.CompraAnimal', {

    extend: 'Ext.data.Model',

    alias: 'CompraAnimal',

    fields: [
        {name:'id', type: 'int'},
        {name:'fornecedor_id', type: 'int'},
        {name:'caracteristica_id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'int'},
        {name:'data_compra', type: 'date', dateFormat: 'Y-m-d'},
        {name:'numero_nota', type: 'string'},
        {name:'serie_nota', type: 'string'},
        {name:'status', type: 'string'},
        {name:'quantidade', type: 'int'},
        {name:'valor_nota', type: 'float'},
        {name:'data_pesagem', type: 'date', dateFormat: 'Y-m-d' },
        {name:'peso_entrada', type: 'float', convert:function(value,record){
            // Colocar KG no Final do Campo
            peso = value + ' Kg';
            return peso;
        }},
        {name:'peso_saida', type: 'float'},
        {name:'classificacao', type: 'string'},
        {name:'escore', type: 'string'},
        {name:'idade', type: 'string'},
        {name:'qtd_machos', type: 'int'},
        {name:'qtd_femeas', type: 'int'},
        {name:'corretor', type: 'string'},
        {name:'valor_comissao', type: 'float'},
        {name:'frete', type: 'string'},
        {name:'valor_frete', type: 'float'},
        {name:'imposto', type: 'string'},
        {name:'valor_imposto', type: 'float'},
        {name:'valor_arroba', type: 'float'},
        {name:'premio', type: 'string'},
        {name:'observacao', type: 'string'},
        {name:'valor_kg_vivo', type: 'float'},
        {name:'peso_medio', type: 'float', convert:function(value,record){
            // Colocar KG no Final do Campo
            peso = value + ' Kg';
            return peso;
        }},
        {name:'diferenca_total', type: 'float', convert:function(value,record){
            // Colocar KG no Final do Campo
            diferenca = value + ' Kg';
            return diferenca;
        }},
        {name:'diferenca_media', type: 'float', convert:function(value,record){
            // Colocar KG no Final do Campo
            diferenca = value + ' Kg';
            return diferenca;
        }},
//         // Campos Estrangeiros Para a Grid
        {name:'fornecedor_nome', type: 'string'},
        {name:'fornecedor_fazenda', type: 'string'},
        {name:'confinamento_nome', type: 'string'},
        {name:'status_nome', type: 'string'},
    ],


});