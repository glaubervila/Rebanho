Ext.define('Rebanho.view.cadastros.vacinas.VacinasCombo', {

    extend    : 'Ext.form.field.ComboBox',

    alias     : 'widget.cmbvacinas',

    name      : 'vacina_id',

    typeAhead : true,

    triggerAction: 'all',

    valueField: 'id',

    displayField: 'vacina',

    width: 200,

    emptyText: 'Selecione uma Vacina',
    submitEmptyText: false,

    initComponent: function() {

        this.store = 'Vacinas';

        this.callParent(arguments);

    },


    /** Funcao: filtrarVacinas
     * Recebe um id de confinamento
     * e filtra as Vacinas que pertencem a este confinamento
     * e que estejam Ativas
     */
    filtrarVacinas: function(confinamento){
        console.log('VacinasCombo - filtrarVacinas');

        //this.setValue('');
        store = this.getStore('Vacinas');

        // Limpando a Store
        store.removeAll();
        store.clearFilter(true);

        store.filter([
            {property: "confinamento_id", value: confinamento},
            {property: "status", value: 1},
        ]);

    },

});