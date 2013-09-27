Ext.define('Rebanho.model.Venda', {

    extend: 'Ext.data.Model',

    alias: 'Venda',

    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'confinamento', type: 'string'},
        {name:'cliente_id', type: 'int'},
        {name:'cliente_nome', type: 'string'},
        {name:'cliente_razao_social', type: 'string'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d'},
        {name:'quantidade', type: 'int'},
        {name:'qtd_machos', type: 'int'},
        {name:'qtd_femeas', type: 'int'},
        {name:'status', type: 'string'},
        {name:'numero_nota', type: 'string'},
        {name:'serie_nota', type: 'string'},
        {name:'valor_nota', type: 'float'},
        {name:'peso_saida', type: 'float'},
        {name:'peso_medio', type: 'float'},
        {name:'maior_peso', type: 'float'},
        {name:'menor_peso', type: 'float'},
        {name:'permanencia_media', type: 'float'},
        {name:'ganho_medio', type: 'float'},


    ],

});
