Ext.define('Rebanho.view.Tabpanel', {
    extend: 'Ext.tab.Panel',

    xtype : 'pageTab',


    /**
     * Metodo: novaAba() - Usado para adicionar uma nova aba no tabpanel central
     * recebe o nome da classe e instancia
     */
    novaAba:function(xtype){

        var tab = this.items.find(function( aba ){ return aba.xtype === xtype; });
        if (!tab){
            tab = this.add({
                xtype: xtype,
                closable: true
            });
        }
        this.setActiveTab(tab);
    }

    
});