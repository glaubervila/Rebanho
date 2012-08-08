Ext.define('Rebanho.view.ocorrencias.pesagens.PesagensPorAnimalGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.pesagensporanimalgrid',

    title: 'Pesagens Por Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Pesagens';

        this.columns = [
            {
                text: "Data",
                dataIndex: 'data',
                sortable: true,
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Peso",
                dataIndex: 'peso',
                sortable: true,
                flex: 1,
            },
        ];

        this.dockedItems= [{
        }]


        this.callParent(arguments);
    },

 }); 
