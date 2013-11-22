Ext.define('TileViewer.view.tile_mosaic.TileMosaicPanel',{
    extend: 'Ext.panel.Panel',

    requires:[
        'TileViewer.view.tile_mosaic.TileMosaicView'
    ],

    xtype: 'tilemosaic',

    layout: 'fit',

    title: 'Mosaic',

    requires: [
        'Ext.PagingToolbar'
    ],

    initComponent: function() {
        var me = this;

        me.store = 'Tiles';

        me.items = Ext.create('TileViewer.view.tile_mosaic.TileMosaicView', {});

        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items:{
                xtype:'bandfilter'
            }
        }]

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: 'Displaying tiles {0} - {1} of {2}',
            emptyMsg: "No tiles to display",
        });


        me.callParent(arguments);
    }
});