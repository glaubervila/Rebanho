/**
 * @class Ext.ux.Toast
 * Passive popup box (a toast) singleton
 * @singleton
 */
Ext.ux.Msg = function() {
    var msgCt;

    function createBox(t, s){
       return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    }

    return {
                /**
                 * Shows popup
                 * @member Ext.ux.Toast
                 * @param {String} title
                 * @param {String} format
                 */
        msg : function(title, format){
            if(!msgCt){
                msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
            }
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1000, remove: true});
        }
        }

}();
