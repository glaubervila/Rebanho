Ext.define('Rebanho.model.PesagensReport', {

    extend: 'Ext.data.Model',

    alias: 'PesagensReport',

    fields: [
        {name:'confinamento_id', type: 'int'},
        {name:'data_inicial', type: 'date', dateFormat: 'Y-m-d' },
        {name:'data_final', type: 'date', dateFormat: 'Y-m-d' },
        {name:'tipo_relatorio', type: 'int'},
        {name:'quadra_id', type: 'int'},
        {name:'sexo', type: 'string'},
        {name:'peso_comparacao', type: 'string'},
        {name:'peso', type: 'float'},
        {name:'idade_comparacao', type: 'string'},
        {name:'idade', type: 'string'},
    ],

});