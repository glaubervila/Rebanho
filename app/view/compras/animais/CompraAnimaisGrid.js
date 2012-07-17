Ext.define('Rebanho.view.compras.animais.CompraAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.compraanimaisgrid',

    title: 'Lista de Compras de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.viewConfig = {
            emptyText      : 'Nenhum registro encontrado'
            , deferEmptyText : false
            , getRowClass: function(record) {
                status = record.data.status;
                // Formatando a linha pelo valor do campo status
                if (status == 2){
                    return 'row-gray'
                }
            }
        }

        this.store = 'CompraAnimais';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_nome',
                width: 200,
            },
            {
                text: "Status",
                dataIndex: 'status_nome',
                width: 150,
            },
            {
                xtype: 'datecolumn',
                text: "Data Nota",
                dataIndex: 'data_compra',
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                xtype: 'datecolumn',
                text: "Data Entrada",
                dataIndex: 'data_pesagem',
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },

            {
                text: "Fornecedor",
                dataIndex: 'fornecedor_nome',
                sortable: true,
                flex:true,
            },
            {
                text: "Fazenda",
                dataIndex: 'fornecedor_fazenda',
                sortable: true,
                flex:true,
            },
            {
                text: "Nota Fiscal",
                dataIndex: 'numero_nota',
                sortable: true,
                width: 100,
            },
            {
                text: "Qtd Animais",
                dataIndex: 'quantidade',
                sortable: true,
                width: 100,
            },
            {
                text: "Valor",
                dataIndex: 'valor_nota',
                sortable: true,
                flex:true,
                renderer: 'brMoney',
            },

        ]

        this.dockedItems= [{
            xtype: 'toolbar',
            items: [{
                text: 'Novo',
                iconCls: 'icon-add',
                action: 'action_novo',
                tooltip: 'Click para <font color="green"><b>Incluir</b></font> um Novo Registro.',
            },
            {
                text: 'Excluir',
                itemId: 'delete',
                iconCls: 'icon-cross',
                action: 'action_excluir',
                disabled: true,
                tooltip: 'Selecione um Registro na Lista, <br>Click para <font color="red"><b>Excluir</b></font> o Registro Selecionado.',
            }]
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
