Ext.define('Rebanho.view.cadastros.vacinas.VacinasWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.vacinaswindow',

    title: 'Cadastro de Vacinas',

    layout: 'fit',

    autoShow: true,

    width: 400,

    height: 250,

    iconCls: 'icon-pill',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('vacinasform'),
            ]
        });

        this.callParent(arguments);
    }
 });