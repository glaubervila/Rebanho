Ext.define('Rebanho.store.Usuarios', {
    extend: 'Ext.data.Store',
    
    model: 'Rebanho.model.Usuario',

    remoteSort: true,
    
    autoLoad: true,

    autoSync: true,
    
    proxy: {

        type: 'rest',
        url: 'php/Usuarios.php',
        reader: {
            root: 'usuarios',
            totalProperty: 'total'
        },

        writer: {
            type: 'json',
            root: 'usuarios',
            writeAllFields: true,
            encode: true,
            allowSingle: true,
        },
    },
});