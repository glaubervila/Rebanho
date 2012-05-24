Ext.define('Rebanho.view.cadastros.quadras.QuadrasGrid' ,{
    extend: 'Ext.grid.Panel',

    requires: [
        'Rebanho.view.cadastros.confinamentos.ConfinamentosCombo',
    ],

    alias : 'widget.quadrasgrid',

    title: 'Lista de Quadras',

    loadMask: true,

    iconCls: 'icon-grid',

    initComponent: function() {

        this.store = 'Quadras';

        // RowEdit Plugin
        this.plugins= [
            Ext.create('Ext.grid.plugin.RowEditing',{
            }),
        ],

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: "Confinamento",
                dataIndex: 'confinamento_id',
                width: 200,
                field: {
                    xtype:'cmbconfinamento',
                },
                renderer : this.renderConfinamentos,
            },
            {
                text: "Quadras",
                dataIndex: 'quadra',
                sortable: true,
                flex:true,
                field: {
                    xtype: 'textfield',
                },
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

    , renderConfinamentos: function(value, obj, record){
        return record.get('confinamento');
    }
 }); 
