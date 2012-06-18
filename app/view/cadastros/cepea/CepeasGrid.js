Ext.define('Rebanho.view.cadastros.cepea.CepeasGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [],

    alias : 'widget.cepeasgrid',

    title: 'Lista de Valores Para Arroba',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Cepeas';

        // RowEdit Plugin
        this.plugins= [
            Ext.create('Ext.grid.plugin.RowEditing',{
            }),
        ],

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                xtype:'datecolumn',
                text: "Data",
                dataIndex: 'data',
                width: 200,
                renderer : Ext.util.Format.dateRenderer('d-m-Y'),
                field: {
                    xtype:'datefield',
                },
                allowBlank: false,
            },
            {
                text: "Valor",
                dataIndex: 'valor',
                sortable: true,
                flex:true,
                field: {
                    xtype: 'textfield',
                },
                renderer: 'brMoney',
                allowBlank: false,
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
    }

 }); 
