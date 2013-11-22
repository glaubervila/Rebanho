/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

 Ext.application({
    name: 'TileViewer',

    appFolder:'../static/javascript/tileViewer',

    controllers: [
        'TileViewer',
        'TileList',
        'TileMosaic',
    ],

    autoCreateViewport: true,

    enableQuickTips: true,

    init: function() {
      console.log('App - init()');
    },

    launch: function(profile){
        console.log("app.launch(%o)", profile);

    }
});
