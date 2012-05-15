Ext.define('Rebanho.controller.Usuarios', {
    extend: 'Ext.app.Controller',

    stores: ['Usuarios'],

    models: ['Usuario'],

    views: [
        'usuarios.UsuariosPanel',
        'usuarios.UsuariosGrid',
        'usuarios.UsuariosForm',
    ],

    refs: [
        {
            ref: 'usuariosGrid',
            selector: 'usuariosgrid'
        },
        {
            ref: 'usuariosForm',
            selector: 'usuariosform'
        },
        {
            ref: 'usuariosForm',
            selector: 'usuariosform'
        },

    ],
    init: function() {
        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo
            'usuariosgrid button[action=action_novo]': {
                click: this.onBtnNovoClick
            },

            'usuariosgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectUsuario,
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onEditUsuario,
            },

            // Ao Clicar no Botao Excluir na Grid
            'usuariosgrid button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            // Ao Clicar no Botao Editar na Grid
            'usuariosgrid button[action=action_editar]': {
                click: this.onBtnEditarClick
            },

            // ----------< Actions do Form >----------

            // Ao Clicar no Botao Novo, Usa a Mesma Funcao da Grid
            'usuariosform button[action=action_novo]': {
                click: this.onBtnNovoClick
            },

            // Ao Clicar no Botao Salvar
            'usuariosform button[action=action_salvar]': {
                click: this.onBtnSalvarClick
            },

            // Ao Clicar no Botao Excluir
            'usuariosform button[action=action_excluir]': {
                click: this.onBtnExcluirClick
            },

            // Ao Clicar no Botao Cancelar
            'usuariosform button[action=action_cancelar]': {
                click: this.onBtnCancelarClick
            },

        });
    },

    /**Funcao: onBtnNovoClick()
     * Funcao executada quando se Clica no Botao 'Novo' na Grid
     * Se o Painel do Form estiver oculto, Mostra o Form
     * Reseta o Form
     */
    onBtnNovoClick: function(btn, pressed){

        // Recupera o Form
        var usuariosForm = this.getUsuariosForm();

        // Reseta o Formulario
        usuariosForm.getForm().reset();

        // Expande o Painel Mostrando o Formulario
        usuariosForm.expand();

    },


    /**Funcao: onEditUsuario()
     * Funcao executada quando se faz um duplo click em um registro na grid
     * ou quando se seleciona um registro e clica em 'Editar'
     * recupera o registro e seta o registro no formulario
     */
    onEditUsuario: function (model, record){

        // Se tiver registro selecionado
        if (record) {

            // Recupera o Form
            var usuariosForm = this.getUsuariosForm();

            // Expandir o Formulario
            usuariosForm.expand();

            // Seta o Registro no Form
            usuariosForm.getForm().loadRecord(record);
        }
    },

    /**Funcao: onSelectUsuario()
     * Funcao executada quando se seleciona um registro na grid
     * Controla os Botoes de Editar e Excluir
     */
    onSelectUsuario: function (model, records){
        
        var btnEditar = Ext.getCmp('btnUsuariosEditar');
        var btnExcluir = Ext.getCmp('btnUsuariosExcluir');

        if (records[0]){
            btnEditar.enable();
            btnExcluir.enable();
        }
        else {
            btnEditar.disable();
            btnExcluir.disable();
        }
    },

    /**Funcao: onBtnEditarClick()
     * Funcao executada quando se Clica no Botao 'Editar' da Grid
     * Recupera o Registro e chama a funcao onEditUsuario(null,registro)
     */
    onBtnEditarClick: function(btn, pressed){

        var records = this.getUsuariosGrid().getSelectionModel().getSelection();
        var data = records[0];

        if (data){
            this.onEditUsuario(null,data);
        }
    },
    /**Funcao: onBtnSalvarClick()
     * Funcao executada quando se Clica no Botao 'Salvar' no Form
     * Faz um Submit no Form
     * Reseta o Form
     */
    onBtnSalvarClick: function(btn, pressed){

        // Recupera o Form
        var usuariosForm = this.getUsuariosForm();

        // Verifica se é Valido
        if(usuariosForm.getForm().isValid()){

            // Recupera os dados do Formulario
            var data = this.getUsuariosForm().getForm().getValues();

            var store = this.getStore('Usuarios');

//             // Criando o Registro pela Store
//             store.add(data);

            // Criando o Registro pelo Model
            // Cria um Model
            var usuario = Ext.create('Usuario', data);

            // Executa o Metodo 'save' do Model
            usuario.save({
                scope: this,
                success: function(model, action) {

                    var obj = Ext.decode(action.response.responseText);

                    if (obj.success == true){
                        // Retorna Sucesso
                        Ext.BoxMsg.msg('Sucesso!', 'Registro Incluido Com Sucesso');

                        // Da Reload na Store
                        this.getStore('Usuarios').load();
                    }
                    else {
                        Ext.MessageBox.show({ title:'Desculpe!', msg: obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                    }

                },

            });
        }
    },


    /**Funcao: onBtnExcluirClick()
     * Funcao executada quando se Clica no Botao 'Excluir' no Form
     * Confirma a Exclusao
     * Recupera a Store e destroy o registro
     */
    onBtnExcluirClick: function(btn, pressed){

        // Se o Botao for da Grid Recuperar o Registro Selecionado
        // Se o Botao for do Form Recuperar os Dados do Form
        if (btn.id == 'btnUsuariosExcluir'){

            // Recuperando a Linha Selecionada
            var records = this.getUsuariosGrid().getSelectionModel().getSelection();
            var data = records[0];
        }
        else {
            // Recuperando os Valores do Form
            var data = this.getUsuariosForm().getForm().getValues();
        }

        // Verificar se Tem Registro a Excluir
        if (data.id) {

            // Confirmar a Exclusao
            Ext.MessageBox.confirm('Confirmação', 'Deseja Mesmo <font color="red"><b>EXCLUIR</b></font> este(s) Registro(s)?', function(btn){

                if (btn == 'yes'){
                    
//                     // Excluindo Usando a Store
//                     store.remove(store.getById(data.id));

                    // Excluindo Usando um Model
                    // Cria um Model
                    var usuario = Ext.create('Usuario', data);

                    // Executa o Metodo 'destroy' do Model
                    usuario.destroy({
                        scope: this,
                        success: function(model, action) {
                            var obj = Ext.decode(action.response.responseText);

                            if (obj.success == true){
                                // Retorna Sucesso
                                Ext.BoxMsg.msg('Sucesso!', 'Registro Excluido Com Sucesso');

                                // Da Reload na Store
                                this.getStore('Usuarios').load();
                            }
                            else {
                                Ext.MessageBox.show({ title:'Desculpe!', msg: obj.msg, buttons: Ext. MessageBox.OK, icon:  Ext.MessageBox.ERROR })
                            }
                        },
                    });

                }
            },this);
        }

    },



    /**Funcao: onBtnCancelarClick()
     * Funcao executada quando se Clica no Botao 'Cancelar' no Form
     * Reseta o Formulario
     * Esconde o painel do Form
     */
    onBtnCancelarClick: function(btn, pressed){

        // Recupera o Form
        var usuariosForm = this.getUsuariosForm();

        // Reseta o Formulario
        usuariosForm.getForm().reset();

        // Esconde o Painel
        usuariosForm.collapse();

    },
});