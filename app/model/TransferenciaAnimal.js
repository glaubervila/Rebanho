Ext.define('Rebanho.model.TransferenciaAnimal', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'transferenciaanimal',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'int'},
        {name:'peso', type: 'float'},
        {name:'sexo', type: 'string'},
        {name:'quadra', type: 'string'},
        {name:'codigo', type: 'string'},
        {name:'idade', type: 'string'},
        {name:'sisbov', type: 'string'},
        // Campos Estrangeiros
        {name:'transferencia_id', type: 'int'},
        {name:'origem', type: 'int'},
        {name:'destino', type: 'int'},
        {name:'data_saida', type: 'date', dateFormat: 'Y-m-d'},
        {name:'data_entrada', type: 'date', dateFormat: 'Y-m-d'},
        {name:'codigo_antigo', type: 'string'},
    ],

});
