Ext.define('Rebanho.view.compras.animais.CompraAnimaisGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.compraanimaisgrid',

    title: 'Lista de Compras de Animais',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Fornecedores';

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                width: 200,
                renderer: this.changeConfinamento
            },
            {
                text: "Data",
                dataIndex: 'nome',
                width: 200,
            },
            {
                text: "Fornecedor",
                dataIndex: 'fazenda',
                sortable: true,
                flex:true,
            },
            {
                text: "Nota Fiscal",
                dataIndex: 'cnpj_cpf',
                sortable: true,
                flex:true,
            },
            {
                text: "Valor",
                dataIndex: 'telefone',
                sortable: true,
                flex:true,
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

    changeConfinamento: function(value, obj, record){
        return record.get('confinamento');
    }

 }); 
