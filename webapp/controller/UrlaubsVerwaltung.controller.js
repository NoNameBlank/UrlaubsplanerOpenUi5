sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/library",
	"sap/m/MessageToast",
	"sap/ui/thirdparty/jquery",
	"./helper/ResponseStatusHelper",
	"./helper/DataHelper"
], function (Log, Controller, MessageToast, Sorter, JSONModel, DateFormat, ToolbarSpacer, library, jQuery, ResponseStatusHelper, Datahelper) {
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
				var oModel = new sap.ui.model.json.JSONModel();
				var oView = this.getView();
				oModel.setProperty("/bEdit", false);
				oView.setModel(oModel, "oTeamUrlaubsModel");
				//User Id der eingeloggt ist und den Urlaub beantragt hat
				var userId = oEvent.getParameter("arguments").userId;
				this.userId = userId;
				console.log("Die Eingeloggte UserId: " + userId);
				this.loadData();
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
			var oKalenderModel = new sap.ui.model.json.JSONModel();
			var aArray = [];
			var oController = this;
			



			// var oParams = { "userId": this.userId, "token" : this.token };
			// var sURL = "http://localhost:3000/api/userById";

			// Datahelper.read(sURL, oParams, oController).then(function(oResponse){
			// 	console.log(oResponse.data);
			// 		oResponse.data.appointments.forEach(urlaubsobjekt => {
			// 			console.log(urlaubsobjekt);
			// 			urlaubsobjekt.type = "Type05";
			// 			var dateObject = new Date(urlaubsobjekt.endDatum);
			// 			console.log("EndDatum:");
			// 			console.log(dateObject);
			// 			urlaubsobjekt.endDatum = dateObject;
			// 			dateObject = new Date(urlaubsobjekt.startDatum);
			// 			console.log("StartDatum:");
			// 			console.log(dateObject);
			// 			urlaubsobjekt.startDatum = dateObject;
			// 		});
			// }.bind(this)).catch(function(oError){
			// 		oModel.setProperty("/User", oResponse.data);
			// 		oView.setModel(oModel, "userDetail");
			// 		aArray.push(oResponse.data);
			// 		oKalenderModel.setProperty("/people", aArray);
			// 		oView.setModel(oKalenderModel, "urlaubKalenderModel");
			// 	if(oResponse.status === 401){
			// 	 			MessageToast.show("Deine Sitzung ist abgelaufen");
			// 	 			var oRouter = oController.getOwnerComponent().getRouter();
			// 				oRouter.navTo("RouteLogin", {}, true);
			// 	}
			// })








			jQuery.ajax({
				type: "GET",
				contentType: "application/xml",
				url: "http://localhost:3000/api/userById",
				dataType: "json",
				data: $.param({ "userId": this.userId, "token" : this.token }),
				async: true,
				
				success: function (oResponse) {
					console.log(oResponse.data);
					oResponse.data.appointments.forEach(urlaubsobjekt => {
						console.log(urlaubsobjekt);
						urlaubsobjekt.type = "Type05";
						var dateObject = new Date(urlaubsobjekt.endDatum);
						console.log("EndDatum:");
						console.log(dateObject);
						urlaubsobjekt.endDatum = dateObject;
						dateObject = new Date(urlaubsobjekt.startDatum);
						console.log("StartDatum:");
						console.log(dateObject);
						urlaubsobjekt.startDatum = dateObject;
					});

					oModel.setProperty("/User", oResponse.data);
					oView.setModel(oModel, "userDetail");
					aArray.push(oResponse.data);
					oKalenderModel.setProperty("/people", aArray);
					oView.setModel(oKalenderModel, "urlaubKalenderModel");
				}})

			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			console.log(this.userId);
			oModel.setProperty("/bEdit", false);
			var aUrlaube = [];





			// var oParams = { "teamLeiterId": this.userId, "token" : this.token};
			// var sURL = "http://localhost:3000/api/urlaubTeam";

			// Datahelper.read(sURL, oParams, oController).then(function(oResponse){
			// 	console.log(oResponse);
			// 	for (let index = 0; index < oResponse.length; index++) {
			// 		let urlaub = oResponse[index];
			// 		if(urlaub.status === "beantragt"){
			// 			aUrlaube.push(oResponse[index]);
			// 		}
			// 	}
			// 	oModel.setProperty("/Urlaube", aUrlaube);
			// 	oView.setModel(oModel, "oTeamUrlaubsModel");
			// }.bind(this)).catch(function(oError){
			// 	console.log(oError);
			// 	if(oResponse.status === 401){
			// 	 			MessageToast.show("Deine Sitzung ist abgelaufen");
			// 	 			var oRouter = oController.getOwnerComponent().getRouter();
			// 				oRouter.navTo("RouteLogin", {}, true);
			// 	}
			// })



			jQuery.ajax({
				type: "GET",
				contentType: "application/xml",
				url: "http://localhost:3000/api/urlaubTeam",
				dataType: "json",
				data: $.param({ "teamLeiterId": this.userId, "token" : this.token}),
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
					if(oResponse.status === 401 || oResponse.status === 403){
						MessageToast.show("Deine Sitzung ist abgelaufen");
						var oRouter = oController.getOwnerComponent().getRouter();
						oRouter.navTo("RouteLogin", {}, true);
					}

				}
			}); 


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



		onExportVacButtonPress: function() {
			var oTable = this.getView().byId("vacationTable");
			var oBinding = oTable.getBinding("rows");
			var aUrlaube = oBinding.getModel().getProperty(oBinding.getPath());
			var oUserModel = this.getView().getModel("userDetail");
			var sVorname = oUserModel.getProperty("/User/vorname");
			var sNachname = oUserModel.getProperty("/User/nachname");
			var aExportData = [];
			
			function formatDate(date) {
				const options = { day: 'numeric', month: 'long', year: 'numeric' };
				return new Date(date).toLocaleDateString('de-DE', options);
				}
				

			aUrlaube.forEach(function(oUrlaub) {
				var oExportItem = {
					"Mitarbeiter": oUrlaub.vorname + " " + oUrlaub.nachname,
					"Von": formatDate(oUrlaub.startDatum),
					"Bis": formatDate(oUrlaub.endDatum),
					"Gesamt Urlaub": oUrlaub.vacation,
					"Rest Jahr Urlaub": oUrlaub.restUrlaub,
					"Status": oUrlaub.status
				};
				aExportData.push(oExportItem);
			});
		
			var oWorkSheet = XLSX.utils.json_to_sheet(aExportData);
			var oWorkBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(oWorkBook, oWorkSheet, "Urlaub-Daten");
		
			var sFileName = sVorname + " " + sNachname + "_Urlaubsverwaltung.xlsx";
			XLSX.writeFile(oWorkBook, sFileName);
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
				var urlaubWithToken = Object.assign({}, urlaub, { token: this.token });
				jQuery.ajax({
					type: "PUT",
					contentType: "application/json",
					url: "http://localhost:3000/api/urlaub",
					dataType: "json",
					data: JSON.stringify(urlaubWithToken),
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