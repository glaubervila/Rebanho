Ext.define('Rebanho.view.transferencias.SaidaForm' ,{
    extend: 'Ext.form.Panel',

    requires:[

    ],
    alias : 'widget.saidaform',

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
                    name: 'animais',
                },{
                    xtype:'datefield',
                    fieldLabel:'Data da Transferência',
                    name: 'data_saida',
                    format: 'd/m/y',
                    submitFormat: 'Y-m-d',
                    allowBlank: false,
                    flex: true,
                },{
                    xtype:'cmbconfinamento',
                    fieldLabel:'Confinamento de Origem',
                    name: 'origem',
                    itemId: 'cmbOrigem',
                    allowBlank: false,
                    flex: true,
                },{
                    xtype:'cmbconfinamento',
                    fieldLabel:'Confinamento de Destino',
                    name: 'destino',
                    allowBlank: false,
                    flex: true,
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
                    text: 'Criar Transferência',
                    iconCls: 'icon-add',
                    action: 'action_criarTransferencia',
                    itemId: 'btnCriarTransferencia',
                    tooltip: 'Click para Cadastrar a Transferência e iniciar a pesagem dos animais.',
                },
                {
                    text: 'Finalizar Transferência',
                    iconCls: 'icon-tick',
                    action: 'action_finalizarTransferencia',
                    itemId: 'btnFinalizarTransferencia',
                    tooltip: 'Click para Finalizar a Transferência.',
                    disabled: true,
                },

            ]
        }]

        this.callParent(arguments);
    }
});