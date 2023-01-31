sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/library",
	"sap/ui/thirdparty/jquery"
], function(Log, Controller, Sorter, JSONModel, DateFormat, ToolbarSpacer, library, jQuery) {
	"use strict";

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = library.SortOrder;

	return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {

		// _data : {
		// 	"date" : new Date()
		// },
		
		
		onInit : function() {
				
				this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			

		},

		onRouteMatched: function (oEvent) {
			//User Id der eingeloggt ist und den Urlaub beantragt hat
			var userId = oEvent.getParameter("arguments").userId;
			this.userId; 
			console.log("Die Eingeloggte UserId: " + userId);


			this.loadData();
			
			

		},
		loadData: function () {

			// MOCK-Data Team
			
			
			var oVacationModel = new sap.ui.model.json.JSONModel();
			oVacationModel.setData({
				urlaubsantraege: [{
					urlaubsid: 1,
					userid:1,
					pic: "",
					name: "Jens",
					vacation: 30,
					vacationLeft: 4,
					vacationPlaned: 3,
					vacationLastYear: 10,
					title: "Urlaub Jens",
					start:  new Date("2023/2/1").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					end: new Date("2023/2/5").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					
					},
				
				{
					urlaubsid: 2,
					userid:2,
					pic: "",
					name: "Ulla",
					vacation: 30,
					vacationLeft: 10,
					vacationPlaned: 10,
					vacationLastYear: 15,
					title: "Urlaub Ulla",
					start:  new Date("2023/2/10").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					end: new Date("2023/2/14").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					
				},
				{
					urlaubsid: 3,
					userid:3,
					pic: "",
					name: "Albert",
					vacation: 30,
					vacationLeft: 8,
					vacationPlaned: 15,
					vacationLastYear: 20,
					title: "Urlaub Albert",
					start:  new Date("2023/2/20").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					end: new Date("2023/2/22").toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"}),
					
				},
			]});
			
			// for (var i = 0; i < oVacationModel.urlaubsantraege.length; i++) {
			// 	var oVacation = oVacationModel.urlaubsantraege[i];
			// 	oVacation.start = this.formatDate(oVacation.start);
			// 	oVacation.end = this.formatDate(oVacation.end);
			// 	oVacation.push(oVacation);
			// 	}

			// debugger;
			

			
			this.getView().setModel(oVacationModel, "oVacationModel");
			
			//  Datum Formatieren für Ausgabe in Urlaubsverwaltung
			/*
			var oDatumFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});
			var sDatumFormatiert = oDatumFormat.format(oTeamModel.getProperty("/people/0/appointments/0/start")); 
			
			console.log("Hier müsste das Datum angezeigt weerdne." + sDatumFormatiert);
			debugger;
			this.getView().setModel(oTeamModel, "oTeamModel");*/
			
		
		
		 },

		 onEdit: function(){

			this.byId("editBtn").setVisible(false);
			this.byId("buchen").setVisible(true);
			this.byId("ablehnen").setVisible(true);
			this.byId("zurueck").setVisible(true);
		 },

		 onBack: function(){
			
			this.byId("editBtn").setVisible(true);
			this.byId("buchen").setVisible(false);
			this.byId("ablehnen").setVisible(false);
			this.byId("zurueck").setVisible(false);
		 }
		
	

		

	})

});