Ext.define('TileViewer.view.tile_mosaic.TileMosaicView',{
    extend: 'Ext.view.View',

    requires:[
        'Ext.PagingToolbar'
    ],

    layout:'fit',

    xtype: 'tilemosaicview',

    autoScroll:true,

    initComponent: function() {
        var me = this;

        me.store = 'Tiles';

        me.tpl = [
            '<tpl for=".">',
                '<div class="thumb-wrap" id="blacklisttile_{tilename:stripTags}">',
                    '<div class="thumb"><img src="{default_img}" title="{tilename:htmlEncode}"></div>',
                    '<span class="x-editable">{tilename:htmlEncode}</span>',
                '</div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        ];

        me.multiSelect = false,
        me.trackOver = true,
        me.overItemCls ='x-item-over',
        me.itemSelector = 'div.thumb-wrap',
        me.emptyText = 'No images to display',

        me.callParent(arguments);
    }
});