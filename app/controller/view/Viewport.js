Ext.define('TileViewer.view.Viewport', {
    extend: 'Ext.container.Viewport',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border'
    ],

    layout: {
        type: 'border'
    },

    items: [{
        region: 'north',
        xtype: 'tileviewernorth',
    },{
        region: 'center',
        xtype: 'tileviewertabpanel',
    }]
});