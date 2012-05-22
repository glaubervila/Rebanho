Ext.define('Rebanho.controller.Confinamentos', {
    extend: 'Ext.app.Controller',

    stores: ['Confinamentos'],

    models: ['Rebanho.model.Confinamento'],

    views: [
        'cadastros.confinamentos.ConfinamentosGrid',
    ],

    refs: [
        {
            ref: 'confinamentosGrid',
            selector: 'confinamentosgrid'
        },
    ],
    init: function() {
        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'confinamentosgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'confinamentosgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'confinamentosgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
            },
        });

    },

    onSelectChange: function(selModel, selections){
        this.getConfinamentosGrid().down('#delete').setDisabled(selections.length === 0);
    },

    onBtnNovoClick: function (btn){

        // Recuperando a Store
        var store = this.getStore('Confinamentos');

        // Criando Um Record Novo
        var model = Ext.create('Rebanho.model.Confinamento',{});

        store.insert(0,model);

        // Iniciando a Edição do registro novo
        this.getConfinamentosGrid().editingPlugin.startEdit(0,0);

    },


    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getConfinamentosGrid();
        var store = grid.getStore();
        var records = grid.getSelectionModel().getSelection();

        // Verificar se Tem Registro a Excluir

        if(records.length === 0){
            Ext.Msg.alert('Atenção!', 'Nenhum Registro selecionado...');
        }else{

            // Confirmar a Exclusao
            Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="red"><b>EXCLUIR</b></font> este(s) Registro(s)?', function(btn){

                if (btn == 'yes'){

                    // Excluindo Usando a Store
                    store.remove(records);

                }
            },this);
        }
    },
});

