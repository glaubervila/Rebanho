Ext.define('TileViewer.view.tile_mosaic.BandFilter',{
    extend: 'Ext.container.ButtonGroup',

    xtype: 'bandfilter',
    
    initComponent: function() {
        var me = this;

        me.addEvents(

        /**
            * @event onfilter
            * Fires when the 'pressed' state of this button changes
            * @param {String} [filter] Selected filter
            * @param {Ext.button.Button} [button] button selected
            * @param {Ext.container.ButtonGroup} [buttongroup]
            */
         'onfilter'
        );

        me.items = [
            { xtype: 'button', text: 'g', value:'g'},
            { xtype: 'button', text: 'r', value:'r'},
            { xtype: 'button', text: 'i', value:'i'},
            { xtype: 'button', text: 'z', value:'z'},
            { xtype: 'button', text: 'Y', value:'y'},
            { xtype: 'button', text: 'gri', value:'gri'},
            { xtype: 'button', text: 'riz', value:'riz'},
            { xtype: 'button', text: 'izY', value:'izy'},
            { xtype: 'button', text: 'RGB', value:'rgb', pressed:true}
        ];

        me.defaults = {
            //allowDepress:false,
            toggleGroup: "bands",
            toggleHandler: function(btn) {
                if(btn.pressed){
                    var filter = btn.value;
                    console.log(filter);
                    me.fireEvent('onfilter', filter, button, me);
                }
            }
        }
        
        me.callParent(arguments);
    }
});