Ext.define('Rebanho.view.compras.animais.EntradaAnimaisForm' ,{
    extend: 'Ext.form.Panel',

    requires:[ ],

    alias : 'widget.entradaanimaisform',

    bodyStyle:'padding:10px;',

    iconCls: 'icon-application_form',

    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            fieldDefaults: {
                labelAlign: 'top',
            },
            items: [
            {
                xtype: 'fieldset',
                defaultType: 'textfield',
                defaults: {
                    anchor: '-5',
                },
                items: [
                {
                    fieldLabel: 'Código',
                    name: 'codigo',
                    allowBlank: false,
                    itemId: 'txtcodigo',
                },
                {
                    fieldLabel: 'Peso',
                    name: 'nome',
                    allowBlank: false,
                    itemId: 'txtpeso',
                }]
            }],            // Barra e Menus
            tbar:{
                items:[
                ]
            }

        });

        this.callParent(arguments);

    }
 }); 