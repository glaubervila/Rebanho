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
                Ext.create('Ext.form.Panel',{
                    fieldDefaults: {
                        labelAlign: 'top',
                        labelWidth: 100,
                    },
                    layout:'form',
                    bodyStyle:'padding:4px',
                    items:[
                    {
                        xtype: 'numberfield',
                        name: 'codigo',
                        itemId: 'txtCodigoAnimal',
                        allowBlank: false,
                        minValue: 0,
                    },
                    ]
                    , buttons: [{
                        text: 'Pesquisar',
                        iconCls: 'icon-zoom',
                        action: 'action_pesquisar',
                        itemId: 'btnPesquisar',
                        tooltip: 'Click para Pesquisar um Registros Pelo Código.',
                    }]
                })
            ]
        });

        this.callParent(arguments);
    }
 });