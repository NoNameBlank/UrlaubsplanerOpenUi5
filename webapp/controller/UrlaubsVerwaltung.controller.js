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

		

		onInit: function () {

			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);

			//Selection Modus aus
			this.onDeactivateSelectionMode();




		},

		onRouteMatched: function (oEvent) {
			//User Id der eingeloggt ist und den Urlaub beantragt hat
			this.token = oEvent.getParameter("arguments").token;

			if(this.token){
				this.loadData();
				//User Id der eingeloggt ist und den Urlaub beantragt hat
				var userId = oEvent.getParameter("arguments").userId;
				this.userId = userId;
				console.log("Die Eingeloggte UserId: " + userId);
			}else{
				MessageToast.show("Deine Sitzung ist abgelaufen");
				var oRouter = oController.getOwnerComponent().getRouter();
				oRouter.navTo("RouteLogin", {}, true);
			}



		},

		onNavBack: function () {
			this.getOwnerComponent().getRouter().navTo("RouteDashboard", {
				userId: this.userId,
				token: this.token

			});
		},

		loadData: function () {
			//Aufruf GET /Api/urlaubTeam
			//nur Urlaube mit Status beantragt anzeigen

			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setProperty("/bEdit", false);
			var aUrlaube = [];
			jQuery.ajax({
				type: "GET",
				contentType: "application/xml",
				url: "http://localhost:3000/api/urlaubTeam",
				dataType: "json",
				data: $.param({ "teamLeiterId": this.userId }),
				async: true,
				success: function (oResponse) {
					console.log(oResponse);
					for (let index = 0; index < oResponse.length; index++) {
						let urlaub = oResponse[index];
						if(urlaub.status === "beantragt"){
							aUrlaube.push(oResponse[index]);
						}
					}
					oModel.setProperty("/Urlaube", aUrlaube);
					oView.setModel(oModel, "oTeamUrlaubsModel");
				},
				error: function (oResponse) {
					if(oResponse.status === 401){
						MessageToast.show("Deine Sitzung ist abgelaufen");
						var oRouter = oController.getOwnerComponent().getRouter();
						oRouter.navTo("RouteLogin", {}, true);
					}
				}
			})





		},

		onSave: function() {
			//Aufruf PUT /Api/urlaub	
		},

		onDecline: function(){
			//Filter der ausgewählten Tabellenobjekte 
			//aufruf DELETE /Api/urlaub
		},

		onEdit: function () {
			this.byId("vacationTable").setSelectionMode("MultiToggle");
			this.getView().getModel("oTeamUrlaubsModel").setProperty("/bEdit", true);

		},

		onAbortEdit: function () {
			this.byId("vacationTable").setSelectionMode("None");
			this.getView().getModel("oTeamUrlaubsModel").setProperty("/bEdit", false);
			

		},

		onBack: function () {

			this.byId("editBtn").setVisible(true);d
			this.byId("buchen").setVisible(false);
			this.byId("ablehnen").setVisible(false);
			this.byId("zurueck").setVisible(false);
			this.byId("vacationTable").setSelectionMode("None");
		},

		onActivateSelectionMode: function () {

			this.byId("vacationTable").setSelectionMode("MultiToggle");


		},

		onDeactivateSelectionMode: function () {

			this.byId("vacationTable").setSelectionMode("None");



		},

		onAccept: function () {
			

			//Aufruf POST  /api/urlaub
			//
			
			var oTable = this.byId("vacationTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aUrlaube = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var oSelectedContext = oTable.getContextByIndex(aSelectedIndices[i]);
				var oSelectedData = oSelectedContext.getObject();
				oSelectedData.status = "genehmigt";
				aUrlaube.push(oSelectedData);
			}
			this.pushUrlaubData(aUrlaube);
		},

		onDecline: function () {

			//Aufruf DELETE /api/urlaub

			var oTable = this.byId("vacationTable");
			var aSelectedIndices = oTable.getSelectedIndices();
			var aUrlaube = [];
			for (var i = 0; i < aSelectedIndices.length; i++) {
				var oSelectedContext = oTable.getContextByIndex(aSelectedIndices[i]);
				var oSelectedData = oSelectedContext.getObject();
				oSelectedData.status = "abgelehnt";
				aUrlaube.push(oSelectedData);

			}
			this.pushUrlaubData(aUrlaube);
		},

		pushUrlaubData: function(aUrlaubArray){
			aUrlaubArray.forEach(urlaub => {
				jQuery.ajax({
					type: "PUT",
					contentType: "application/json",
					url: "http://localhost:3000/api/urlaub",
					dataType: "json",
					data: JSON.stringify(urlaub),
					async: true,
					success: function (oResponse) {
						sap.m.MessageToast.show("Update erfolgreich!")
					},
					error: function (oResponse) {
						if(oResponse.status === 401){
                            MessageToast.show("Deine Sitzung ist abgelaufen");
                            var oRouter = oController.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteLogin", {}, true);
                        }
						console.log(oResponse);
						sap.m.MessageToast.show("Update erfolgreich!")
					}
				})
			});
			this.loadData();
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