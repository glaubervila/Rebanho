Ext.define('TileViewer.store.Tiles', {
    extend: 'TileViewer.store.MyStore',

    autoLoad:true,

    model: 'TileViewer.model.TileModel',

    pageSize: 100,

    requires:[
        'Ext.data.proxy.JsonP'
    ],

    proxy: {
        type: 'ajax',
        url: 'view_tile_mosaic_json?tag_id=9&field_id=6',
        reader: {
            type: 'json',
            root: 'tiles',
            totalProperty: 'totalCount'
        },
    },

});
