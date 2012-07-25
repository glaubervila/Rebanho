Ext.define('Rebanho.controller.Pesagens', {
    extend: 'Ext.app.Controller',

    require:[ ],

    stores: [
        'Pesagens',
    ],

    models: [
        'Rebanho.model.Pesagem',
    ],

    views: [
        'ocorrencias.pesagens.PesagensGrid',
    ],

    refs: [
        {
            ref: 'pesagensGrid',
            selector: 'pesagensgrid'
        },
    ],

    // Atributos
    quantidade_pesada: false,
    confinamento : 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        this.getStore('Pesagens').addListener('load', this.onLoadStore, this);
  
        this.control({

            // ----------< Actions do Grid >----------
            'pesagensgrid button[action=action_pesar]': {
                click: this.inicioPesagem,
                afterrender: this.onAfterRender,
            },

            'pesagensgrid [itemId=confinamento]': {
                select: this.onSelectCmbConfinamentos
            },

        });
    },

    /** Funcao: onLoadStore
     * Executada toda vez que da Load na Store
     * Chamada da funcao getContadores
     */
    onLoadStore: function(){
        this.getContadores();
    },

    /** Funcao: onAfterRender
     * Executada no evendo afterrender da grid
     * Recupera o confinamento do usuario e seta o valor da combo confinamento
     * Gera os Filtros para a Store
     */
    onAfterRender: function(){
        console.log('Pesagens - onAfterRender');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Setando o Valor da Combo Confinamento
        cmbConfinamento = this.getPesagensGrid().down('#confinamento');
        cmbConfinamento.setValue(this.confinamento);

        // Se o Usuario Pertencer a um Confinamento desabilitar a Combo
        if (this.confinamento > 0) {
            cmbConfinamento.disable();
        }

        this.loadStore();
    },

    loadStore: function(){
        console.log('Pesagens - loadStore');

        // Gerando os Filtros para a Store
        // Recuperando a Data
        data = Ext.Date.dateFormat(new Date(),'Y-m-d');

        // Tratando o Confinamento
        confinamento = this.getPesagensGrid().down('#confinamento').getValue();

        if (confinamento == 0){
            Ext.BoxMsg.msg('Atenção!', 'Selecione um Confinamento!');
        }
        else {
            this.confinamento = confinamento;

            // Habilando o Botao de Pesar
            this.getPesagensGrid().down('#btnPesar').setDisabled(false);

            // Recuperando a Store
            store = this.getStore('Pesagens');

            // Limpando a Store
            store.removeAll();

            store.proxy.setExtraParam('action','getPesagens');

            // Limpando o Filtro
            store.clearFilter(true);

            // Adicionando novo Filtro pra Pegar todos os animais dessa nota
            store.filter([
                {property: "confinamento_id", value: this.confinamento},
                {property: "data", value: data},
                {property: "tipo", value: 2},
            ]);
        }
    },

    /** Funcao: onSelectCmbConfinamentos
     * Executada quando se seleciona um Confinamento na Combo
     * vai executar a funcao loadStore para colocar os filtros na Store
     */
    onSelectCmbConfinamentos: function(){
        console.log('Pesagens - onSelectCmbConfinamentos');
        this.loadStore();
    },

    /** Funcao: inicioPesagem
     * Executada quando se Clica no Botao de "Pesar"
     * atualiza os atributos de quantidade
     * se houver algum animal Pesado habilita botao finalizarNota
     * executa a funcao setContadores
     */
    inicioPesagem: function(){
        console.log('Pesagens - inicioPesagem');
        //this.getContadores();

    },


    getContadores: function(){
        console.log('Pesagens - getContadores');

        store = this.getStore('Pesagens');

        pesados = store.getTotalCount();
        peso_total = store.sum('peso');
        media = (peso_total / pesados);
        peso_medio = media.toFixed(2);

        var grid = this.getPesagensGrid();

        grid.down('#tbpesados').setText('<b>Pesados: <font color="green">'+pesados+'</font></b>');

        grid.down('#tbpesototal').setText('<b>Peso Total: <font color="blue">'+peso_total+' Kg</font></b>');

        grid.down('#tbpesomedio').setText('<b>Peso Médio: <font color="blue">'+peso_medio+' Kg</font></b>');

        // Testar se Tem mais de Um Animal Se tiver Habilita o Bortao Finalizar
        if (pesados > 0){
            // Habilando o Botao de Finalizar
            this.getPesagensGrid().down('#btnPesar').setDisabled(false);
        }
    }

});

