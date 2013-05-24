Ext.define('Rebanho.view.relatorios.RelatoriosWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.relatorioswindow',

    title: 'Relatorios',

    layout: 'fit',

    autoShow: true,

    width: 400,

    height: 250,

    //iconCls: 'icon-',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('relatoriosform'),
            ]
        });

        this.callParent(arguments);
    }
 });