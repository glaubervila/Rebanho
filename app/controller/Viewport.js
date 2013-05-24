Ext.define('Rebanho.controller.Viewport', {
    extend: 'Ext.app.Controller',
    views: ['layout.Header','layout.Footer','layout.Middle', 'layout.Appview','home.Home'],

    defaultItem:{
        id:'viewport_default',
        region:'center',
        layout:'fit',
        border:0,
        html: 
        "<p align='center'>" +
        "    <img src='resources/logo-sencha-sm.png' alt='Logo' />" +
        "</p>"
    },

    init: function() {
        this.control({
            'viewport': {
                render: this.onViewportRendered,
                afterrender: this.onViewportAfterRender,
            }
        });
    },

    index:function(){
            this.render('home.Home');
    },

    onViewportRendered: function(p) {
        //console.log("Viewport - onViewportRendered");

        p.add(this.defaultItem);

        this.index();
    },

    onViewportAfterRender: function(p){
        //console.log("Viewport - onViewportAfeterRender");

    },

});
