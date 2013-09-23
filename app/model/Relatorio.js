Ext.define('Rebanho.model.Relatorio', {

    extend: 'Ext.data.Model',

    alias: 'Relatorio',

    fields: [
        {name:'confinamento_id', type: 'int'},
        {name:'status', type: 'int'},
        {name:'fornecedor_id', type: 'int'},
        {name:'data_inicial', type: 'date', dateFormat: 'Y-m-d' },
        {name:'data_final', type: 'date', dateFormat: 'Y-m-d' },
        {name:'quadra_id', type: 'int'},
        {name:'sexo', type: 'string'},
        
        {name:'group_by', type: 'string'},

    ],


});