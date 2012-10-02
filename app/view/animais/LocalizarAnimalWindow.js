Ext.define('Rebanho.view.animais.LocalizarAnimalWindow' ,{
    extend: 'Ext.window.Window',

    alias : 'widget.localizaranimalwindow',

    title: 'Localizar Animal',

    layout: 'fit',

    autoShow: true,

    width: 250,

    height: 150,

    iconCls: 'icon-find',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, {

            items: [
                Ext.create('Ext.form.Panel',{
                    itemId:'formPesquisarAnimal',
                    fieldDefaults: {
                        labelAlign: 'top',
                        labelWidth: 100,
                    },
                    layout:'form',
                    bodyStyle:'padding:10px',
                    items:[
                    {
                        xtype: 'numberfield',
                        fieldLabel:'Digite o Código',
                        name: 'codigo',
                        itemId: 'txtCodigoAnimal',
                        allowBlank: false,
                        minValue: 0,
                        hideTrigger: true,
                        keyNavEnabled: false,
                        mouseWheelEnabled: false,
                        selectOnFocus    : true,
                        enableKeyEvents  : true,
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