Ext.define('Rebanho.store.Usuarios', {
    extend: 'Ext.data.Store',
    
    model: 'Rebanho.model.Usuario',

    remoteSort: true,
    
    autoLoad: true,

    autoSync: true,
    
    proxy: {

        type: 'rest',
        url: 'php/usuarios.php',
        reader: {
            root: 'usuarios',
            totalProperty: 'totalCount'
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