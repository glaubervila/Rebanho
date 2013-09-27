Ext.define('Rebanho.view.vendas.VendasWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.vendaswindow',

    title: 'Cadastro Venda de Animais',

    layout: 'fit',

    autoShow: true,

    width: 900,

    height: 450,

    iconCls: 'icon-application_form',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('vendasform'),
            ]
        });

        this.callParent(arguments);
    }
 });