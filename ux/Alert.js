/**
 * Ux for alerts
 *
 * Fabio Jr. Policeno <fabiojpoli@hotmail.com> 
 * 26/11/2011
 */

Ext.define('Ext.ux.Alert', {
	msgAlert: null,

	/**
     * Show message of alert in top/center of app
     * @param {String} title Title of message
     * @param {String} msg Message
     * @param {String} type The type of alert (notification, information, success, warning e error)
     */
	alert: function(title, format, type) {
		var me = this,
			content,
			tpl,
			msgBox;

		if(!me.msgAlert)
		{
			me.msgAlert = Ext.core.DomHelper.insertFirst(Ext.getBody(), {cls: 'msg-box'}, true);
		}

		content = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
		tpl = '<div class="msg-' + type + '"><h3>' + title + '</h3><p>' + content + '</p></div>';
		
		me.msgBox = Ext.core.DomHelper.append(me.msgAlert, tpl, true);
		me.close();
	},
	
	close: function() {
		var me = this;
		if(me.msgBox) {
			me.msgBox.hide();
			me.msgBox.slideIn('t').ghost('t', {delay: 3000, remove: true});
		}
	}
}, 

function() {
	/**
	 * @class Ext.ux.Alert
	 * Singleton instance of {@link Abstracts.MessageBox}.
	 */
	Ext.ns('Ext.ux');
	Ext.ux.Alert = new this();
});