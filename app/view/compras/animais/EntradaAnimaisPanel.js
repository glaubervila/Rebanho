Ext.define('Rebanho.view.compras.animais.EntradaAnimaisPanel' ,{
    extend: 'Ext.panel.Panel',

    alias : 'widget.entradaanimaispanel',

    title: 'Entrada de Animais',

    layout: 'border',

    iconCls: 'icon-group_gear',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                {
                    xtype: 'entradaanimaisgrid',
                    region: 'center',
                },
            ]
        });

        this.callParent(arguments);
    }
 });