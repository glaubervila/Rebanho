Ext.define('Rebanho.model.TransferenciaAnimal', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'transferenciaanimal',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'int'},
        {name:'quadra_id', type: 'string'},
        {name:'peso', type: 'float'},
        {name:'sexo', type: 'string'},
        {name:'quadra', type: 'string'},
        {name:'codigo', type: 'string'},
        {name:'idade', type: 'string'},
    ],

    validations: [
        {type: 'presence',  field: 'confinamento_id'},
        {type: 'presence',  field: 'quadra_id'},
        {type: 'presence',  field: 'animal_id'},
        {type: 'presence',  field: 'data'},
        {type: 'presence',  field: 'peso'},
        {type: 'presence',  field: 'tipo'},
    ],



});
