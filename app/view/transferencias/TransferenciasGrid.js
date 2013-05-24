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
                width: 100,
            },
            {
                text: "Origem",
                dataIndex: 'origem_nome',
                sortable: false,
                flex: 1,
            },
            {
                text: "Destino",
                dataIndex: 'destino_nome',
                sortable: false,
                flex: 1,
            },
            {
                text: "Entrada",
                dataIndex: 'data_entrada',
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
                sortable: false,
                width: 100,
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
        ];

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [
                {
                    text: 'Nova Transferencia',
                    iconCls: 'icon-add',
                    action: 'action_novaTransferencia',
                    itemId: 'btnNova',
                    tooltip: 'Click para Criar uma nova Transferencia, vai abrir a janela de transferencias de saida, para inclusão dos animais a serem transferidos.',
                },
                {
                    text: 'Excluir',
                    iconCls: 'icon-delete',
                    action: 'action_excluirTransferencia',
                    itemId: 'btnExcluir',
                    tooltip: 'Click para Excluir uma Transferencia, Atenção so Podem ser excluidas as Transferencias que estiverem com status "Saída".',
                    disabled: true,
                },
            ]
        }]

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