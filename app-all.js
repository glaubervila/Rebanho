/*
Copyright(c) 2012 Company Name
*/
Ext.Loader.setConfig({enabled:true,paths:{Rebanho:"app"}});Ext.application({name:"Rebanho",autoCreateViewport:true,enableQuickTips:true,paths:{Ext:"extjs/src","Ext.ux":"ux",},requires:["Rebanho.Initialization","Ext.ux.grid.Printer","Ext.ux.Alert",],appFolder:"app",enableRouter:true,routes:{"/":"viewport#index",login:"authentication#index",home:"home#index"},launch:function(){var a=function(){Ext.fly("loading-mask").animate({opacity:0,remove:true})};Ext.defer(a,250)},controllers:["Viewport","Header","CompraAnimais","EntradaAnimais","Fornecedores","Ocorrencias","Pesagens","Animais","PesosPorAnimal","Usuarios","Caracteristicas","Confinamentos","Cepeas","Quadras","Vacinas","Transferencias","Clientes"],});
