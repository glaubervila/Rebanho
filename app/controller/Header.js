Ext.define('Rebanho.controller.Header', {
    extend: 'Ext.app.Controller',
    views: ['Rebanho.view.layout.Header'],

    stores: ['Logged'],

    refs: [
        {
            ref: 'Header',
            selector: 'header',
        },
    ],

    init: function() {

        this.control({

            'header': {
                afterrender: this.headerAfterRender
            },
        });
    },

    headerAfterRender: function(){
        //console.log('Header - AfterRender');

    }
});


