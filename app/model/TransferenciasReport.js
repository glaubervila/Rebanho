Ext.define('Rebanho.model.TransferenciasReport', {

    extend: 'Ext.data.Model',

    alias: 'TransferenciasReport',

    fields: [
        {name:'confinamento_id', type: 'int'},
        {name:'data_inicial', type: 'date', dateFormat: 'Y-m-d' },
        {name:'data_final', type: 'date', dateFormat: 'Y-m-d' },
        {name:'tipo_relatorio', type: 'int'},
    ],

});