Ext.define('Rebanho.view.compras.fornecedores.FornecedoresWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.fornecedoreswindow',

    title: 'Cadastro Fornecedores',

    layout: 'fit',

    autoShow: true,

    width: 650,

    height: 520,

    iconCls: 'icon-user_suit',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('fornecedoresform'),
            ]
        });

        this.callParent(arguments);
    }
 });