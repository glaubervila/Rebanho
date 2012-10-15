Ext.define('Rebanho.view.transferencias.TransferenciasGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [ ],

    alias : 'widget.transferenciasgrid',

    title: 'Lista de Transferências',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Transferencias';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                dataIndex: 'id',
                hidden: true,
            },
            {
                text: "Status",
                dataIndex: 'status_nome',
                sortable: false,
                width: 100,
            },
            {
                text: "Saída",
                dataIndex: 'data_saida',
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
                sortable: false,
                width: 80,
            },
            {
                text: "Origem",
                dataIndex: 'origem_nome',
                sortable: false,
                width: 200,
            },
            {
                text: "Destino",
                dataIndex: 'destino_nome',
                sortable: false,
                width: 200,
            },
            {
                text: "Entrada",
                dataIndex: 'data_entrada',
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
                sortable: false,
                width: 80,
            },
            {
                text: "Quantidade",
                dataIndex: 'quantidade',
                sortable: false,
                //width: 70,
                flex: true,
            },
            {
                text: "Machos",
                dataIndex: 'machos',
                sortable: false,
                //width: 50,
                flex: true,
            },
            {
                text: "Femeas",
                dataIndex: 'femeas',
                sortable: false,
                //width: 50,
                flex: true,
            },
            {
                text: "Peso Min",
                dataIndex: 'peso_minimo',
                sortable: false,
                //width: 80,
                flex: true,
            },
            {
                text: "Peso Médio",
                dataIndex: 'peso_medio',
                sortable: false,
                //width: 80,
                flex: true,
            },
            {
                text: "Peso Maximo",
                dataIndex: 'peso_maximo',
                sortable: false,
                //width: 80,
                flex: true,
            },

        ];

        // Barra de Paginacao
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando {0} à {1} de {2} Registro(s)',
            emptyMsg: "Não ha Registros!",
            afterPageText:'de {0}',
            beforePageText:'Página',
        });

        this.callParent(arguments);
    },

 }); 