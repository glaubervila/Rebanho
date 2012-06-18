Ext.define('Rebanho.model.Caracteristica', {

    extend: 'Ext.data.Model',

    alias: 'Caracteristica',

    fields: [
        {name:'id', type: 'int'},
        {name:'codigo', type: 'string'},
        {name:'descricao', type: 'string'},
        {name:'cod_desc', type: 'string'},
    ],

//     validations: [
//         {type: 'presence',  field: 'codigo'},
//         {type: 'length',    field: 'codigo',      min: 1},
//         {type: 'length',    field: 'codigo',      max: 10},
//         {type: 'presence',  field: 'descricao'},
//         {type: 'length',    field: 'descricao',   min: 1},
//         {type: 'length',    field: 'descricao',   min: 45},
//     ]

});