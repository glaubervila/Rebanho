Ext.define('Rebanho.view.vendas.VendasGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.vendasgrid',

    title: 'Lista Venda de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Vendas';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                width: 200,
                renderer: this.changeConfinamento
            },
            {
                text: "Status",
                dataIndex: 'status_nome',
                width: 150,
            },
            {
                xtype: 'datecolumn',
                text: "Data Nota",
                dataIndex: 'data',
                width: 100,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
            },
            {
                text: "Cliente",
                dataIndex: 'cliente_nome',
                width: 200,
            },
            {
                text: "Razão Social",
                dataIndex: 'cliente_razao_social',
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
                text: 'Nova Venda',
                iconCls: 'icon-add',
                action: 'action_novo',
                tooltip: 'Click para <font color="green"><b>Incluir</b></font> um Novo Registro.',
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

    changeConfinamento: function(value, obj, record){
        return record.get('confinamento');
    }

 }); 
