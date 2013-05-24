Ext.define('Rebanho.view.cadastros.vacinas.VacinasGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.vacinasgrid',

    title: 'Lista de Vacinas',

    loadMask: true,

    iconCls: 'icon-pill',

    initComponent: function() {

        this.store = 'Vacinas';

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
                dataIndex: 'status',
                flex:true,
                renderer: this.changeStatus
            },
            {
                text: "Nome",
                dataIndex: 'nome',
                flex:true,
            },
            {
                text: "Laboratório",
                dataIndex: 'laboratorio',
                sortable: true,
                flex:true,
            },
            {
                text: "Lote",
                dataIndex: 'lote',
                sortable: true,
                flex:true,
            },
            {
                text: "Fabricação",
                dataIndex: 'fabricacao',
                sortable: true,
                flex:true,
            },
            {
                text: "Validade",
                dataIndex: 'validade',
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
    },

    changeStatus: function(value, obj, record){
        if (value == 0){
            return 'Inativo';
        }
        else {
            return 'Ativo';
        }

    }

 }); 
