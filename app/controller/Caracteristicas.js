Ext.define('Rebanho.controller.Caracteristicas', {
    extend: 'Ext.app.Controller',

    stores: ['Caracteristicas'],

    models: ['Rebanho.model.Caracteristica'],

    views: [
        'cadastros.caracteristicas.CaracteristicasGrid',
    ],

    refs: [
        {
            ref: 'caracteristicasGrid',
            selector: 'caracteristicasgrid'
        },
    ],
    init: function() {
        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

            'caracteristicasgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },
            // Ao Clicar no Botao Excluir na Grid
            'caracteristicasgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            'caracteristicasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getCaracteristicasStore().load();
                },

            },
        });

    },

    onBtnNovoClick: function (){

        // Recuperando a Store
        var store = this.getStore('Caracteristicas');

        // Criando Um Record Novo
        var model = Ext.create('Rebanho.model.Caracteristica',{});

        store.insert(0,model);

        // Iniciando a Edição do registro novo
        this.getCaracteristicasGrid().editingPlugin.startEdit(0,0);

    },


    onSelectChange: function(selModel, selections){
        this.getCaracteristicasGrid().down('#delete').setDisabled(selections.length === 0);
    },

    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Grid
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    onBtnExcluirClick: function(btn, pressed){

        var me = this;
        // Recuperando a Linha Selecionada
        var grid = me.getCaracteristicasGrid();
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

