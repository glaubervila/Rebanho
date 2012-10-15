Ext.define('Rebanho.controller.Transferencias', {
    extend: 'Ext.app.Controller',

    stores: [
        'Animais',
        'TransferenciaAnimais',
        'Transferencias',
    ],

    models: [
        'Rebanho.model.TransferenciaAnimal',
        'Rebanho.model.Transferencia',
    ],

    views: [
        'transferencias.SaidaForm',
        'transferencias.SaidaGrid',
        'transferencias.SaidaWindow',
        'transferencias.TransferenciasGrid'
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

    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        this.getStore('Transferencias').addListener('create', this.onCreateTransferencia, this);
        this.getStore('Transferencias').addListener('finalizar', this.onFinalizarTransferencia, this);

        this.getStore('TransferenciaAnimais').addListener('createAnimais', this.onCreateTransferenciaAnimais, this);

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

        });

    },

    // ----------< Metodos da Window de Saida >----------

    onShowSaidaWindow: function(){
        //console.log('Transferencias - onShowSaidaWindow');

        store = this.getStore('TransferenciaAnimais');
        store.removeAll();
        store.sync();
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

        // Setando o Status para 0 - Iniciando
        transferencia.set('status', 0);

        store.add(transferencia);

        store.sync();
 
    },


    onClickBtnSaidaFormFinalizarTransferencia: function(){
        //console.log('Transferencias - onClickBtnSaidaFormFinalizarTransferencia');

        // Salva os animais que esta na grid
        this.finalizar_inclusaoAnimais();

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
        //console.log('Transferencias - inserirAnimalnaGrid');
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

    // ----------< Metodos da Genericos >----------

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

                            this.inserirAnimalnaGrid(animal);
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

        // Menor Peso
        var peso_minimo = store.min('peso');
        // Maior Peso
        var peso_maximo = store.max('peso');
        // Peso Medio
        var media = store.sum('peso') / quantidade;
        var peso_medio = Ext.util.Format.round((media), 3);


        // Setando os Fields
        form.findField('quantidade').setValue(quantidade);
        form.findField('machos').setValue(machos);
        form.findField('femeas').setValue(femeas);

        form.findField('peso_minimo').setValue(peso_minimo);
        form.findField('peso_medio').setValue(peso_medio);
        form.findField('peso_maximo').setValue(peso_maximo);

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
    }
});

