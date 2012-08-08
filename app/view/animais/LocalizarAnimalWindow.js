Ext.define('Rebanho.view.animais.LocalizarAnimalWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.localizaranimalwindow',

    title: 'Localizar Animal',

    layout: 'fit',

    autoShow: true,

    width: 400,

    height: 200,

    iconCls: 'icon-find',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                
            ]
        });

        this.callParent(arguments);
    }
 });