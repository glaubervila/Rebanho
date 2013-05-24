Ext.define('Rebanho.view.ocorrencias.nascimentos.NascimentosGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.nascimentosgrid',

    title: 'Nascimentos de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Nascimentos';


        this.columns = [
            //Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Data",
                dataIndex: 'data',
                sortable: true,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Código",
                dataIndex: 'animal_id',
                sortable: false,
                width: 100,
            },
            {
                text: "Peso",
                dataIndex: 'ocorrencia',
                sortable: false,
                width: 100,
            },
            {
                text: "Mãe",
                dataIndex: 'descricao',
                sortable: false,
                flex:true,
            },
            {
                text: "Pai",
                dataIndex: 'descricao',
                sortable: false,
                flex:true,
            },
        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [{
                xtype: 'toolbar',
                items: [{
                    text: 'Novo Nascimento',
                    iconCls: 'icon-add',
                    action: 'action_adicionar',
                    itemId: 'btnAdicionar',
                    tooltip: 'Click para Lançar uma Ocorrência, Para este Animal.',
                }]
            }],

        }]


        this.callParent(arguments);
    },

 }); 
