Ext.define('Rebanho.view.compras.animais.SelecaoNotaAbertaCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbnotaaberta',

    name      : 'notaaberta',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'descricao',

    initComponent: function() {

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        this.store = Ext.create('Ext.data.Store',{
            
            autoSync: true,

            fields: [
                {name:'id', type: 'int'},
                {name:'data_compra', type: 'date', dateFormat: 'Y-m-d' },
                {name:'numero_nota', type: 'int'},
                {name:'fornecedor_nome', type: 'string'},
                {name:'fornecedor_fazenda', type: 'string'},
                {name:'quantidade', type: 'string'},
                {name:'qtd_machos', type: 'string'},
                {name:'qtd_femeas', type: 'string'},
                {name:'status', type: 'string'},
                {name:'descricao', type: 'string', convert: function(value, record){
                    data = Ext.util.Format.date(record.data.data_compra,'d-m-Y');
                    descricao = 'Data: '+data+ ' | Nota: ' +record.data.numero_nota+' | '+record.data.fornecedor_nome;
                    return descricao
                }},
            ],

            proxy: {

                type: 'rest',
                url: 'php/main.php',
                extraParams:{
                    classe: 'NotasEntrada',
                    action: 'getNotasAbertas',
                    confinamento: this.confinamento,
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total'
                },
            },

            listeners: {
                scope: this,
                load: function(store, records, successful){

                    if (successful == false){
                        // Disparando Evento 'nenhumaNotaAberta'
                        this.fireEvent('nenhumaNotaAberta');
                    }
                }
            },
        });

        this.callParent(arguments);

    },

});