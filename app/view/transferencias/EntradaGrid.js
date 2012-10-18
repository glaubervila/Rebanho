Ext.define('Rebanho.view.transferencias.EntradaGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.entradagrid',

    title: 'Lista de Animais Transferidos',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'TransferenciaAnimais';

        this.columns = [
            //Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                hidden: true,
            },
            {
                text: "Cod Antigo",
                dataIndex: 'codigo_antigo',
                sortable: false,
                width: 100,
            },
            {
                text: "SisBov",
                dataIndex: 'codigo',
                sortable: false,
                width: 200,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: false,
                width: 50,
            },
            {
                text: "Peso",
                dataIndex: 'peso',
                sortable: false,
                width: 100,
            },
        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                {
                    xtype: 'numberfield',
                    fieldLabel:'Código',
                    labelWidth: 50,
                    name: 'codigo',
                    itemId: 'txtEntradaCodigo',
                    minValue: 0,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    selectOnFocus    : true,
                    enableKeyEvents  : true,
                },
//                 {
//                     text: 'Adicionar',
//                     iconCls: 'icon-add',
//                     action: 'action_adicionar',
//                     itemId: 'btnAdicinar',
//                     tooltip: 'Click para Adicionar um Animal a lista de animais a serem transferidos.',
//                 },
//                 {
//                     text: 'Remover',
//                     iconCls: 'icon-delete',
//                     action: 'action_remover',
//                     itemId: 'btnRemover',
//                     tooltip: 'Click para Remover um Animal da lista de animais a serem transferidos',
//                 },

            ]
        }]


        this.callParent(arguments);
    },

 }); 