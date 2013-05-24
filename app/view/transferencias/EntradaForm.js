Ext.define('Rebanho.view.transferencias.EntradaForm' ,{
    extend: 'Ext.form.Panel',

    requires:[

    ],
    alias : 'widget.entradaform',

    iconCls: 'icon-application_form',

    layout: 'form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
            },
            // Items do FormPanel Principal
            items:[{
                xtype: 'fieldset',
                layout: 'form',
                items: [{
                    xtype:'hidden',
                    name: 'id',
                },{
                    xtype:'hidden',
                    name: 'destino',
                },{
                    xtype:'hidden',
                    name: 'animais',
                },{
                    xtype:'datefield',
                    fieldLabel:'Data da Entrada',
                    name: 'data_entrada',
                    format: 'd/m/y',
                    submitFormat: 'Y-m-d',
                    allowBlank: false,
                    flex: true,
                },{
                    xtype:'cmbquadras',
                    fieldLabel:'Quadra Destino',
                    name: 'quadra_id',
                    allowBlank: false,
                    flex: true,
                },{
                    xtype:'datefield',
                    fieldLabel:'Data da Saída',
                    name: 'data_saida',
                    format: 'd/m/y',
                    submitFormat: 'Y-m-d',
                    flex: true,
                    readOnly: true,
                },{
                    xtype:'cmbconfinamento',
                    fieldLabel:'Confinamento de Origem',
                    name: 'origem',
                    itemId: 'cmbOrigem',
                    flex: true,
                    readOnly: true,
                }]
            },{
                xtype: 'fieldset',
                layout: 'form',
                items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        xtype:'textfield',
                        fieldLabel:'Quantidade',
                        name: 'quantidade',
                        readOnly: true,
                        flex: true,
                    },{
                        xtype:'textfield',
                        fieldLabel:'Machos',
                        name: 'machos',
                        flex: true,
                        readOnly: true,
                        margins: '0 0 0 5',
                    },{
                        xtype:'textfield',
                        fieldLabel:'Femeas',
                        name: 'femeas',
                        flex: true,
                        readOnly: true,
                        margins: '0 0 0 5',
                    }]
                }]
            }]
        });

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                {
                    text: 'Iniciar Entrada',
                    iconCls: 'icon-add',
                    action: 'action_iniciarEntrada',
                    itemId: 'btnIniciarEntrada',
                    tooltip: 'Click para Começar a Pesar os Animais da Transferência.',
                },
                {
                    text: 'Finalizar Transferência',
                    iconCls: 'icon-tick',
                    action: 'action_finalizarEntrada',
                    itemId: 'btnFinalizarEntrada',
                    tooltip: 'Click para Finalizar a Transferência.',
                    disabled: true,
                },

            ]
        }]

        this.callParent(arguments);
    }
});