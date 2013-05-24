Ext.define('Rebanho.controller.Relatorios', {
    extend: 'Ext.app.Controller',

    stores: [],

    models: [
        'Rebanho.model.Relatorio',
    ],

    views: [
         'relatorios.RelatoriosWindow',
         'relatorios.RelatoriosForm',
    ],

    refs: [
/*        {
            ref: 'vacinasGrid',
            selector: 'vacinasgrid'
        },*/
    ],

    // Chave estrangeira confinamento_id
    confinamento: 0,

    init: function() {

        // ----------< Actions no Store >----------
        // Load da Store
//         this.getVacinasStore().addListener('load',this.onStoreLoad, this);

        this.control({

            // ----------< Actions do Grid >----------

            // Ao Clicar no Botao Novo

//             'vacinasgrid button[action=action_novo]': {
//                 click: this.onBtnNovoClick
//             },
//             // Ao Clicar no Botao Excluir na Grid
//             'vacinasgrid button[action=action_excluir]': {
//                 click: this.onBtnExcluirClick
//             },

/*            'vacinasgrid': {
                // Ao Selecionar um Registro na Grid
                selectionchange: this.onSelectChange,
                render:function(){
                    this.getVacinasStore().load();
                },
                // DoubleClick em uma linha da Grid
                itemdblclick: this.onBtnEditarClick,

            },
*/
        });

    },


});


