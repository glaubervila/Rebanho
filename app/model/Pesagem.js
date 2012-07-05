Ext.define('Rebanho.model.Pesagem', {

    extend: 'Ext.data.Model',

    requires : [],

    alias: 'pesagem',


    fields: [
        {name:'id', type: 'int'},
        {name:'confinamento_id', type: 'string'},
        {name:'quadra_id', type: 'string'},
        {name:'animal_id', type: 'string'},
        {name:'data', type: 'date', dateFormat: 'Y-m-d' },
        {name:'peso', type: 'float'},
        {name:'tipo', type: 'string'},
    ],
    
    validations: [
        {type: 'presence',  field: 'confinamento_id'},
        {type: 'presence',  field: 'quadra_id'},
        {type: 'presence',  field: 'animal_id'},
        {type: 'presence',  field: 'data'},
        {type: 'presence',  field: 'peso'},
        {type: 'presence',  field: 'tipo'},
    ]

});
