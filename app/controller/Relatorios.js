Ext.define('Rebanho.controller.Relatorios', {
    extend: 'Ext.app.Controller',

    stores: ['CompraAnimais', 'Fornecedores', 'Quadras', 'Confinamentos', 'Relatorios'],

    models: [
        'Rebanho.model.Relatorio',
    ],

    views: [
         'relatorios.RelatoriosWindow',
         'relatorios.RelatoriosForm',
    ],

    refs: [
        {
            ref: 'relatoriosForm',
            selector: 'relatoriosform'
        },
        {
            ref: 'relatoriosWindow',
            selector: 'relatorioswindow'
        },
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Eventos da Store
        this.getRelatoriosStore().addListener('Open_Relatorio',this.onOpenRelatorio, this);

        this.control({

            // ----------< Actions do Form >----------
            // Render do Form
            'relatoriosform': {
                render: this.onFormRender
            },
            // Ao Clicar no Botao Gerar Relatório
            'relatoriosform button[action=action_relatorio]': {
                 click: this.onBtnRelatorioClick
            },
            // ----------< Actions do Window >----------
            // Show da Window
            'relatorioswindow':{
                show: this.onShowWindow
            }
        });

    },

    onFormRender: function(){
        console.log('Relatorios - onFormRender');
        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();
    },
    /** Funcao: onShowWindow
     * executada no Evendo Show da Window do Form
     */
    onShowWindow: function(){
        console.log('Relatorios - onShowWindow');

        // Recupera o Form
        var form = this.getRelatoriosForm();

        // Recuperado as Stores
//         store_fornecedores = this.getStore('Fornecedores');
//         store_quadras = this.getStore('Quadras');
        // Recuperando a Combo
        combo_confinamento = form.down('#relatorios_cmbConfinamento');

        if (this.confinamento > 0){
            combo_confinamento.setValue(this.confinamento);
            //combo_confinamento.setDisabled(true);
            combo_confinamento.setReadOnly(true);
            // Chamando o Metodo onSelectCmbConfinamentos para carregar os combos
            this.onSelectCmbConfinamentos(combo_confinamento, this.confinamento);
        }
        else {
            combo_confinamento.setValue(0);
            // Carregando as Stores
            store_fornecedores.clearFilter(true);
            store_quadras.clearFilter(true);
            store_fornecedores.load();
            store_quadras.load();
        }

        // Limpando a Store de Relatorios
        store = this.getStore('Relatorios');
        // Limpando o Filtro
        store.removeAll();
        store.clearFilter(true);

    },

    /** Funcao executada quando seleciona um confinamento
     * habilita a combo de quadra e cria um filtro
     */
    onSelectCmbConfinamentos: function(combo, value){
        console.log('Relatorios - onSelectCmbConfinamentos');

        // Recupera o Form se a combo tiver vindo do form faz os tratamentos
        var form = combo.up('form');

        if (form) {
            console.log('Entrou no Form');
            var comboFornecedores = form.down('#relatorios_cmbFornecedores');
            var comboQuadras = form.down('#relatorios_cmbQuadras');

            // Limpando as Stores
            comboQuadras.store.clearFilter(true);
            comboFornecedores.store.clearFilter(true);

            // Tratamento dos Fornecedores
            comboFornecedores.setValue('');
            comboFornecedores.store.removeAll();
             comboFornecedores.store.load({
                params: {
                    action: 'getAt',
                    field : 'confinamento_id',
                    value : combo.getValue(),
                }
            });
            comboFornecedores.setDisabled(false);

            // Tratamento das Quadras
            comboQuadras.store.removeAll();
            comboQuadras.store.filter('confinamento_id', combo.getValue());
            comboQuadras.setDisabled(false);
        }
    },

    onBtnRelatorioClick: function (button){
        console.log('Relatorios - onBtnRelatorioClick()');

        // Recuperar as informacoes do form e enviar a requisicao
        form = button.up('form');
        values = form.getValues();
        record = Ext.create('Rebanho.model.Relatorio', values);
        console.log(values);
        store = this.getStore('Relatorios');
        //console.log(store);
        store.removeAll(true);
        store.add(record);

        //var loginMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait ..."});
        
        Ext.Ajax.timeout = 12000;
        store.sync();

        record.save();

    },


    onOpenRelatorio: function(store,obj){
        console.log('onOpenRelatorio()');

        myWindow=window.open('','_blank')
        myWindow.document.write("<p>This is 'myWindow'</p>")
        myWindow.document.write(obj.content)
        myWindow.focus()
    },
});




