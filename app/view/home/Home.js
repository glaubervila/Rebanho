Ext.define('Rebanho.view.home.Home', {
    extend        : 'Ext.tab.Panel',

    alias         : 'widget.homehome',

    id            : 'mainTabpanel',

    deferredRender: false,

    layout        :'fit',

    /**
     * Metodo: novaAba() - Usado para adicionar uma nova aba no tabpanel central
     * recebe o nome da classe e instancia
     */
    novaAba:function(xtype){

        var tab = this.items.findBy(function( aba ){ return aba.xtype === xtype; });
        if (!tab){
            tab = this.add({
                xtype: xtype,
                closable: true
            });
        }
        this.setActiveTab(tab);
    },

    /** Funcao: fecharAbaAtiva
     * Recupera a Aba Ativa e executa o Metodo Close
     */
    fecharAbaAtiva:function(){
        var tabativa = this.getActiveTab();
        tabativa.close();
    },
});
