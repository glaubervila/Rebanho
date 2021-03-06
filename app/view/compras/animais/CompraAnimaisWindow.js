Ext.define('Rebanho.view.compras.animais.CompraAnimaisWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.compraanimaiswindow',

    title: 'Cadastro de Compra de Animais',

    layout: 'fit',

    autoShow: true,

    width: 750,

    height: 400,

    iconCls: 'icon-application_form',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('compraanimaisform'),
            ]
        });

        this.callParent(arguments);
    }
 });