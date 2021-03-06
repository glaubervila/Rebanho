Ext.define('Rebanho.view.animais.AnimaisForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
        'Rebanho.view.cadastros.caracteristicas.CaracteristicasCombo',
        'Rebanho.view.cadastros.quadras.QuadrasCombo',
        'Rebanho.view.compras.fornecedores.FornecedoresTriggerField',
        'Ext.ux.form.FieldMoney',
        'Ext.ux.form.fieldstarrating.FieldStarRating',

        // Grid de Ocorrencias por Animais
        'Rebanho.view.ocorrencias.OcorrenciasPorAnimalGrid',

        // Estatisticas
        'Rebanho.view.animais.AnimaisEstatisticasPanel',
    ],
    alias : 'widget.animaisform',

    iconCls: 'icon-application_form',

    layout: 'fit',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
            },
            // Items do FormPanel Principal
            items:[{
                xtype:'tabpanel',
                itemId: 'animalFormTabPanel',
                activeTab: 0,
                border: false,
                // Itens do Tab Panel
                items:[
                // INICIO Aba de Informacoes
                {
                    title: 'Informações do Animal',
                    layout: 'border',
                    // Itens do Panel de Informacoes
                    items: [
                    // INICIO Painel Central de Informacoes
                    {
                        title: '',
                        region: 'center',
                        xtype: 'panel',
                        layout: 'form',
                        margins: '5',
                        bodyStyle:'padding:10px',
                        items: [
                        // INICIO Itens do Painel Central
                        {
                            xtype: 'fieldset',
                            title: 'Dados do Animal',
                            items: [{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'textfield',
                                    fieldLabel:'Codigo Atual',
                                    name: 'codigo',
                                    //width: 200,
                                    readOnly: true,
                                    flex: 1,
                                },{
                                    xtype:'combobox',
                                    fieldLabel:'Status',
                                    name: 'status',
                                    width: 100,
                                    margins: '0 0 0 5',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    selectOnTab: true,
                                    readOnly: true,
                                    hideTrigger: true,
                                    store: [
                                        ['0','Morto'],
                                        ['1','Ativo'],
                                        ['2','Vendido'],
                                    ],
                                    flex: 1,
                                },{
                                    xtype:'combobox',
                                    fieldLabel:'Sexo',
                                    name: 'sexo',
                                    width: 50,
                                    margins: '0 0 0 5',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    selectOnTab: true,
                                    readOnly: true,
                                    hideTrigger: true,
                                    store: [
                                        ['F','F'],
                                        ['M','M'],
                                    ],
                                    flex: 1,
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'cmbcaracteristicas',
                                    fieldLabel:'Caracteristica',
                                    name: 'caracteristica_id',
                                    width: 250,
                                    readOnly: true,
                                    hideTrigger: true,
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Idade',
                                    name: 'idade',
                                    flex: 1,
                                    margins: '0 0 0 5',
                                    readOnly: true,
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'cmbconfinamento',
                                    fieldLabel:'Confinamento',
                                    name: 'confinamento_id',
                                    width: 200,
                                    readOnly: true,
                                    hideTrigger: true,
                                },{
                                    xtype:'cmbquadras',
                                    fieldLabel:'Quadra',
                                    name: 'quadra_id',
                                    flex:1,
                                    readOnly: true,
                                    hideTrigger: true,
                                    margins: '0 0 0 5',
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
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
                                    width: 125,
                                    readOnly: true,
                                },{
                                    fieldLabel : 'Escore',
                                    xtype : 'ratingfield',
                                    name  : 'escore',
                                    value : 3,
                                    items : [1, 2, 3, 4, 5],
                                    margins: '0 0 0 5',
                                    width: 130,
                                    readOnly: true,
                                }]
                            }]
                        // FIM Fieldset Dados Animais
                        },
                        // FIM Itens do Painel Central
                        ]
                    },
                    // FIM  Painel Central de Informacoes
                    // INICIO Painel Lateral de Pesagens
                    ,{
                        title: '',
                        region:'east',
                        xtype: 'panel',
                        margins: '5',
                        width: 500,
                        layout: 'fit',
                        items:[{
                            xtype: 'pesagensporanimalgrid',
                            title: '',
                        }]
                    // FIM do Painel Lateral de Pesagens
                    }
                    ]
                },
                // FIM da Aba de Informacoes
                // INICIO Aba de Origem
                {
                    title: 'Origem do Animal',
                    layout: 'fit',
                    bodyStyle:'padding:10px',
                    // Itens da Aba de Origem
                    items: [
                    // INICIO fieldset de Compra
                    {
                        xtype: 'fieldset',
                        title: 'Dados da Compra',
                        items: [{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'triggerfieldfornecedores',
                                fieldLabel:'Fornecedor',
                                name: 'fornecedor',
                                width: 300,
                                readOnly: true,
                                hideTrigger: true,
                            },{
                                xtype:'datefield',
                                fieldLabel:'Data Entrada',
                                name: 'data_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                                readOnly: true,
                                hideTrigger: true,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Idade Entrada',
                                name: 'idade_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                                readOnly: true,
                            }]
                        },{
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            fieldDefaults: {
                                labelAlign: 'top',
                            },
                            items:[{
                                xtype:'textfield',
                                fieldLabel:'Nota Fiscal',
                                name: 'numero_nota',
                                width: 100,
                                readOnly: true,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Serie',
                                name: 'serie_nota',
                                width: 100,
                                margins: '0 0 0 5',
                                readOnly: true,
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Valor Arroba',
                                name: 'valor_arroba',
                                width: 100,
                                margins: '0 0 0 5',
                                readOnly: true,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Peso Entrada',
                                name: 'peso_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                                readOnly: true,
                            }]
                        }]
                    // FIM do fieldset de Compra
                    }
                    // FIM dos Itens da Aba de Origem
                    ]
                },
                // FIM da Aba de Origem

                // INICIO Aba de Ocorrencias
                {
                    title: 'Ocorrências do Animal',
                    layout: 'fit',
                    // Itens da Aba de Ocorrencias
                    items: [
                    {
                        xtype: 'ocorrenciasporanimalgrid',
                        title: '',
                    }
                    // FIM dos Itens da Aba de Ocorrencias
                    ]
                },
                // INICIO Aba de Estatisticas do Animal
                {
                    title: 'Estatísticas',
                    layout: 'fit',
                    // Itens da Aba de Ocorrencias
                    items: [
                    {
                        xtype: 'animaisestatisticas',
                        title: '',
                    }
                    // FIM dos Itens da Aba de Ocorrencias
                    ]
                }

                // FIM da Aba de Ocorrencias
                ]
                // FIM do TabPanel
            }]
            // FIM do FormPanel Principal
        });

        this.callParent(arguments);
    }
 });