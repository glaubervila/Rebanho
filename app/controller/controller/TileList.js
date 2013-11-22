Ext.define('TileViewer.controller.TileList', {
    extend: 'Ext.app.Controller',

    stores: [
        'Tiles',
    ],

    models: [
        'TileModel'
    ],

    views: [
        'tile_list.TileListGrid',
    ],

    init: function() {
        console.log("TileList - init()");

        this.control({

        })

    }
});

