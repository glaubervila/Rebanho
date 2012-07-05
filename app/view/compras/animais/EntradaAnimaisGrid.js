Ext.define('Rebanho.view.compras.animais.EntradaAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.entradaanimaisgrid',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'EntradaAnimais';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Identificação",
                dataIndex: 'codigo',
                width: 200,
            },
            {
                text: "Peso Entrada",
                dataIndex: 'peso_entrada',
                sortable: true,
                flex:true,
            },
            {
                text: "Sexo",
                dataIndex: 'sexo',
                sortable: true,
                flex:true,
            },
        ]

        this.dockedItems= [{
            xtype: 'toolbar',
            items: []
        }]


        this.callParent(arguments);
    },

 }); 
