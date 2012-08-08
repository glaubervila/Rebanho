Ext.define('Rebanho.view.Viewport', {
    extend: 'Ext.container.Viewport',

//config options
    id: 'main_viewport',
    layout: 'fit',

    usuario: false,
    confinamento_id: 0,
    confinamento: false,



// Metodos
    getConfinamento:function(){
        return this.confinamento;
    },

    getConfinamentoId:function(){
        return parseInt(this.confinamento_id);
        //return this.confinamento_id;
    },

});
