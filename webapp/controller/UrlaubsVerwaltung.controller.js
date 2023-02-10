sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/library",
	"sap/m/MessageToast",
	"sap/ui/thirdparty/jquery"
], function (Log, Controller, MessageToast, Sorter, JSONModel, DateFormat, ToolbarSpacer, library, jQuery) {
	"use strict";

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = library.SortOrder;

	return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {

		// _data : {
		// 	"date" : new Date()
		// },


		//Tessst Push

		onInit: function () {

			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);

			//Selection Modus aus
			this.onDeactivateSelectionMode();




		},

		onRouteMatched: function (oEvent) {
			//User Id der eingeloggt ist und den Urlaub beantragt hat
			var userId = oEvent.getParameter("arguments").userId;
			this.userId;
			console.log("Die Eingeloggte UserId: " + userId);


			this.loadData();



		},
		loadData: function () {
/*--------------------------------------Abfrage Welche urlaube mit dem Satutus "beantrag" sind und Lade sie in die View------------------*/










/*------------------------------------------------------------------------------------------------------------------------ Mock DAta

			// MOCK-Data Team


			var oVacationModel = new sap.ui.model.json.JSONModel();
			oVacationModel.setData({
				urlaubsantraege: [{
					urlaubsid: 1,
					userid: 1,
					pic: "",
					name: "Jens",
					vacation: 30,
					vacationLeft: 4,
					vacationPlaned: 3,
					vacationLastYear: 10,
					title: "Urlaub Jens",
					start: new Date("2023/2/1").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
					end: new Date("2023/2/5").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),

				},

				{
					urlaubsid: 2,
					userid: 2,
					pic: "",
					name: "Ulla",
					vacation: 30,
					vacationLeft: 10,
					vacationPlaned: 10,
					vacationLastYear: 15,
					title: "Urlaub Ulla",
					start: new Date("2023/2/10").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
					end: new Date("2023/2/14").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),

				},
				{
					urlaubsid: 3,
					userid: 3,
					pic: "",
					name: "Albert",
					vacation: 30,
					vacationLeft: 8,
					vacationPlaned: 15,
					vacationLastYear: 20,
					title: "Urlaub Albert",
					start: new Date("2023/2/20").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
					end: new Date("2023/2/22").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),

				},
				]
			});

			// for (var i = 0; i < oVacationModel.urlaubsantraege.length; i++) {
			// 	var oVacation = oVacationModel.urlaubsantraege[i];
			// 	oVacation.start = this.formatDate(oVacation.start);
			// 	oVacation.end = this.formatDate(oVacation.end);
			// 	oVacation.push(oVacation);
			// 	}

			// debugger;



			this.getView().setModel(oVacationModel, "oVacationModel");
-------------------------------------------------------------------------------------------------------------------Mockdata Ende---------------------------------------------------------*/






		},

		onEdit: function () {
			this.byId("table").setSelectionMode("MultiToggle");
			this.byId("editBtn").setVisible(false);
			this.byId("buchen").setVisible(true);
			this.byId("ablehnen").setVisible(true);
			this.byId("zurueck").setVisible(true);

		},

		onBack: function () {

			this.byId("editBtn").setVisible(true);
			this.byId("buchen").setVisible(false);
			this.byId("ablehnen").setVisible(false);
			this.byId("zurueck").setVisible(false);
			this.byId("table").setSelectionMode("None");
		},

		onActivateSelectionMode: function () {

			this.byId("table").setSelectionMode("MultiToggle");


		},

		onDeactivateSelectionMode: function () {

			this.byId("table").setSelectionMode("None");



		},

		onBock: function () {
			

			//wieso Funktioniert der Befehl nur wenn ich sap.m.Message davor schreibe?
			//obwohl ich "sap/m/MessageToast", eingebunden habe?
			

			var oTable = this.byId("table");
			var aSelectedIndices = oTable.getSelectedIndices();

			var aUrlaubName = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var oSelectedContext = oTable.getContextByIndex(aSelectedIndices[i]);
				var oSelectedData = oSelectedContext.getObject();

				aUrlaubName.push(oSelectedData.name);


			}

			console.log(" Glückwunsch Urlaub für Folgende MA genehmigt! " + aUrlaubName);
			sap.m.MessageToast.show("Glückwunsch Urlaub für Folgende MA genehmigt! " + aUrlaubName);

			//Entfernen von Datensätzen
			this.deleteSelectedIndices(aSelectedIndices, oTable);
		


		
		},

		onDecline: function () {

			var oTable = this.byId("table");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aUrlaubName = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var oSelectedContext = oTable.getContextByIndex(aSelectedIndices[i]);
				var oSelectedData = oSelectedContext.getObject();

				aUrlaubName.push(oSelectedData.name);

			}
			console.log("var aUrlaubName " + aUrlaubName);
			sap.m.MessageToast.show("Pech gehabt...  Urlaub für Folgende MA abgelehnt! " + aUrlaubName);


			//Entfernen von Datensätzen
			this.deleteSelectedIndices(aSelectedIndices, oTable);


		},
		
		deleteSelectedIndices: function (aSelectedIndices, oTable){
			
			for (var i = aSelectedIndices.length - 1; i >= 0; i--) {
				var oModel = oTable.getModel("oVacationModel");
				var aData = oModel.getProperty("/urlaubsantraege");
				aData.splice(aSelectedIndices[i], 1);
				oModel.setProperty("/urlaubsantraege", aData);
			}

		}





	})

});