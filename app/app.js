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
        'usuarios',
        'caracteristicas'
    ],

    controllers: [
        'Teste',
        'Usuarios',
        'Caracteristicas'
    ],

});