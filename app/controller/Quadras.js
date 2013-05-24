Ext.define('Rebanho.controller.Quadras', {
    extend: 'Ext.app.Controller',

    stores: ['Quadras'],

    models: ['Rebanho.model.Quadra'],

    views: [
        'cadastros.quadras.QuadrasGrid',
    ],

    refs: [
        {
            ref: 'quadrasGrid',
            selector: 'quadrasgrid'
        },
    ],
    init: function() {

        // Load da Store
        this.getQuadrasStore().addListener('load',this.onStoreLoad, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'quadrasgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'quadrasgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'quadrasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                   this.getQuadrasStore().load();
                },
            },
        });

    },



    onStoreLoad: function(){
//         alert('load');
        //grid = this.getQuadrasGrid().getView().refresh();
    },

    onSelectChange: function(selModel, selections){
        this.getQuadrasGrid().down('#delete').setDisabled(selections.length === 0);
    },

    onBtnNovoClick: function (btn){

        // Recuperando a Store
        var store = this.getStore('Quadras');

        // Criando Um Record Novo
        var model = Ext.create('Rebanho.model.Quadra',{});

        store.insert(0,model);

        // Iniciando a Edição do registro novo
        this.getQuadrasGrid().editingPlugin.startEdit(0,0);

    },


    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getQuadrasGrid();
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

