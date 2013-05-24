Ext.define('Rebanho.view.animais.AnimaisWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.animaiswindow',

    title: 'Cadastro De Animais',

    layout: 'fit',

    autoShow: true,

    width: 900,

    height: 400,

    modal: true,

    iconCls: 'icon-application_form',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.widget('animaisform'),
            ]
        });

        this.callParent(arguments);
    }
 });