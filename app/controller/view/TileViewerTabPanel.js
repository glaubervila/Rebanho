Ext.define('TileViewer.view.TileViewerTabPanel', {
    extend: 'Ext.tab.Panel',

    alias:'widget.tileviewertabpanel',

    requires: [
        'TileViewer.view.tile_list.TileListGrid'
    ],



    initComponent: function() {
        var me = this;

        me.layout = 'fit'

        me.items = [{
            xtype:'tilemosaic'
        },{
            xtype:'tilelist'
        }]


        me.callParent(arguments);
    }
});

