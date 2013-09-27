Ext.define('Rebanho.view.vendas.VendasForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
        'Rebanho.view.compras.fornecedores.FornecedoresTriggerField',
        'Ext.ux.form.FieldMoney',
    ],
    alias : 'widget.vendasform',

    iconCls: 'icon-application_form',

    layout:'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            defaultType:'textfield',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            items:[{
                xtype:'tabpanel',
                activeTab: 0,
                border: false,
                items:[{
                    title    : 'Informa&ccedil;&otilde;es da Nota',
                    border :false,
                    //bodyStyle:'padding:4px;',
                    layout:'column',
                    items:[{
                        // Coluna 1
                        columnWidth:0.4,
                        border:true,
                        tbar:[{
                            text: 'Criar Nota de Venda',
                            iconCls: 'icon-add',
                            action: 'action_criarTransferencia',
                            itemId: 'btnCriarTransferencia',
                            tooltip: 'Click para Cadastrar a Transferência e iniciar a pesagem dos animais.',
                        },
                        {
                            text: 'Finalizar Venda',
                            iconCls: 'icon-tick',
                            action: 'action_finalizarTransferencia',
                            itemId: 'btnFinalizarTransferencia',
                            tooltip: 'Click para Finalizar a Transferência.',
                            disabled: true,
                        }],
                        items:[{
                            xtype: 'fieldset',
                            defaultType:'textfield',
                            defaults: {
                                anchor: '-5',
                            },
                            items:[{
                                name: 'id',
                                hidden: true,
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'cmbconfinamento',
                                    itemId: 'vendas_cmbConfinamento',
                                    fieldLabel:'Confinamento',
                                    name: 'confinamento_id',
                                    width: 200,
                                    allowBlank: false,
                                },{
                                    xtype: 'datefield',
                                    itemId: 'dtfDataCompra',
                                    fieldLabel:'Data da Venda',
                                    name: 'data',
                                    flex: 1,
                                    margins: '0 0 0 5',
                                    allowBlank: false,
                                    format: 'd/m/y',
                                    submitFormat: 'Y-m-d',
                                }]
                            },{
                                xtype: 'triggerfieldfornecedores',
                                fieldLabel:'Forncedor',
                                name: 'fornecedor_id',
                                itemId: 'cmbFornecedores',
                                flex: 1,
                                lastQuery:'',
                                disabled: true,
                                allowBlank: false,
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    fieldLabel:'Nota',
                                    name: 'numero_nota',
                                    flex: 1,
                                    allowBlank: false,
                                    maxLength: 20,
                                },{
                                    fieldLabel:'Série',
                                    name: 'serie_nota',
                                    margins: '0 0 0 5',
                                    maxLength: 5,
                                    width: 60,
                                },{
                                    xtype: 'field-money',
                                    fieldLabel:'Valor da Nota',
                                    name: 'valor_nota',
                                    symbolStay : false,
                                    allowBlank: false,
                                    flex: 1,
                                    margins: '0 0 0 5',
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    fieldLabel:'Qtd Animais',
                                    name: 'quantidade',
                                    flex: 1,
                                },{
                                    fieldLabel:'Peso Saída',
                                    name: 'peso_saida',
                                    flex: 1,
                                    margins: '0 0 0 5',
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    fieldLabel:'Qtd Machos',
                                    name: 'qtd_machos',
                                    flex: 1,
                                },{
                                    fieldLabel:'Qtd Femeas',
                                    name: 'qtd_femeas',
                                    margins: '0 0 0 5',
                                    flex: 1,
                                }]
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaultType:'textfield',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                fieldLabel:'Corretor',
                                name: 'corretor',
                                flex: 1,
                                maxLength: 45,
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Comissão',
                                name: 'valor_comissao',
                                margins: '0 0 0 5',
                                flex: 1,
                                maxLength: 12,
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaultType:'textfield',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                fieldLabel:'Frete',
                                name: 'frete',
                                flex: 1,
                                maxLength: 45,
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Valor Frete',
                                name: 'valor_frete',
                                margins: '0 0 0 5',
                                flex: 1,
                                maxLength: 12,
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            defaultType:'textfield',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                fieldLabel:'Imposto',
                                name: 'imposto',
                                flex: 1,
                                maxLength: 45,
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Valor Imposto',
                                name: 'valor_imposto',
                                margins: '0 0 0 5',
                                flex: 1,
                            }]
                        }],
                    }
                    // Coluna 2
                    ,{
                        columnWidth:0.6,
                        border:false,
                        items:[{
                            title    : 'Pesagem de Entrada',
                            border   :false,
                            layout:'fit',
                            items:[{
                                xtype:'entradaanimaislist',
                            }]
                        }]
                    }]
                },{
                    title    : 'Estatísticas da Nota',
                    border :false,
                    //bodyStyle:'padding:4px;',
                    layout:'form',
                    items:[{
                        xtype: 'fieldset',
                        defaultType:'textfield',
                        items:[{
                            xtype: 'datefield',
                            fieldLabel:'Data de Entrada',
                            name: 'data_pesagem',
                            width: 200,
                            format: 'd/m/y',
                            submitFormat: 'Y-m-d',
                            readOnly: true,
                        },{
                            fieldLabel:'Peso Entrada',
                            name: 'peso_entrada',
                            width: 200,
                            readOnly: true,
                        },{
                            fieldLabel:'Peso Medio',
                            name: 'peso_medio',
                            width: 200,
                            readOnly: true,
                        },{
                            xtype: 'field-money',
                            fieldLabel:'Valor Kg Vivo',
                            name: 'valor_kg_vivo',
                            width: 200,
                            readOnly: true,
                        },{
                            fieldLabel: 'Diferença Saída/Entrada',
                            name: 'diferenca_total',
                            width: 200,
                            readOnly: true,
                        },{
                            fieldLabel:'Diferença Média Por Animal',
                            name: 'diferenca_media',
                            width: 200,
                            readOnly: true,
                        }]
                    }]
                }]
            }],
 
        });

        this.callParent(arguments);

    }
 }); 