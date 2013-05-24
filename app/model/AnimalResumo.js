Ext.define('Rebanho.model.AnimalResumo', {

    extend: 'Ext.data.Model',

    requires : [
    ],

    alias: 'animalresumo',

    fields: [
        {name:'confinamento_id', type: 'int'},
        {name:'confinamento', type: 'string'},
        {name:'quadra_id', type: 'int'},
        {name:'quadra', type: 'string'},
        {name:'quantidade_total', type: 'int'},
        {name:'quantidade_machos', type: 'int'},
        {name:'quantidade_femeas', type: 'int'},
        {name:'peso_medio', type: 'float'},
        {name:'peso_minimo', type: 'float'},
        {name:'peso_maximo', type: 'float'},
        {name:'dt_ultima_pesagem' ,type: 'date', dateFormat: 'Y-m-d'},
        {name:'media_confinamento' , type: 'string'},
        {name:'total_ativo' , type: 'int'},
    ],

});


