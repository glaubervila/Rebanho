Ext.define('Rebanho.model.Usuario', {

    extend: 'Ext.data.Model',

    alias: 'Usuario',

    proxy: {
        type: 'rest',
        url : 'php/usuarios.php',

        writer: {
            type: 'json', //json ou xml
            root: 'usuarios',
            writeAllFields: true,
            encode: true,
            allowSingle: true,
        },
    },
    
    fields: [
        'id',
        'nome',
        'login',
        'senha',
        'email',
    ],
});