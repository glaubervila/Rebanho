Ext.define('Rebanho.controller.PesagemAnimais', {
    extend: 'Ext.app.Controller',

    require:[ ],

    stores: [
        'PesagemAnimais',
    ],

    models: [
        'Rebanho.model.Pesagem',
    ],

    views: [
        // Grid de Pesagem
        'ocorrencias.pesagens.PesagensGrid',
        // Janela de Relatorio por Data
        'ocorrencias.pesagens.PesagensPorDataWindow',
        // Grid de Pesagem Por Animal
        'ocorrencias.pesagens.PesagensPorAnimalGrid',
    ],

    refs: [
        {
            ref: 'pesagensGrid',
            selector: 'pesagensgrid'
        },
        {
            ref: 'pesagensPorDataWindow',
            selector: 'pesagenspordata'
        },
    ],

    // Atributos
    // Quantidade de Animais Pesados
    quantidade_pesada: false,
    // Chave estrangeira confinamento_id
    confinamento: 0,
    // Nome do Confinamento
    confinamento_nome: '',
    // Chave estrangeira animal_id
    animal_id   : 0,
    // Record Animal
    animal      : false,

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
        //this.getStore('Pesagens').addListener('load', this.onLoadStore, this);
  
        this.control({

            // ----------< Actions do Grid >----------

            'pesagensgrid': {
                afterrender: this.onAfterRender,
            },

            'pesagensgrid button[action=action_pesar]': {
                click: this.inicioPesagem,
            },
            'pesagensgrid button[action=action_relatorio]': {
                click: this.onBtnClickRelatorio,
            },

            'pesagensgrid [itemId=confinamento]': {
                select: this.onSelectCmbConfinamentos
            },

            // ----------< Actions da Window Relatorio Por Data >----------
            'pesagenspordata': {
                show: function(){
                    alert('Pesagens Por Data Show!');
                }
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

        // Recuperando a Store
        store = this.getStore('Pesagens');

        // Limpando a Store
        store.removeAll();
        store.clearFilter(true);


        // Tratando o Confinamento
        confinamento = this.getPesagensGrid().down('#confinamento').getValue();

        if (confinamento == 0){
            Ext.ux.Alert.alert('Atenção!', 'Selecione um Confinamento!','warning');
        }
        else {
            // Setando o Confinamento
            this.confinamento = confinamento;

            // Habilando o Botao de Pesar
            this.getPesagensGrid().down('#btnPesar').setDisabled(false);


            // Setando a Action para o Load
            store.proxy.setExtraParam('action','getPesagens');

            // Limpando o Filtro
            store.clearFilter(true);

            // Adicionando novo Filtro pra Pegar todos os animais dessa nota
            store.filter([
                {property: "confinamento_id", value: this.confinamento},
                {property: "data", value: data},
                {property: "tipo", value: 2},
            ]);

            store.load({
                callback:this.onLoadStore,
                scope: this,
            });

            // Limpando o Action da Grid
            store.proxy.setExtraParam('action','');
        }

    },

    /** Funcao: onSelectCmbConfinamentos
     * Executada quando se seleciona um Confinamento na Combo
     * vai executar a funcao loadStore para colocar os filtros na Store
     */
    onSelectCmbConfinamentos: function(combo, record, options){
        console.log('Pesagens - onSelectCmbConfinamentos');
        // Setando o Confinamento
        this.confinamento = combo.getValue();
        // Recuperando o Nome do Confinamento
        confinamento = combo.store.getAt(combo.store.findExact('id',this.confinamento));
        this.confinamento_nome = confinamento.data.confinamento;
        // Carregando a Store
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

        // Chama a Funcao digitarCodigo
        this.digitarCodigo();

    },


    /** Funcao: digitarCodigo
     * Executada quando se clica no Botao Pesar
     * faz um request passando o codigo, pra verificar se o codigo existe
     * @return: (bool)
     */
     digitarCodigo: function(codigo){

        // Mostrar o Prompt para informar o Codigo
        Ext.Msg.show({
            title:'Código do Animal',
            msg: 'Entre com o Código do Animal',
            buttons: Ext.Msg.OKCANCEL,
            icon: 'icon-barcode-32',
            minWidth: 250,
            width: 300,
            scope: this,
            prompt: true,
            callback: function(btn, codigo){
                if (btn == 'ok'){
                    // Verifica se tem Identificacao
                    if (codigo != ''){
                        // Executa a Funcao verifica_animal, para validar se o animal ta cadastrado
                        this.verificaAnimal(codigo);
                    }
                }
            }
        });
    },

    /** Funcao: digitarPeso
     * Executada apos digitar um codigo na Janela Prompt de Codigo
     * Mostra um Prompt para a Entrada do Peso do animal
     */
     digitarPeso: function(){

        // Mostrar o Prompt para informar o Codigo
        Ext.Msg.show({
            title:'Peso do Animal',
            msg: 'Entre com o Peso do Animal',
            buttons: Ext.Msg.OKCANCEL,
            icon: 'icon-scale-32',
            minWidth: 250,
            width: 300,
            scope: this,
            prompt: true,
            callback: function(btn, peso){
                if (btn == 'ok'){
                    // Verifica se tem PESO
                    if (peso != ''){

                        if (peso > 0) {
                            this.gravarPesagem(peso);
                        }
                        else {
                            // Peso Negativo Digitar de Novo
                            Ext.ux.Alert.alert('Atenção!', 'Peso Deve ser Valor Positivo!','warning');
                            this.digitarPeso();
                        }
                    }
                }
            }
        });
    },


    

    /** Funcao: verificaAnimal
     * faz um request passando o codigo, pra verificar se o codigo existe
     * se achar retorna true, se nao retorna false
     * @return:(bool)
     */
    verificaAnimal: function(codigo){
        console.log('Pesagens - verificaAnimal('+codigo+')');
        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'GET',
            params: {
                classe: 'Animais',
                action: 'getIdByCodigo',
                codigo: codigo,
                confinamento: this.confinamento,
                returnJson: true,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){
                    console.log('Sucesso - Animal_id:'+retorno.animal_id);
                    // Setando o Animal_Id
                    this.animal_id = retorno.animal_id;
                    // Setando o Objeto Animal
                    this.animal = retorno.animal;

                    // Digitar o Peso
                    this.digitarPeso();

                }
                else {
                    // Mostrando Mensagem de Erro
                    Ext.MessageBox.show({ title:'Desculpe!', msg: retorno.message, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.WARNING });
                    return false;
                }
            },
        })
    },

    /** Funcao: gravarPesagem
     * Grava o Peso de um animal, cria um record com o model pesagem,
     * depois adiciona pelo Model por que a Store ta usando ExtraParam no load
     * carrega a store usando a funcao LoadStore();
     * @param:{float}  peso   = peso digitado no prompt peso
     */
    gravarPesagem: function(peso){

        animal = this.animal;

        // Criando o Registro
        console.log('Criando o Registro');
        var pesagem = Ext.create('Rebanho.model.Pesagem', {
            confinamento_id : this.confinamento,
            quadra_id  : animal.quadra_id,
            animal_id  : this.animal_id,
            data : Ext.Date.dateFormat(new Date(),'Y-m-d'),
            peso: peso,
            tipo: 2,
        });

        errors = pesagem.validate();

        if (errors.isValid()){
            if (pesagem.save()){
                // Mostrando Mensagem de Sucesso
                Ext.ux.Alert.alert('Sucesso!', 'Registro Gravado com Sucesso!', 'warning');

                this.loadStore();
            }
        }
        else {
            console.log(errors.items);
            Ext.MessageBox.show({ title:'Desculpe!', msg: 'Houve um Erro na Gravação do Registro', buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR });
        }

        this.inicioPesagem();
    },

    getContadores: function(){
//         console.log('Pesagens - getContadores');

        store = this.getStore('Pesagens');

        this.pesados = store.getTotalCount();
        this.peso_total = store.sum('peso');
        this.peso_medio = 0.00;
        if (this.pesados > 0){
            media = (this.peso_total / this.pesados);
            this.peso_medio = media.toFixed(2);
        }

        var grid = this.getPesagensGrid();

        grid.down('#tbpesados').setText('<b>Pesados: <font color="green">'+this.pesados+'</font></b>');

        grid.down('#tbpesototal').setText('<b>Peso Total: <font color="blue">'+this.peso_total+' Kg</font></b>');

        grid.down('#tbpesomedio').setText('<b>Peso Médio: <font color="blue">'+this.peso_medio+' Kg</font></b>');

        // Testar se Tem mais de Um Animal Se tiver Habilita o Bortao Finalizar
        if (this.pesados > 0){
            // Habilando o Botao de Finalizar
            this.getPesagensGrid().down('#btnPesar').setDisabled(false);
        }
    },

    /** Funcao: onBtnClickRelatorio
     * Funcao acionada quando se clica no botao Relatorio na Grid de Pesagem
     * Faz um Request para a funcao que gera o Relatorio em PDF
     */
    onBtnClickRelatorio: function(){
        console.log('Pesagens - onBtnClickRelatorio');

        grid = this.getPesagensGrid();

        data = Ext.Date.dateFormat(new Date(),'d-m-Y');

        Ext.ux.grid.Printer.mainTitle = 'Relatório de Pesagens Por Data';
        Ext.ux.grid.Printer.title2Tpl = [
            '<tpl">',
                '<table>',
                    '<tr>',
                        '<td>Confinamento: '+this.confinamento_nome+'</td>',
                        '<td>Data: '+data+'</td>',
                        '<td>Total Animais Pesados: '+this.pesados+'</td>',
                        '<td>Peso Total: '+this.peso_total+'</td>',
                        '<td>Peso Médio: '+this.peso_medio+'</td>',
                    '</tr>',
                '</table>',
            '</tpl>'
        ];
        Ext.ux.grid.Printer.printAutomatically = false;
        Ext.ux.grid.Printer.print(grid);

    }

});

