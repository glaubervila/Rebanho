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
                                    width: 200,
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'SisBov',
                                    name: 'sisbov',
                                    width: 200,
                                    margins: '0 0 0 5',
                                },{
                                    xtype:'combobox',
                                    fieldLabel:'Status',
                                    name: 'status',
                                    width: 100,
                                    margins: '0 0 0 5',
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
                                },{
                                    xtype:'cmbcaracteristicas',
                                    fieldLabel:'Caracteristica',
                                    name: 'caracteristica_id',
                                    margins: '0 0 0 5',
                                    width: 250,
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Sexo',
                                    name: 'sexo',
                                    width: 50,
                                    margins: '0 0 0 5',
                                }]
                            },{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'cmbquadras',
                                    fieldLabel:'Quadra',
                                    name: 'quadra_id',
                                    width: 190,
                                },{
                                    fieldLabel : 'Classificação',
                                    xtype : 'ratingfield',
                                    name  : 'classificacao',
                                    value : 'Regular',
                                    items : ['Pessima', 'Ruim', 'Regular', 'Boa', 'Otima'],
                                    margins: '0 0 0 5',
                                    width: 130,
                                },{
                                    fieldLabel : 'Escore',
                                    xtype : 'ratingfield',
                                    name  : 'escore',
                                    value : 3,
                                    items : [1, 2, 3, 4, 5],
                                    margins: '0 0 0 5',
                                    width: 130,
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Idade',
                                    name: 'quadra_id',
                                    width: 50,
                                }]
                            }]
                        // FIM Fieldset Dados Animais
                        },
                        // INICIO fieldset Estatisticas
                        {
                            xtype: 'fieldset',
                            title: 'Estatísticas do Animal',
                            items: [{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                items:[{
                                    xtype:'textfield',
                                    fieldLabel:'Neste Conf.',
                                    name: 'dias_confinamento',
                                    width: 80,
                                    margins: '0 0 0 5',
                                },{
                                    xtype:'datefield',
                                    fieldLabel:'Ultima Pesagem',
                                    name: 'data_ultima_pesagem',
                                    width: 100,
                                    margins: '0 0 0 5',
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Peso Recente',
                                    name: 'peso_atual',
                                    width: 100,
                                    margins: '0 0 0 5',
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Peso Ganho',
                                    name: 'peso_ganho',
                                    width: 100,
                                    margins: '0 0 0 5',
                                },{
                                    xtype:'textfield',
                                    fieldLabel:'Ganho Diário',
                                    name: 'ganho_diario',
                                    width: 100,
                                    margins: '0 0 0 5',
                                }]
                            }]
                        // FIM fieldset Estatisticas
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
                        width: 250,
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
                            },{
                                xtype:'datefield',
                                fieldLabel:'Data Entrada',
                                name: 'data_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Idade Entrada',
                                name: 'idade',
                                width: 100,
                                margins: '0 0 0 5',
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
                                name: 'nota',
                                width: 100,
                            },{
                                xtype:'textfield',
                                fieldLabel:'Serie',
                                name: 'serie',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype: 'field-money',
                                fieldLabel:'Valor Arroba',
                                name: 'data_entrada',
                                width: 100,
                                margins: '0 0 0 5',
                            },{
                                xtype:'textfield',
                                fieldLabel:'Peso Entrada',
                                name: 'peso_entrada',
                                width: 100,
                                margins: '0 0 0 5',
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


// {
//                         title: 'Informações do Animal',
//                         region: 'center',
//                         xtype: 'panel',
//                         layout: 'fit',
//                         margins: '5 5 0 0',
//                         items: [,]
//                         // Final do Formulario // Final do Painel Central
//                         }]
//                     // Final do Panel Border
//                     }


            //}]
                // Final da Tab de Informacoes do Animal
//                 },{
//                     title    : 'Pesagens',
//                     border :false,
//                     items:[{
//                         xtype:'textfield',
//                         fieldLabel:'Confinamento',
//                         name: 'confinamento_id',
//                     }]
//                 // Final da Tab de Pesagens
//                 }]
            // Barra e Menus
//             bbar:{
//                 items:[
//                 '->',
//                 {
//                     xtype: 'button',
//                     text: 'Cancelar',
//                     action: 'action_cancelar',
//                     iconCls: 'icon-cancel',
//                     tooltip: 'Click para <font color="red"><b>Abandonar</b></font> a Janela de Cadastro<br>Nenhuma informação será Gravada e o Cadastro será Fechado.'
//                 }]
//             }
