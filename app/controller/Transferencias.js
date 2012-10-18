Ext.define('Rebanho.controller.Transferencias', {
    extend: 'Ext.app.Controller',

    stores: [
        'Animais',
        'TransferenciaAnimais',
        'Transferencias',
        'Quadras',
    ],

    models: [
        'Rebanho.model.TransferenciaAnimal',
        'Rebanho.model.Transferencia',
    ],

    views: [
        'transferencias.SaidaForm',
        'transferencias.SaidaGrid',
        'transferencias.SaidaWindow',
        'transferencias.TransferenciasGrid',
        'transferencias.EntradaWindow',
        'transferencias.EntradaForm',
        'transferencias.EntradaGrid',
    ],

    refs: [
        {
            ref: 'saidaGrid',
            selector: 'saidagrid'
        },
        {
            ref: 'saidaForm',
            selector: 'saidaform'
        },
        {
            ref: 'saidaWindow',
            selector: 'saidawindow'
        },
        {
            ref: 'transferenciasGrid',
            selector: 'transferenciasgrid'
        },
        {
            ref: 'entradaWindow',
            selector: 'entradawindow'
        },
        {
            ref: 'entradaForm',
            selector: 'entradaform'
        },
        {
            ref: 'entradaGrid',
            selector: 'entradagrid'
        },

    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        this.getStore('Transferencias').on({
            scope:this,
            'saida': this.onCreateTransferencia,
            'transito': this.onFinalizarTransferencia,
            'entrada' : this.onEntradaTransferencia,
            'concluido': this.onConcluidoTransferencia,
        });

        this.getStore('TransferenciaAnimais').on({
            scope: this,
            'createAnimais': this.onCreateTransferenciaAnimais,
            'entradaAnimais': this.finalizarTransferencia,
        });

        this.control({

            // ----------< Actions da Window Transferencias - Saida >----------
            'saidawindow': {
                show: this.onShowSaidaWindow,
            },

            // ----------< Actions do Form Transferencias - Saida >----------
            'saidaform': {
                afterrender: this.onAfterRenderSaidaForm,
            },
            'saidaform [action=action_criarTransferencia]': {
                click: this.onClickBtnSaidaFormCriarTransferencia
            },
            'saidaform [action=action_finalizarTransferencia]': {
                click: this.onClickBtnSaidaFormFinalizarTransferencia
            },

            // ----------< Actions da Grid Transferencias - Saida >----------
            'saidagrid': {
                afterrender: this.onAfterRenderGridSaida,
                // DoubleClick em uma linha da Grid
                //itemdblclick: this.onItemDblClick,
            },

            'saidagrid [action=action_adicionar]': {
                click: this.onClickBtnSaidaGridAdicionar
            },
            'saidagrid [action=action_remover]': {
                click: this.onClickBtnSaidaGridRemover
            },
            'saidagrid [itemId=txtCodigoAnimal]': {
                keyup: this.onKeyUpSaidaTxtCodigo,
            },

            // ----------< Actions da Grid Transferencias>----------
            'transferenciasgrid': {
                afterrender: this.onAfterRenderGridTrasferencia,
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onItemDblClickGridTransferencia,
                 // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChangeTransferencia,
            },
            'transferenciasgrid [action=action_novaTransferencia]': {
                click: this.onClickBtnNovaTransferencia
            },
            'transferenciasgrid [action=action_excluirTransferencia]': {
                click: this.onClickBtnExcluirTransferencia
            },
            // ----------< Actions da Window Transferencias - Entrada >----------
            'entradawindow': {
                show: this.onShowEntradaWindow,
                afterrender: this.onAfterRenderEntradaWindow,
            },
            // ----------< Actions do Form Transferencias - Entrada >----------
            'entradaform [action=action_iniciarEntrada]': {
                click: this.onClickBtnEntradaFormIniciarEntrada
            },

            'entradaform [action=action_finalizarEntrada]': {
                click: this.onClickBtnEntradaFormFinalizarEntrada
            },
            // ----------< Actions da Grid Transferencias - Entrada >----------
            'entradagrid [itemId=txtEntradaCodigo]': {
                keyup: this.onKeyUpEntradaTxtCodigo,
            },

        });

    },

    // ----------< Metodos da Window de Saida >----------

    onShowSaidaWindow: function(){
        //console.log('Transferencias - onShowSaidaWindow');

        store = this.getStore('TransferenciaAnimais');
        store.removeAll();
        store.sync();
    },


    onLoadSaidaWindow: function(record){
        this.win = Ext.create('Rebanho.view.transferencias.SaidaWindow',{});

        if (this.transferencia){

            var transferencia = this.transferencia;
            var form = this.getSaidaForm().getForm();
            var grid = this.getSaidaGrid();
            var store = this.getStore('TransferenciaAnimais');

            // Setando a Transferencia no Form
            form.loadRecord(this.transferencia);

            // Carregando a Store de AnimaisTransferidos
            store.removeAll();

            if (transferencia.data.animais) {
                grid.setDisabled(true);
                this.getSaidaForm().down('#btnCriarTransferencia').setDisabled(true);
                this.getSaidaForm().down('#btnFinalizarTransferencia').setDisabled(true);
            }
            else {
                grid.setDisabled(false);
                this.getSaidaForm().down('#btnCriarTransferencia').setDisabled(true);
            }
        }
        else {
            console.log('nenhuma transferencia carregada');
        }

    },

    // ----------< Metodos do Form de Saida >----------

    onAfterRenderSaidaForm: function(){
        //console.log('Transferencias - onAfterRenderSaidaForm');

        // Setando o Atributo confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Recupero o Form
        var form = this.getSaidaForm();

        // Recupero a combo de origem
        var cmbOrigem = form.down('#cmbOrigem');

        // Recupero o Confinamento de Origem
        if (this.confinamento != 0){
            // se tiver um confinamento
            cmbOrigem.setValue(this.confinamento);
            cmbOrigem.setReadOnly(true);
        }
    },

    onClickBtnSaidaFormCriarTransferencia: function(){
        //console.log('Transferencias - onClickBtnSaidaFormCriarTransferencia');

        var form = this.getSaidaForm().getForm();

        if(form.isValid()){
            var values = form.getValues();

            this.inserirTransferencia(values);
        }
        else {
            Ext.ux.Alert.alert('Atenção!', 'Preencha todos os campos...', 'warning');
        }
    },

    inserirTransferencia: function(values){
        //console.log('Transferencias - inserirTransferencia');

        var store = this.getStore('Transferencias');

        var transferencia = Ext.create('Rebanho.model.Transferencia');
        transferencia.set(values);

        //console.log(values);
        // Verificar se a Origem e o destino sao diferentes
        if (transferencia.data.origem == transferencia.data.destino){
            Ext.ux.Alert.alert('Atenção!', 'Verifique o cadastro, a Origem e o Destino devem ser diferentes', 'warning');
        }
        else {
            // Setando o Status para 0 - Iniciando
            transferencia.set('status', 0);

            store.add(transferencia);

            store.sync();
        }
    },

    onClickBtnSaidaFormFinalizarTransferencia: function(){
        //console.log('Transferencias - onClickBtnSaidaFormFinalizarTransferencia');

        // Confirmar se quer mesmo finalizar
        Ext.Msg.show({
            title:'Finalizar Transferência?',
            msg: 'Confira Todos os Dados antes de Finalizar a Transferência, depois de finalizada não poderá mais alterar os registros!<br> Deseja mesmo Finalizar?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            scope: this,
            callback: function(btn){
                if (btn == 'yes'){
                    // Salva os animais que esta na grid
                    this.finalizar_inclusaoAnimais();

                }
            }
        });
    },

    // ----------< Metodos da Grid de Saida >----------

    onAfterRenderGridSaida: function(){
        //console.log('Transferencias - onAfterRenderSaidaGrid');

        // Recupero a Grid
        var grid = this.getSaidaGrid();
        var form = this.getSaidaForm().getForm();
        var values = form.getValues();
        // Verifica se o Form ja foi Salvo
        if (!values.id){
            // Desabilito a Grid e so habilito depois que salvar o form
            grid.disable();
        }
    },

    onClickBtnSaidaGridAdicionar: function(){
        //console.log('Transferencias - onClickBtnSaidaGridAdicionar');

        // Recuperar a Grid
        var grid = this.getSaidaGrid();
        // Recuperar o Campo Codigo
        var txtCodigo = grid.down('#txtCodigoAnimal');
        // Verificar se tem valor
        if (txtCodigo.getValue() > 0){
            // Se tiver adiciona
            var codigo = txtCodigo.getValue();

            // Localizar Animal
            this.localizarAnimal(codigo);
        }
        else {
            // Se Nao Tiver Mostra mensagem e seta o campo
            txtCodigo.focus();
            //Ext.ux.Alert.alert('Atenção!', 'Digite um Código de Animal e click em Adionar ou aperte a tecla Enter', 'warning');
        }
    },

    onClickBtnSaidaGridRemover: function(){
        //console.log('Transferencias - onClickBtnSaidaGridRemover');
        this.removerAnimalGrid();
    },

    onKeyUpSaidaTxtCodigo: function(field, e){
        ////console.log('Transferencias - onKeyUpSaidaTxtCodigo');
        // Verifica se foi um enter
        if(e.getKey() === e.ENTER){
            // Se for enter executa o metodo do click adicionar
            this.onClickBtnSaidaGridAdicionar();
        }
    },

    inserirAnimalnaGrid: function(animal){
        console.log('Transferencias - inserirAnimalnaGrid');
        // Recuperar a Grid
        var grid = this.getSaidaGrid();
        // Recuperar a Store
        var store = this.getStore('TransferenciaAnimais');
        // Recuperar o Campo Codigo
        var txtCodigo = grid.down('#txtCodigoAnimal');

        var form = this.getSaidaForm().getForm();

        var origem     = form.findField('origem').getValue();
        var destino    = form.findField('destino').getValue();
        var data_saida = form.findField('data_saida').getValue();
        var transferencia_id = form.findField('id').getValue();

        ////console.log(store.getById(animal.data.id));
        if (store.getById(animal.data.id)){
            //console.log('ja incluido');
        }
        else {
            // incluir o id da transferencia, origem, destino, data
            animal.set('transferencia_id', transferencia_id);
            animal.set('origem', origem);
            animal.set('destino', destino);
            animal.set('data_saida', data_saida);

            // Inserir o Animal na Store
            store.insert(0, animal);

            // Limpa o Campo para digitar de Novo
            txtCodigo.setValue('');
            txtCodigo.focus();

            this.contadorAnimais();
        }
    },

    removerAnimalGrid: function(){
        //console.log('Transferencias - removerAnimalGrid');

        // Recuperar a Grid
        var grid = this.getSaidaGrid();
        var store = grid.getStore();
        var records = grid.getSelectionModel().getSelection();

        // Verificar se Tem Registro a Excluir
        if(records.length === 0){
            Ext.ux.Alert.alert('Atenção!', 'Nenhum Registro selecionado...','warning');
        }else{
            // Confirmar a Exclusao
            Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="red"><b>Remover</b></font> este(s) Registro(s)?', function(btn){

                if (btn == 'yes'){
                    // Excluindo Usando a Store
                    store.remove(records);
                    this.contadorAnimais();
                }
            },this);
        }
    },


    finalizar_inclusaoAnimais: function(){
        //console.log('Transferencias - finalizar_inclusaoAnimais');
        var me = this;
        var grid = me.getSaidaGrid();
        var store = me.getStore('TransferenciaAnimais');
        var form = me.getSaidaForm();

        var origem = form.down('#cmbOrigem').getValue();

        var flag_erro = 0;

        store.each(function(record){
            // Verificar se todos os animais estao com peso
            if (record.data.peso <= 0){
                msg = 'Verifique se o Animal de Código: '+record.data.codigo+' está com Peso';
                Ext.ux.Alert.alert('Atenção!', msg, 'warning');

                // Incrementa a flag erro
                flag_erro++;
            }
            // Verificar se todos os animais sao do confinamento de origem
            if (record.data.confinamento_id != origem){
                msg = 'Verifique se o Animal de Codigo: ' +record.data.codigo+ ' está no confinamento de origem.'
                Ext.ux.Alert.alert('Atenção!', msg, 'warning');

                // Incrementa a flag erro
                flag_erro++;
            }
            record.set(origem);
        },this);

        if (flag_erro == 0){

            if (store.getModifiedRecords()){
                //console.log('Tem registros a modificar na Grid');
                //altera o action da store
                store.proxy.setExtraParam('action','insertAnimaisTransferencia');
                // Envia todos
                store.sync();
                //volta o action da store
                store.proxy.setExtraParam('action','');
            }
            else {
                //console.log('Não tem nada a modificar');
                this.onCreateTransferenciaAnimais();
            }

        }
    },

    onCreateTransferenciaAnimais: function(){
        //console.log('Transferencias - onCreateTransferenciaAnimais');

        me = this;
        store  = me.getStore('Transferencias');
        form   = me.getSaidaForm().getForm();
        values = form.getValues();
        storeAnimais = me.getStore('TransferenciaAnimais');
        animaisId = new Array();

        var transferencia = Ext.create('Rebanho.model.Transferencia');
        transferencia.set(values);

        // Setando o Status para 1 - Transporte
        transferencia.set('status', 1);
        // Setando o Campo animais - que e uma string id separados por ;

        storeAnimais.each(function(record){
            animaisId.push(record.data.id);
        }, this);

        //console.log(animaisId);
        stringAnimais = animaisId.join(';');
        //console.log(stringAnimais);

        transferencia.set('animais', stringAnimais);

        store.add(transferencia);

        store.sync();

    },

    // ----------< Metodos da Grig de Transferencias >----------

    onAfterRenderGridTrasferencia: function(){
        console.log('Transferencia - onAfterRenderGridTrasferencia');

        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();
        // Carregando a Store de Quadras
        this.getStore('Quadras').filter("confinamento_id", this.confinamento);

        // Carregando Store
        this.getStore('Transferencias').load();

    },

    onItemDblClickGridTransferencia: function(grid, record, element, index){
        console.log('Transferencia - onItemDblClickGridTransferencia');
        // Guardando o Registro da transferencia selecionada
        this.transferencia = record;

        // Saber pelo confinamento se o usuario ta vendo a Saida ou Entrada
        if (record.data.origem == this.confinamento){
            // Se o confinamento do usuario for o de origem abre a janela de SAIDA.
            console.log('origem e igual ao usuario, abra SAIDA');
            this.onLoadSaidaWindow(record);
        }
        else if (record.data.destino == this.confinamento) {
            // Se o confinamento do usuario for o de destino abre a janela de ENTRADA.
            console.log('destino e igual ao usuario, abra Entrada');

            if ((record.data.status == 1)||(record.data.status == 2)){
                console.log('Entrada Iniciada dar Continuidade');
                // Setando o Atributo Confinamento
                this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();
                // Carregando a Store de Quadras
                this.getStore('Quadras').filter("confinamento_id", this.confinamento);

                // Abrindo Janela de Entrada
                this.win = Ext.create('Rebanho.view.transferencias.EntradaWindow',{});
            }
            else if (record.data.status == 3) {
                console.log('Abrir Janela de Concluida');
            }
        }
    },

    onSelectChangeTransferencia: function (selModel, selections){
        record = selections[0];
        btn = this.getTransferenciasGrid().down('#btnExcluir');
        btn.setDisabled(true);
        if (record) {
            if (record.data.status == 0) {
                btn.setDisabled(selections.length === 0);
            }
        }
    },

    onClickBtnNovaTransferencia: function(){
        console.log('Transferencias - onClickBtnNovaTransferencia');

        // Abrir a janela de Cadastro transferencia de saida
        Ext.create('Rebanho.view.transferencias.SaidaWindow',{});
    },

    onClickBtnExcluirTransferencia: function(){
        console.log('Transferencias - onClickBtnExcluirTransferencia');

        var grid = this.getTransferenciasGrid();
        var store = this.getStore('Transferencias');
        var records = grid.getSelectionModel().getSelection();

        store.remove(records);
        store.sync();
    },

    // ----------< Metodos da Window de Entrada >----------
    onAfterRenderEntradaWindow: function(){
        // Setando o Atributo Confinamento
        this.confinamento = Ext.getCmp('main_viewport').getConfinamentoId();

        // Carregando a Store de Quadras
        this.getStore('Quadras').filter("confinamento_id", this.confinamento);
    },

    onShowEntradaWindow: function(){
        console.log('Transferencias - onShowEntradaWindow');

        if (this.transferencia){

            var transferencia = this.transferencia;
            var form = this.getEntradaForm().getForm();
            var store = this.getStore('TransferenciaAnimais');

            // Setando a Transferencia no Form
            form.loadRecord(this.transferencia);

            // Carregando a Store de AnimaisTransferidos
            store.removeAll();

            //altera o action da store
            store.proxy.setExtraParam('action','getAnimaisTransferencia');
            store.proxy.setExtraParam('transferencia_id',transferencia.data.id);
            // Carrega os animais na grid, usa o campo animais na tabela transferencia
            store.load();
            //volta o action da store
            store.proxy.setExtraParam('action','');
            store.proxy.setExtraParam('transferencia_id', 0);

            // Se estiver em transito
            if (transferencia.data.status == 1) {
                // Desabilitando a Grid
                this.getEntradaGrid().disable();
            }
            // Se estiver em Entrada dar Continuidade
            else if (transferencia.data.status == 2) {
                this.onEntradaTransferencia(store, transferencia.data);

            }
        }
        else {
            console.log('nenhuma transferencia carregada');
        }


    },

    // ----------< Metodos do Form de Entrada >----------
    onClickBtnEntradaFormIniciarEntrada: function(){
        console.log('Transferencias - onClickBtnEntradaFormIniciarEntrada');

        var form = this.getEntradaForm().getForm();
        var store = this.getStore('Transferencias');
        var values = form.getValues();
        var transferencia = Ext.create('Rebanho.model.Transferencia');

        if(form.isValid()){

            if (values.data_entrada >= values.data_saida) {

                transferencia.set(values);

                // Setando o Status para 2 - Entrada
                transferencia.set('status', 2);

                store.add(transferencia);

                store.sync();
            }
            else {
                Ext.ux.Alert.alert('Atenção!', 'Data de Entrada Menor do que a Data de Saída!', 'warning');
            }
        }
        else {
            Ext.ux.Alert.alert('Atenção!', 'Preencha todos os campos...', 'warning');
        }

    },

    onKeyUpEntradaTxtCodigo: function(field, e){
        //console.log('Transferencias - onKeyUpEntradaTxtCodigo');
        // Verifica se foi um enter
        if(e.getKey() === e.ENTER){
            // Se for enter executa o metodo do click adicionar
            this.onClickBtnGridEntradaAnimal();
        }
    },

    onClickBtnEntradaFormFinalizarEntrada: function(){
        console.log('Transferencias - onClickBtnEntradaFormFinalizarEntrada');
        var me = this;
        var store = me.getStore('TransferenciaAnimais');

        var form = me.getEntradaForm().getForm();
        var origem     = form.findField('origem').getValue();
        var destino    = form.findField('destino').getValue();
        var data_saida = form.findField('data_saida').getValue();
        var transferencia_id = form.findField('id').getValue();
        var data_entrada = form.findField('data_entrada').getValue();
        var quadra_id = form.findField('quadra_id').getValue();

        var flag_erro = 0 ;

        // Verificar se todos os registros da store estao completos
        store.each(function(record){

            console.log(record);
            if (record.data.sisbov){
                if (!record.data.peso){
                    Ext.ux.Alert.alert('Atenção!', 'É necessário que todos os registros tenham Peso, verifique o animal com o código: '+record.data.codigo_antigo, 'warning');
                    flag_erro++;
                }
            }
            else {
                Ext.ux.Alert.alert('Atenção!', 'É necessário que todos os registros tenham codigo do sisbov, verifique o animal com o código: '+record.data.codigo_antigo, 'warning');
                flag_erro++;
            }

            record.set('transferencia_id', transferencia_id);
            record.set('origem', origem);
            record.set('destino', destino);
            record.set('data_saida', data_saida);
            record.set('data_entrada', data_entrada);
            record.set('quadra_id', quadra_id);

        }, this);

        if (flag_erro == 0){

            // Confirmar se quer mesmo finalizar
            Ext.Msg.show({
                title:'Finalizar Transferência?',
                msg: 'Confira Todos os Dados antes de Finalizar a Transferência, depois de finalizada não poderá mais alterar os registros!<br> Deseja mesmo Finalizar?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                scope: this,
                callback: function(btn){
                    if (btn == 'yes'){
                        // Salva os animais que esta na grid
                        this.finalizarEntrada();
                    }
                }
            });
        }
    },

    // ----------< Metodos da Grid de Entrada >----------
    onClickBtnGridEntradaAnimal: function(){
        console.log('Transferencias - onClickBtnGridEntradaAnimal');

        // Recuperar a Grid
        var grid = this.getEntradaGrid();
        var store = this.getStore('TransferenciaAnimais');

        // Recuperar o Campo Codigo
        var txtCodigo = grid.down('#txtEntradaCodigo');

        // Verificar se tem valor
        if (txtCodigo.getValue() > 0){
            // Se tiver adiciona
            var codigo = txtCodigo.getValue();

            // Localizar Animal na Store
            var animal = store.findRecord('codigo_antigo', codigo);

            if (animal){
                // Chamar a Funcao de Digitar Codigo Novo
                this.digitarCodigoSisbov(animal);
            }
            else {
                Ext.ux.Alert.alert('Atenção!', "Nenhum Animal encontrado como o Codigo: <font color=red> "+codigo+"</font>",'warning');
            }

            // Chamar a Funcao de Digitar Peso
            //this.localizarAnimal(codigo);
        }
        else {
            // Se Nao Tiver Mostra mensagem e seta o campo
            txtCodigo.focus();
        }
    },


    // ----------< Metodos da Auxiliares >----------

    localizarAnimal: function(codigo){
        //console.log('Transferencias - localizarAnimal('+codigo+')');

        // Recuperar a Origem
        var cmbOrigem = this.getSaidaForm().down('#cmbOrigem');
        var origem = cmbOrigem.getValue();

        Ext.Ajax.request({
            url : 'php/main.php',
            method : 'POST',
            params: {
                classe: 'Transferencias',
                action: 'getAnimal',
                codigo: codigo,
                origem: origem,
            },
            scope:this,
            success: function ( result, request ) {
                var retorno = Ext.decode(result.responseText);
                if (retorno.success){
                    // criando um record
                    var record = Ext.create('Rebanho.model.TransferenciaAnimal', retorno.animal);

                    // Pergunta o Peso do Animal 
                    this.digitarPeso(record);
                }
                else {
                    Ext.ux.Alert.alert('Atenção', retorno.message, 'warning');
                    return false;
                }
            },
        });

    },

    digitarPeso: function(animal){

        // Setando a Mensagem
        msg = 'Entre com o Peso do Animal: <font color=blue>' + animal.data.codigo +'</font>';

        Ext.Msg.show({
            title:'Peso do Animal',
            msg: msg,
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
                            animal.set('peso', peso);

                            // Se o Animal tiver o campo sisbov, e porque e uma entrada nao usar esse metodo.
                            if (animal.data.sisbov) {
                                // Se tiver codigo sisbov nao faz nada
                                this.getEntradaGrid().down('#txtEntradaCodigo').setValue('');
                                this.getEntradaGrid().down('#txtEntradaCodigo').focus();
                            }
                            else {
                                // Se nao Tiver insere na grid
                                this.inserirAnimalnaGrid(animal);
                            }

                        }
                        else {
                            // Peso Negativo Digitar de Novo
                            Ext.BoxMsg.msg('<font color=#D5D500>Atenção!</font>', 'Peso Deve ser Valor Positivo!');
                            this.digitarPeso();
                        }
                    }
                }
            }
        });
    },

    digitarCodigoSisbov: function(animal){

        // Setando a Mensagem
        msg = 'Entre com o Código SisBov.<br> Para o Animal:  <font color=blue>' + animal.data.codigo +'</font>';

        Ext.Msg.show({
            title:'Código SisBov do Animal',
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: 'icon-barcode-32',
            minWidth: 250,
            width: 300,
            scope: this,
            prompt: true,
            callback: function(btn, sisbov){
                if (btn == 'ok'){
                    // Verifica se tem PESO
                    if (sisbov != ''){

                        if (sisbov > 0) {
                            animal.set('sisbov', sisbov);
                            animal.set('codigo', sisbov);

                            this.digitarPeso(animal);
                        }
                        else {
                            // Peso Negativo Digitar de Novo
                            Ext.BoxMsg.msg('<font color=#D5D500>Atenção!</font>', 'Codigo Deve ser Valor Positivo!');
                            this.digitarCodigoSisbov();
                        }
                    }
                }
            }
        });
    },

    contadorAnimais:function(){
        // Recuperar a Store
        var store = this.getStore('TransferenciaAnimais');
        // Recuperar o Form
        var form = this.getSaidaForm().getForm();


        // Quantidade Total
        var quantidade = store.count();

        // Machos e Femeas
        var machos = 0;
        var femeas = 0;
        store.each( function(record){
            if (record.data.sexo == 'M'){
                machos++;
            }
            else{
                femeas++;
            }
        }, this);

        // Setando os Fields
        form.findField('quantidade').setValue(quantidade);
        form.findField('machos').setValue(machos);
        form.findField('femeas').setValue(femeas);

        // Se a Quantidade for Maior que um Habilito o Botao de Finalizar no Form
        this.getSaidaForm().down('#btnFinalizarTransferencia').setDisabled(false);

    },

    onCreateTransferencia: function(store, data){
        //console.log('Transferencias - onCreateTransferencia');

        var record = Ext.create('Rebanho.model.Transferencia', data);
        // Setando o Retorno da Create no Form para ter o id
        this.getSaidaForm().getForm().loadRecord(record);

        // Habilito a Grid para inclusao de animais
        this.getSaidaGrid().setDisabled(false);
        // Desabilito o botao de Criar no Form
        this.getSaidaForm().down('#btnCriarTransferencia').setDisabled(true);
    },


    onFinalizarTransferencia: function(store, data){
        //console.log('Transferencias - onFinalizarTransferencia');

        // Desabilitar os Botoes;
        this.getSaidaForm().down('#btnFinalizarTransferencia').setDisabled(true);
        this.getSaidaGrid().down('#btnAdicinar').setDisabled(true);
        this.getSaidaGrid().down('#btnRemover').setDisabled(true);

        // Mostrar Mesagem de Sucesso
        Ext.ux.Alert.alert('Success', 'Transferencia Realizada com Sucesso!', 'success');
    },

    onEntradaTransferencia: function(store, data){
        console.log('Transferencias - onEntradaTransferencia');

        var record = Ext.create('Rebanho.model.Transferencia', data);
        // Setando o Retorno da Create no Form
        this.getEntradaForm().getForm().loadRecord(record);

        this.transferencia = record;

        // Habilito a Grid para a Pesagem de Animais
        this.getEntradaGrid().setDisabled(false);
        // Desabilito o botao de Criar no Form
        this.getEntradaForm().down('#btnIniciarEntrada').setDisabled(true);
        // Habilito o Botao de Finalizar no Form
        this.getEntradaForm().down('#btnFinalizarEntrada').setDisabled(false);

        this.getEntradaGrid().down('#txtEntradaCodigo').focus();

    },

    finalizarEntrada: function (){
        console.log('Transferencias - finalizarEntrada');

        var me = this;
        var store = me.getStore('TransferenciaAnimais');

        store.proxy.setExtraParam('action','entradaAnimais');
        // Envia todos
        store.sync();
        //volta o action da store
        store.proxy.setExtraParam('action','');
    },

    finalizarTransferencia: function (){
        console.log('Transferencias - finalizarTransferencia');

        var form = this.getEntradaForm().getForm();
        var store = this.getStore('Transferencias');

        transferencia = form.getRecord();
        console.log(transferencia);
        transferencia.set('status', 3);

        store.add(transferencia);
        store.sync();

    },

    onConcluidoTransferencia: function(store, data){
        console.log('Transferencias - onConcluidoTransferencia');

        Ext.ux.Alert.alert('Sucesso!', 'A Transferência foi Realizada com Sucesso!', 'success');

        this.getEntradaForm().down('#btnFinalizarEntrada').setDisabled(true);
    },
});

