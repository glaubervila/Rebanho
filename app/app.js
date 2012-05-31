Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext' : 'extjs/src',
        'Ext.ux' : 'extjs/ux',
    }
});

//Ext.Loader.setPath('Ext.ux', 'extjs/ux');

Ext.application({
    name: 'Rebanho',
    
    autoCreateViewport: true,

    views: [
        'Viewport',
    ],

    controllers: [
        'Teste',
        // Compras
        'Fornecedores',
        // Cadastros
        'Usuarios',
        'Caracteristicas',
        'Confinamentos',
        'Quadras',
        'Cepeas',
    ],

});