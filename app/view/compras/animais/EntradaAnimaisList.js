Ext.define('Rebanho.view.compras.animais.EntradaAnimaisList' ,{
    extend: 'Ext.grid.Panel',

    requires: [
    ],

    alias : 'widget.entradaanimaislist',

    loadMask: true,

    sortableColumns: false,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'EntradaAnimais';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Identificação",
                dataIndex: 'codigo',
                width: 150,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                width: 50,
            },
            {
                text: "Status",
                dataIndex: 'status',
                width: 50,
            },
            {
                text: "Peso Compra",
                dataIndex: 'peso_compra',
                width: 100,
            },
            {
                text: "Peso Entrada",
                dataIndex: 'peso_entrada',
                width: 100,
            },
        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [

            ]
        }]


        this.callParent(arguments);
    },

 }); 
