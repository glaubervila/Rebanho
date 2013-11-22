Ext.define('TileViewer.controller.TileViewer', {
    extend: 'Ext.app.Controller',

    views: [
        'Viewport',
        'TileViewerNorth',
        'TileViewerTabPanel'
    ],

    init: function() {
        console.log("TileViewer - init()");

//         // separating the GET parameters from the current URL
//         var getParams = document.URL.split("?");
//         // transforming the GET parameters into a dictionnary
//         var params = Ext.urlDecode(getParams[getParams.length - 1]);
// 
//         console.log("Params = %o",params);

        this.control({

        })

    }
});