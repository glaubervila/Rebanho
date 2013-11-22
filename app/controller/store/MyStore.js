Ext.define('TileViewer.store.MyStore', {
    extend: 'Ext.data.Store',


    autoSync: true,
    
    initComponent: function() {
        var me = this;

        console.log("Teste");

        me.callParent(arguments);
    }

});