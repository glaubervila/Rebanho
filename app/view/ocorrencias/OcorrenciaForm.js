Ext.define('Rebanho.view.ocorrencias.OcorrenciaForm' ,{
    extend: 'Ext.form.Panel',

    requires:[
        'Rebanho.view.cadastros.quadras.QuadrasCombo',
        'Rebanho.view.cadastros.vacinas.VacinasCombo',
    ],
    alias : 'widget.ocorrenciaform',

    bodyStyle:'padding:5px;',

    iconCls: 'icon-application_form',

    layout:'form',

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {

            defaultType:'textfield',
            fieldDefaults: {
                labelAlign: 'top',
            },
            items:[{
                xtype: 'fieldset',
                defaultType:'textfield',
                items:[{
                    name: 'animal_id',
                    hidden: true,
                },{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    fieldDefaults: {
                        labelAlign: 'top',
                    },
                    items:[{
                        xtype:'combobox',
                        fieldLabel:'Ocorrência',
                        itemId: 'cmbTipoOcorrencia',
                        name: 'tipo',
                        allowBlank: false,
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        store: [
                            ['4','Pesagem'],
                            ['5','Manejo de Quadra'],
                            ['8','Desmama'],
                            ['9','Castracao'],
                            ['V','Vacinacao'],
                            ['M','Morte'],
                            ['O','Outras'],
                        ],
                        flex:1,
                    },{
                        xtype: 'datefield',
                        fieldLabel:'Data da Ocorrência',
                        name: 'data',
                        format: 'd/m/y',
                        submitFormat: 'Y-m-d',
                        flex:1,
                        margins: '0 0 0 5',
                        allowBlank: false,
                    }]
                }]
            },{
                xtype: 'fieldset',
                defaultType:'textfield',
                layout: 'hbox',
                items:[{
                    xtype: 'numberfield',
                    fieldLabel:'Peso',
                    name: 'peso',
                    disabled: true,
                    minValue: 0,
                    maxValue: 999,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    flex: 1,
                },{
                    xtype:'cmbquadras',
                    fieldLabel:'Quadra Destino',
                    name: 'quadra_id',
                    disabled: true,
                    flex: 2,
                    margins: '0 0 0 5',
                }]
            },{
                xtype:'cmbvacinas',
                fieldLabel:'Vacina',
                name: 'vacina_id',
                disabled: true,
                flex: 1,
            },{
                xtype:'textarea',
                fieldLabel:'Descrição',
                name: 'descricao',
                disabled: true,
                maxLength: 250,
            }]

            , buttons:[{
                text: 'Limpar',
                iconCls: 'icon-cancel',
                scope: this,
                handler: function(button){
                    var form = this.getForm().reset();
                }
            },{
                text: 'Salvar',
                iconCls: 'icon-disk',
                scope: this,
                itemId: 'btnSalvar',
                action: 'action_salvar',
            }]

        });

        this.callParent(arguments);

    }
 }); 