Ext.define('Rebanho.view.compras.animais.CompraAnimaisForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
        'Rebanho.view.cadastros.caracteristicas.CaracteristicasCombo',
        'Rebanho.view.cadastros.cepea.CepeasCombo',
        'Rebanho.view.cadastros.quadras.QuadrasCombo',
        'Rebanho.view.compras.fornecedores.FornecedoresTriggerField',
        'Ext.ux.form.FieldMoney',
        'Ext.ux.form.fieldstarrating.FieldStarRating',
    ],
    alias : 'widget.compraanimaisform',

    bodyStyle:'padding:5px;',

    iconCls: 'icon-application_form',

    layout:'column',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            defaultType:'textfield',
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            defaults:{
                layout:'form',
                bodyStyle:'padding:4px',
            },
            items:[{
                // Coluna 1
                columnWidth:0.5,
                border:false,
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
                            fieldLabel:'Confinamento',
                            name: 'confinamento_id',
                            width: 200,
                            allowBlank: false,
                        },{
                            xtype: 'datefield',
                            fieldLabel:'Data da Compra',
                            name: 'data_compra',
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
                        maxLength: 10,
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
                        maxLength: 10,
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
                columnWidth:0.5,
                border:false,
                items:[{
                    xtype: 'fieldset',
                    defaultType:'textfield',
                    defaults: {
                        anchor: '-5',
                    },
                    items:[{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            fieldLabel:'Peso Entrada',
                            name: 'peso_entrada',
                            flex: 1,
                        },{
                            xtype: 'datefield',
                            fieldLabel:'Data de Entrada',
                            name: 'data_pesagem',
                            margins: '0 0 0 5',
                            flex: 1,
                            format: 'd/m/y',
                            submitFormat: 'Y-m-d',
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
                    },
                    {
                        xtype: 'cmbcaracteristicas',
                        fieldLabel:'Características',
                        name: 'caracteristica_id',
                        anchor: '-5',
                        allowBlank: false,
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            fieldLabel : 'Classificação',
                            xtype : 'ratingfield',
                            name  : 'classificacao',
                            value : 'Regular',
                            items : ['Pessima', 'Ruim', 'Regular', 'Boa', 'Otima'],
                            margins: '0 0 0 5',
                            flex: 1,
                        },{
                            fieldLabel : 'Escore',
                            xtype : 'ratingfield',
                            name  : 'escore',
                            value : 3,
                            items : [1, 2, 3, 4, 5],
                            margins: '0 0 0 5',
                            flex: 1,
                        },]
                    },
                    ,{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            xtype: 'cmbquadras',
                            fieldLabel:'Quadra',
                            name: 'quadra_id',
                            itemId: 'cmbQuadras',
                            flex: 1,
                            lastQuery:'',
                            disabled: true,
                        },{
                            fieldLabel:'Idade',
                            name: 'idade',
                            margins: '0 0 0 5',
                            flex: 1,
                        }]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        defaultType:'textfield',
                        fieldDefaults: {
                            labelAlign: 'top',
                        },
                        items:[{
                            xtype: 'cmbcepeas',
                            fieldLabel:'Valor Arroba',
                            name: 'valor_arroba',
                            flex: 1,
                        },{
                            fieldLabel:'Premio',
                            name: 'premio',
                            margins: '0 0 0 5',
                            flex: 1,
                        }]
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel:'Observação',
                        name: 'observacao',
                        maxLength: 250,
                        anchor: '-5',
                        height: 60,
                    }],
                }]
            }],
            // Barra e Menus
            tbar:{
                items:[{
                    xtype: 'button',
                    text: 'Novo',
                    action: 'action_novo',
                    iconCls: 'icon-add',
                },{
                    xtype: 'button',
                    text: 'Excluir',
                    action: 'action_excluir_form',
                    iconCls: 'icon-cross',
                },{
                    xtype: 'button',
                    text: 'Salvar',
                    action: 'action_salvar',
                    iconCls: 'icon-disk',
                    tooltip: 'Click para <font color="blue"><b>Salvar</b></font> as Informações.'
                },
                '->',
                {
                    xtype: 'button',
                    text: 'Cancelar',
                    action: 'action_cancelar',
                    iconCls: 'icon-cancel',
                    tooltip: 'Click para <font color="red"><b>Abandonar</b></font> a Janela de Cadastro<br>Nenhuma informação será Gravada e o Cadastro será Fechado.'
                }]
            }

        });

        this.callParent(arguments);

    }
 }); 