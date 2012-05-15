Ext.define('Rebanho.store.Teste', {
    extend: 'Ext.data.Store',
    
    model: 'Rebanho.model.Teste',

    remoteSort: true,
    
    autoLoad: true,
    
    proxy: {
        // load using script tags for cross domain, if the data in on the same domain as
        // this page, an HttpProxy would be better
        type: 'ajax',
        url: 'php/Teste.php',
        reader: {
            root: 'rows',
            totalProperty: 'totalCount'
        },
    },
});