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

		onInit : function() {
				
				this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			

		},

		onRouteMatched: function (oEvent) {

			var userId = oEvent.getParameter("arguments").userId;
			debugger;
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
							start: new Date(2023, 2, 1, 11, 30),
							end: new Date(2023, 2, 3, 11, 30),
					
					},
				
				{
					urlaubsid: 2,
					userid:2,
					pic: "",
					name: "Ulla",
					vacation: 25,
					vacationLeft: 10,
					vacationPlaned: 10,
					vacationLastYear: 15,
					title: "Urlaub Ulla",
							start: new Date(2023, 2, 3, 11, 30),
							end: new Date(2023, 2, 5, 11, 30),
					
				},
				{
					urlaubsid: 3,
					userid:3,
					pic: "",
					name: "Albert",
					vacation: 20,
					vacationLeft: 8,
					vacationPlaned: 15,
					vacationLastYear: 20,
					title: "Urlaub Albert",
							start: new Date(2023, 2, 8, 11, 30),
							end: new Date(2023, 2, 10, 11, 30),
					
				},
			]});
			
			
			
			this.getView().setModel(oVacationModel, "oVacationModel");
			

			/*  Datum Formatieren für Ausgabe in Urlaubsverwaltung
			
			var oDatumFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd.MM.yyyy"
			});
			var sDatumFormatiert = oDatumFormat.format(oTeamModel.getProperty("/people/0/appointments/0/start")); 
			
			console.log("Hier müsste das Datum angezeigt weerdne." + sDatumFormatiert);
			debugger;
			this.getView().setModel(oTeamModel, "oTeamModel");
			*/
		
		
		 }
		// urlaubPushVerwaltung: function (sUrlaubStart, sUrlaubEnde) {
		// 	console.log("US: " + sUrlaubStart + "UE: " + sUrlaubEnde)
		// 	}


		

	})

});