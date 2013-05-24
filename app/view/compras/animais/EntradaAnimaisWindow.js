Ext.define('Rebanho.view.compras.animais.EntradaAnimaisWindow' ,{
    extend: 'Ext.window.Window',

    requires:[
        'Rebanho.view.compras.animais.SelecaoNotaAbertaCombo',
    ],
    
    alias : 'widget.entradaanimaiswindow',

    title: 'Seleção  Nota de Compras Animais',

    layout: 'fit',

    autoShow: true,

    resizable:false,

    width: 420,

    height: 400,

    modal: true,

    iconCls: 'icon-application_form',

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
                        xtype: 'hidden',
                        name: 'status',
                    },
                    {
                        xtype: 'hidden',
                        name: 'confinamento_id',
                    },
                    {
                        xtype: 'fieldset',
                        defaults: {
                            anchor: '-5',
                        },
                        items:[
                            {
                                xtype:'cmbnotaaberta',
                                //name: 'numero_nota',
                                allowblank: false,
                                readOnly: false,
                                listeners:{
                                    scope  : this
                                    , select: this.onSelectNota
                                    , nenhumaNotaAberta: function(){
                                        // Se nao Houver notas abertas Fecha a Janela
                                        this.close();
                                        Ext.MessageBox.show({ title:'Atenção!', msg: 'Não Há Compras Aguardando Pesagem.<br> Cadastre uma Compra Acessando o Menu<br> Compras -> Compras Animais.', buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });
                                    }
                                },
                            },
                            {
                                xtype: 'datefield',
                                itemId: 'dtfDataEntrada',
                                fieldLabel:'Data de Entrada',
                                name: 'data_entrada',
                                allowBlank: false,
                                format: 'd/m/y',
                                submitFormat: 'Y-m-d',
                            },
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            defaults: {
                                anchor: '-5',
                            },
                            items:[
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                    readOnly: true,
                                    anchor: '-5',
                                },
                                items:[
                                    {
                                        xtype: 'datefield',
                                        fieldLabel:'Data Compra',
                                        name: 'data_compra',
                                        format: 'd/m/Y',
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel:'Nº Nota',
                                        name: 'numero_nota',
                                        margins: '0 0 0 5',
                                        flex: 1,
                                    },
                                ]
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel:'Fornecedor',
                                name: 'fornecedor_nome',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel:'Fazenda',
                                name: 'fornecedor_fazenda',
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                defaultType:'textfield',
                                fieldDefaults: {
                                    labelAlign: 'top',
                                },
                                defaults: {
                                    anchor: '-5',
                                },
                                items:[
                                    {
                                        xtype: 'textfield',
                                        fieldLabel:'Quantidade',
                                        name: 'quantidade',
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel:'Qtd Machos',
                                        name: 'qtd_machos',
                                        margins: '0 0 0 5',
                                        flex: 1,
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel:'Qtd Femeas',
                                        name: 'qtd_femeas',
                                        margins: '0 0 0 5',
                                        flex: 1,
                                    },
                                ]
                            },
                        ]
                    }]
                })
            ]
            , buttons:[{
                text: 'Limpar',
                iconCls: 'icon-cancel',
                scope: this,
                handler: function(button){
                    var form = this.down('form').getForm().reset();
                },
            },{
                text: 'Selecionar Nota',
                iconCls: 'icon-tick',
                scope: this,
                handler: function(button){
                    if (this.down('form').getForm().isValid()) {
                        // Recuperando o Registro
                        var values = this.down('form').getForm().getValues();

                        // verifico se tem a data de Entrada
                        if (values.data_entrada){
                            // Disparando Evendo de Selecao
                            this.fireEvent('selecionou_nota_entrada', this, values);
                        }
                        else {
                            // Se não tiver mostra a mensagem de obrigatorio
                            Ext.MessageBox.show({ title:'Atenção!', msg: 'Campo Data de Entrada, Preenchimento Obrigatório!', buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });
                        }
//                         console.log(values);
                    }
                },
            }]
        });

        this.callParent(arguments);
    },

    onSelectNota: function(combo,record, scope){
        var form = combo.up('form');
        var value = combo.getValue();
        var store = combo.getStore();
        var data = store.getAt(store.findExact('id',value));

        form.getForm().reset();
        form.getForm().setValues(data.data);
        combo.setValue(value);
    },
 });