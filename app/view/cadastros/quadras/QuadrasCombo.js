Ext.define('Rebanho.view.cadastros.quadras.QuadrasCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbquadras',

    name      : 'quadra_id',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'quadra',

    width: 200,

    emptyText: 'Selecione uma Quadra',
    submitEmptyText: false,

    initComponent: function() {

        this.store = 'Quadras';

        this.callParent(arguments);

    },


    /** Funcao: filtrarConfinamento
     * Recebe um id de confinamento
     * e filtra as quadras que pertencem a este confinamento
     */
    filtrarConfinamento: function(confinamento){
        console.log('QuadrasCombo - filtrarConfinamento');

        //this.setValue('');
        store = this.getStore('Quadras');

        // Limpando a Store
        store.removeAll();
        store.clearFilter(true);

        store.filter("confinamento_id", confinamento);
    },

});