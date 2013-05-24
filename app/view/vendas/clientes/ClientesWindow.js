Ext.define('Rebanho.view.vendas.clientes.ClientesWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.clienteswindow',

    title: 'Cadastro de Clientes',

    layout: 'fit',

    autoShow: true,

    width: 650,

    height: 520,

    iconCls: 'icon-group',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('clientesform'),
            ]
        });

        this.callParent(arguments);
    }
 });