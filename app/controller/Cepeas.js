Ext.define('Rebanho.controller.Cepeas', {
    extend: 'Ext.app.Controller',

    stores: ['Cepeas'],

    models: ['Rebanho.model.Cepea'],

    views: [
        'cadastros.cepea.CepeasGrid',
    ],

    refs: [
        {
            ref: 'cepeasGrid',
            selector: 'cepeasgrid'
        },
    ],
    init: function() {

        // Load da Store
        this.getCepeasStore().addListener('load',this.onStoreLoad, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'cepeasgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'cepeasgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'cepeasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getCepeasStore().sort('data', 'DESC');
                },
            },
        });

    },



    onStoreLoad: function(){
        grid = this.getCepeasGrid();
    },

    onSelectChange: function(selModel, selections){
        this.getCepeasGrid().down('#delete').setDisabled(selections.length === 0);
    },

    onBtnNovoClick: function (btn){

        // Recuperando a Store
        var store = this.getStore('Cepeas');

        // Criando Um Record Novo
        var model = Ext.create('Rebanho.model.Cepea',{});

        store.insert(0,model);

        // Iniciando a Edição do registro novo
        this.getCepeasGrid().editingPlugin.startEdit(0,0);

    },


    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getCepeasGrid();
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

