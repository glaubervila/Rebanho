Ext.define('Rebanho.model.ComprasReport', {

    extend: 'Ext.data.Model',

    alias: 'ComprasReport',

    fields: [
        {name:'data_inicial', type: 'date', dateFormat: 'Y-m-d' },
        {name:'data_final', type: 'date', dateFormat: 'Y-m-d' },
        {name:'fornecedor_id', type: 'int'},
        {name:'tipo_relatorio', type: 'int'},
    ],

});