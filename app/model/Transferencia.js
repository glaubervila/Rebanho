Ext.define('Rebanho.model.Transferencia', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'transferencia',


    fields: [
        {name:'id'         , type: 'int'},
        {name:'status'     , type: 'int'},
        {name:'origem'     , type: 'int'},
        {name:'destino'    , type: 'int'},
        {name:'data_saida' , type: 'date', dateFormat: 'Y-m-d'},
        {name:'data_entrada', type: 'date', dateFormat: 'Y-m-d'},
        {name:'quantidade' , type: 'int'},
        {name:'machos'     , type: 'int'},
        {name:'femeas'     , type: 'int'},
        {name:'animais'    , type: 'string'},
        {name:'quadra_id'  , type: 'int'},
        // Facilitadores
        {name:'origem_nome'     , type: 'string'},
        {name:'destino_nome'    , type: 'string'},
        {name:'status_nome'    , type: 'string'},

    ],

});
