Ext.define('TileViewer.view.tile_list.TileListGrid',{
    extend: 'Ext.grid.Panel',
    alias : 'widget.tilelist',

    layout: 'fit',
    title: 'List',

    requires: [
        'Ext.PagingToolbar'
    ],

    initComponent: function() {
        var me = this;



        me.store = 'Tiles';

        me.columns = [{
            text: 'Tile Name',
            dataIndex: 'tilename',
            renderer: function(value,obj) {
                return Ext.String.format('<a href="#" >{0}</a>', value);
            } 
        },{
            text: 'RA (deg)',
            dataIndex: 'ra'
        },{ 
            text: 'Dec (deg)',
            dataIndex: 'dec'
        },{ 
            text: 'Status',
            dataIndex: 'flag_reject',
            width:60,
            align: 'center',
            renderer: function(value,obj) {
                if (value){
                    return '<img src="/static/images/warning.gif" style="border-width:0px;" alt="Tile in Blacklist" title="Tile in Blacklist"/>';
                }
            } 
        },{
            text: 'Comments',
            dataIndex: 'comments',
            align: 'center',
            width:80,
            renderer: function(value,obj) {
                return '<a href="#" >'+value+'</a>'
            } 
        },{
            text: 'Last Comment',
            dataIndex: 'last_comment',
            flex:1
        }];

        me.tbar = [{
            xtype: 'button',
            text: 'Download',
            disabled:true
        }];


        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: 'Displaying tiles {0} - {1} of {2}',
            emptyMsg: "No tiles to display",
        }),


        me.callParent(arguments);
    }
});



// //     bbar: Ext.create('Ext.PagingToolbar', {
// //         store: 'TileListStore',
// //         displayInfo: true,
// //         displayMsg: 'Displaying tiles {0} - {1} of {2}',
// //         emptyMsg: "No tiles to display",
// //     }),
//     listeners: {
//         cellclick: function(grid,td,cellIndex,record){
//             // ao clicar em uma celula 
//             // So exibe a janela de detalhe se clicar na cell com nome da tile
//             if (cellIndex == 0) {
//                 showTileDetail(record);
//             }
//             if (cellIndex == 4) {
//                 // Comments
//                 showTileComments(record);
//             }
//             if (cellIndex == 5) {
//                 // Last Comments
//                 showTileComments(record);
//             }
//         }
//     }
// });
