Ext.define('Rebanho.store.Logged', {
    extend: 'Rebanho.store.MyStore',

    autoLoad:true,

    proxy: {

        type: 'rest',
        url: 'php/main.php',
        extraParams:{
            classe: 'Usuarios',
            action: 'isLogged',
        },
        reader: {
            type: 'json',
            root: 'data',
        },

    },
    fields: [
        {name:'user_id', type: 'int'},
        {name:'user_name', type: 'string' },
        {name:'user_confinamento', type: 'int'},
        {name:'confinamento', type: 'string'},
    ],


});