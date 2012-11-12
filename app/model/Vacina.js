Ext.define('Rebanho.model.Vacina', {

    extend: 'Ext.data.Model',

    alias: 'Vacina',

    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'status', type: 'int'},
        {name:'nome', type: 'string'},
        {name:'laboratorio', type: 'string'},
        {name:'lote', type: 'string'},
        {name:'fabricacao', type: 'string'},
        {name:'validade', type: 'string'},

        {name:'confinamento', type: 'string'},
        {name:'vacina', type: 'string'},
    ],


});