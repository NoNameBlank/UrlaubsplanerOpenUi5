sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/ToolbarSpacer",
	"sap/ui/table/library",
	"sap/ui/thirdparty/jquery",
    "sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"./helper/ResponseStatusHelper",
	"./helper/DataHelper"
], function(Log, Controller, Sorter, JSONModel, DateFormat, ToolbarSpacer, library, jQuery, Fragment, MessageToast, ResponseStatusHelper, Datahelper) {
	"use strict";

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = library.SortOrder;

	return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {

		onInit : function() {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			
			
			var oView = this.getView();
			oView.setModel(new JSONModel({
				globalFilter: "",
				availabilityFilterOn: false,
				cellFilterOn: false
			}), "ui");

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
		},


		onRouteMatched: function (oEvent) {

            this.token = oEvent.getParameter("arguments").token;
			this.userId = oEvent.getParameter("arguments").userId;
			var oController = this;


			if(this.token){
				var oModel = new sap.ui.model.json.JSONModel();
				var oView = this.getView();
				oModel.setProperty("/bEdit", false);
				oView.setModel(oModel, "oTeamModel");
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

			// MOCK-Data Team
			//Aufruf GET /Api/User

			var oView = this.getView();
			var oModel = oView.getModel("oTeamModel");
			var oController = this;




			// var oParams = { "token" : this.token};
			// var sURL = "http://localhost:3000/api/User";

			// Datahelper.read(sURL, oParams, oController).then(function(oResponse){
			// 	console.log(oResponse);
			// 	oModel.setProperty("/Users", oResponse.users)
			// 	oView.setModel(oModel, "oTeamModel");
			// 	oController.loadTeamData();
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
				url: "http://localhost:3000/api/User",
				dataType: "json",
				data: $.param({ "token" : this.token}),
				async: true,
				success: function (oResponse) {
					console.log(oResponse);
					oModel.setProperty("/Users", oResponse.users)
					oView.setModel(oModel, "oTeamModel");
					oController.loadTeamData();
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


		loadDataIntoUser: function (userId) {

			//Aufruf  POST  /api/user

			
		},


		clearAllSortings : function(oEvent) {
			var oTable = this.byId("TeamTable");
			oTable.getBinding().sort(null);
			this._resetSortingState();
		},

		onEdit: function () {
			this.byId("TeamTable").setSelectionMode("MultiToggle");
			this.getView().getModel("oTeamModel").setProperty("/bEdit", true);
			

		},

		onAbortEdit: function () {
			this.byId("TeamTable").setSelectionMode("None");
			var oMultiComboBox = this.byId("EmployeeEditRoles");
			console.log("zu mit dem aal")
			this.getView().getModel("oTeamModel").setProperty("/bEdit", false);
			

		},

		deleteEmployee: function () {
			var oTable = this.byId("oTeamModel");
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
		

		
		onEditUser: function (e) {
			var oView = this.getView();
			var oController = this;
			var oEditModel = new sap.ui.model.json.JSONModel()
			var oView = oController.getView();
			var sPath = e.getSource().getBindingContext('oTeamModel').getPath();
			var oModel = oView.getModel('oTeamModel');
			var oUserData = oModel.getProperty(sPath);
			oEditModel.setProperty("/EditUser", oUserData);
			oView.setModel(oEditModel, "oEditModel");
			console.log(oEditModel);
			var oSelectedItem = e.getSource().getBindingContext("oTeamModel").getObject();
			if (!this.byId("EmployeeEditDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: this.getView().getId(),
					name: "urlaubsplaner.urlaubsplaner.view.dialogs.EmployeesEditDialog",
					controller: this
				}).then(function (oDialog) {
					
					// MultiComboBox-Steuerelement für die Rollen abrufen
					var oMultiComboBox = oController.byId("EmployeeEditRoles");
					oMultiComboBox.removeSelectedKeys(["Employee","Admin","Supervisor","HR"]);
					
				console.log("Alle weg first")
					if (oSelectedItem.isAdmin === "1") {
						oMultiComboBox.addSelectedKeys(["Admin"]);
						console.log("Admin")
						}
						if (oSelectedItem.isHR === "1") {
							oMultiComboBox.addSelectedKeys(["HR"]);
						}
						if (oSelectedItem.isSupervisor === "1") {
							oMultiComboBox.addSelectedKeys(["Supervisor"]);
						}
						if (oSelectedItem.isEmployee === "1") {
							oMultiComboBox.addSelectedKeys(["Employee"]);
							console.log("Employee")
					}
					// if (oSelectedItem.isEmployee) {
					// 	oMultiComboBox.addSelectedKeys(["Employee"]);
					// }
					if (!oSelectedItem.isSupervisor === "1" && !oSelectedItem.isHR === "1" && !oSelectedItem.isEmployee === "1" && !oSelectedItem.isAdmin === "1") {
					console.warn("Tjerk")
						oMultiComboBox.removeSelectedKeys();
					}
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				// MultiComboBox-Steuerelement für die Rollen abrufen
				var oMultiComboBox = oController.byId("EmployeeEditRoles");
				console.log("Alle weg")
				oMultiComboBox.removeSelectedKeys(["Employee","Admin","Supervisor","HR"]);
				if (oSelectedItem.isAdmin === "1") {
				oMultiComboBox.addSelectedKeys(["Admin"]);
				console.log("Admin")
				}
				if (oSelectedItem.isHR === "1") {
					oMultiComboBox.addSelectedKeys(["HR"]);
				}
				if (oSelectedItem.isSupervisor === "1") {
					oMultiComboBox.addSelectedKeys(["Supervisor"]);
				}
				if (oSelectedItem.isEmployee === "1") {
					oMultiComboBox.addSelectedKeys(["Employee"]);
					console.log("Employee")
				}
				// if (oSelectedItem.isEmployee) {
				// 	oMultiComboBox.addSelectedKeys(["Employee"]);
				// }
				if (!oSelectedItem.isSupervisor === "1" && !oSelectedItem.isHR === "1" && !oSelectedItem.isEmployee === "1" && !oSelectedItem.isAdmin === "1") {
				console.warn("Tjerk")
					oMultiComboBox.removeSelectedKeys();
				}
				this.byId("EmployeeEditDialog").open();
			}
			
		},



		onCreateUser: function () {
			this.openCreateDialog();
		},


		isRoleFormatter: function(value) {
			if (value === "1") {
				return "Ja";
			} else {
				return "Nein";
			}
		},
		

		onDeleteFlumbus: function(){


					var oTable = this.byId("TeamTable");
					var aSelectedIndices = oTable.getSelectedIndices();
					var aEmployeesSelected = [];
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var oSelectedContext = oTable.getContextByIndex(aSelectedIndices[i]);
						var oSelectedData = oSelectedContext.getObject();
						aEmployeesSelected.push(oSelectedData);
		
					}
					console.warn("Grungo")
					console.log(aEmployeesSelected)
					var oController = this;
					aEmployeesSelected.forEach(User => {
						jQuery.ajax({
							type: "DELETE",
							contentType: "application/json",
							url: "http://localhost:3000/api/user",
							dataType: "json",
							data: JSON.stringify({ "userId": User.userId, "isAdmin": User.isAdmin, "token" : this.token}),
							async: true,
							success: function (oResponse) {
								sap.m.MessageToast.show("Update erfolgreich!8888")
								console.warn("data")
								console.log(data)
								oController.loadData();
							},
							error: function (oResponse) {
								ResponseStatusHelper.handleStatusCode(oResponse,oController)
								oController.loadData();
								console.warn("data")
								console.log(data)
								
							}
						})})

			},


		loadTeamData: function(){
			var oModel = this.getView().getModel("oTeamModel");

			var oModel = this.getView().getModel("oTeamModel");
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "http://localhost:3000/api/Team",
				data: $.param({ "token" : this.token}),
				dataType: "json",
				async: true,
				success: function (oResponse) {
					console.log("Team Daten geladen!");
					oModel.setProperty("/Teams", oResponse)
				},
				error: function (oResponse) {
					console.log(oResponse);
					if(oResponse.status === 401){
						MessageToast.show("Deine Sitzung ist abgelaufen");
						var oRouter = oController.getOwnerComponent().getRouter();
						oRouter.navTo("RouteLogin", {}, true);
					}
				}
			})



		},



		openDialog: function(){
			
		},


		openCreateDialog: function(){
			var oView = this.getView();
			if (!this.byId("EmployeeCreateDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: this.getView().getId(),
					name: "urlaubsplaner.urlaubsplaner.view.dialogs.EmployeesCreateDialog",
					controller: this
				}).then(function (oDialog) {

					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("EmployeeCreateDialog").open();
			}
		},

		sortCategories : function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("TeamTable");
			var oCategoriesColumn = oView.byId("categories");

			oTable.sort(oCategoriesColumn, this._bSortColumnDescending ? SortOrder.Descending : SortOrder.Ascending, /*extend existing sorting*/true);
			this._bSortColumnDescending = !this._bSortColumnDescending;
		},

		clearAllFilters: function(oEvent) {
			var oTable = this.byId("TeamTable");

			var oUiModel = this.getView().getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}
		},
		_filter: function() {
			var oFilter = null;

			this.byId("TeamTable").getBinding().filter(oFilter, "Application");
		},

	
		closeEditDialog: function(){
			this.byId("EmployeeEditDialog").close();
		},
		closeCreateDialog: function(){
			var oView = this.getView();
			var oController = this;
			var oMultiComboBox = oController.byId("EmployeeCreateRole");
				console.log("Alle weg")
				oMultiComboBox.removeSelectedKeys(["Employee","Admin","Supervisor","HR"]);
			this.byId("EmployeeCreateDialog").close();
			oView.byId("EmployeeCreateFirstname").setValue("");
			oView.byId("EmployeeCreateLastname").setValue("");
			oView.byId("EmployeeCreateVacation").setValue(0);
			oView.byId("EmployeeCreateNote").setValue("");
			oView.byId("EmployeeCreateUserName").setValue("");
			oView.byId("EmployeeCreateTeam").setSelectedIndex(0)
			this.onAbortEdit();
		},


		firstUp: function(oFlum){
			var uncap = oFlum.toLowerCase();
			var cap = uncap.charAt(0).toUpperCase() + uncap.slice(1);
			return cap;
		},

		createEmployee: function() {
			var oView = this.getView();
			var oController = this;
			var sUserName = oView.byId("EmployeeCreateUserName").getValue();
			var sFirstNameUncap = oView.byId("EmployeeCreateFirstname").getValue();
			var sLastNameUncap = oView.byId("EmployeeCreateLastname").getValue();
			var sGesamtUrlaub = oView.byId("EmployeeCreateVacation").getValue();
			var sNotiz = oView.byId("EmployeeCreateNote").getValue();
			var aSelectedRoles = oView.byId("EmployeeCreateRole").getSelectedKeys();
			var aSelectedAccess = oView.byId("EmployeeCreateAccess").getSelectedKey();
			var sTeam = oView.byId("EmployeeCreateTeam").getSelectedKey();
			
			var sRestUrlaub = 0;
			var isAdmin = false;
			var isHR = false;
			var isSupervisor = false;
			var isEmployee = false;
			var hasAccess = 0;
			if (aSelectedRoles.includes("Admin")) {
				isAdmin = true;
			}
			
			if (aSelectedRoles.includes("HR")) {
				isHR = true;
			}
			
			if (aSelectedRoles.includes("Supervisor")) {
				isSupervisor = true;
			}
			
			if (aSelectedRoles.includes("Employee")) {
				isEmployee = true;
			}

			switch(aSelectedAccess) {

				case "Access1":
					console.warn("Access1")
					hasAccess = 1;
					break;
				case "Access2":
					console.warn("Access2")
					hasAccess = 2;
					break;
				case "Access3":
					console.warn("Access3")
					hasAccess = 3;
					break;
				case "Access4":
					console.warn("Access4")
					hasAccess = 4;
					break;
				case "Access5":
					console.warn("Access5")
					hasAccess = 5;
					break;
				case "Access6":
					console.warn("Access6")
					hasAccess = 6;
					break;
				case "Access7":
					console.warn("Access7")
					hasAccess = 7;
					break;
				case "Access8":
					console.warn("Access8")
					hasAccess = 8;
					break;
				case "Access9":
					console.warn("Access9")
					hasAccess = 9;
					break;
				case "Access10":
					console.warn("Access10")
					hasAccess = 10;
					break;
				default:
					sap.m.MessageToast.show("Bitte geben Sie die Berechtigungsstufe ein");
					return;
					

			}




			var sFirstName = this.firstUp(sFirstNameUncap);
			var sLastName = this.firstUp(sLastNameUncap);

			var Emailformat = /\S+@\S+\.\S+/;
			if (!Emailformat.test(sUserName)) {
				sap.m.MessageToast.show("Der Benutzername muss eine gültige E-Mail-Adresse sein.");
				return;
			}

			if (!sGesamtUrlaub) {
				sap.m.MessageToast.show("Bitte geben Sie den Gesamturlaub an.");
				return;
			  }
			
			$.ajax({
				url: "/api/user",
				method: "POST",
				data: {
					username: sUserName,
					vorname: sFirstName,
					nachname: sLastName,
					access: hasAccess,
					isHR: isHR,
					isAdmin: isAdmin,
					isEmployee: isEmployee,
					isSupervisor: isSupervisor,
					gesUrlaub: sGesamtUrlaub,
					restUrlaub: sRestUrlaub,
					note: sNotiz,
					teamId: sTeam,
					token: this.token

				},
				success: function(oResponse) {
					console.log("Erfolgreich erstellt");
					oController.loadData();
				},
				error: function(oResponse) {
					console.error("Das hat leider nicht geklappt");
					
					oController.loadData();
				}
			});
		
			this.closeCreateDialog();
		},


		editEmployee: function() {
			var oView = this.getView();
			var oController = this;
			var oEditEmployee = oView.getModel("oEditModel").getProperty("/EditUser");
			var aSelectedRoles = oView.byId("EmployeeEditRoles").getSelectedKeys();
			var Emailformat = /\S+@\S+\.\S+/;
			var isAdmin = false;
			var isHR = false;
			var isSupervisor = false;
			var isEmployee = false;
			if (this.userId == oEditEmployee.userId) {
				sap.m.MessageToast.show("Du darfst dich selbst nicht bearbeiten!");
			}
			else {
				console.warn("Nicht gleich")

			if (!Emailformat.test(oEditEmployee.username)) {
				sap.m.MessageToast.show("Der Benutzername muss eine gültige E-Mail-Adresse sein.");
				return;
			}
			if (aSelectedRoles.includes("Admin")) {
				isAdmin = true;
			}
			
			if (aSelectedRoles.includes("HR")) {
				console.warn("HR")
				isHR = true;
			}
			
			if (aSelectedRoles.includes("Supervisor")) {
				isSupervisor = true;
			}
			
			if (aSelectedRoles.includes("Employee")) {
				isEmployee = true;
			}
			console.log(oEditEmployee);
			$.ajax({
				url: "/api/user",
				method: "PUT",
				contentType: "application/json",
				dataType: "json",
				async: true,
				data: JSON.stringify({
					username: oEditEmployee.username,
					vorname: oEditEmployee.vorname,
					nachname:  oEditEmployee.nachname,
					isHR: isHR,
					isAdmin: isAdmin,
					isEmployee: isEmployee,
					isSupervisor: isSupervisor,
					restUrlaub: oEditEmployee.restUrlaub,
					gesUrlaub:  oEditEmployee.gesUrlaub,
					note:  oEditEmployee.note,
					teamId:  oEditEmployee.teamId,
					userId: oEditEmployee.userId,
					token: this.token
				}),
				success: function() {
					console.log("Erfolgreich überarbeitet");
					oView.getModel("oEditModel").setProperty("/EditUser", null);
					oController.loadData();
				},
				error: function(oResponse) {

					ResponseStatusHelper.handleStatusCode(oResponse,oController);
					oView.getModel("oEditModel").setProperty("/EditUser", null);
					oController.loadData();
					
				}

			});
			var oMultiComboBox = this.byId("EmployeeEditRoles");
			oMultiComboBox.removeSelectedKeys();
			console.log("zu mit dem aal")
		}
			this.closeEditDialog();
		},

		onResetUserPW: function(e){
			var sPath = e.getSource().getBindingContext('oTeamModel').getPath();
			var oModel = this.getView().getModel('oTeamModel');
			var oUserData = oModel.getProperty(sPath);
			console.log(oUserData);
			var oController = this;
			$.ajax({
				url: "/api/user",
				method: "PUT",
				contentType: "application/json",
				dataType: "json",
				async: true,
				data: JSON.stringify({
					userId: oUserData.userId,
					passwort: "ABC123",
					token: this.token
				}),
				success: function() {
					sap.m.MessageToast.show(`Passwort von User ${ oUserData.username } wurde auf das Standardpasswort zurückgesetzt.`);
					oController.loadData();
				},
				error: function(oResponse) {
					console.log(oResponse);
					if(oResponse.status === 200){
						sap.m.MessageToast.show(`Passwort von User ${ oUserData.username } wurde auf das Standardpasswort zurückgesetzt.`);
					}else{
						if(oResponse.status === 401){
                            MessageToast.show("Deine Sitzung ist abgelaufen");
                            var oRouter = oController.getOwnerComponent().getRouter();
                            oRouter.navTo("RouteLogin", {}, true);
                        }
						sap.m.MessageToast.show(`Passwort von User ${ oUserData.username } konnte nicht zurückgesetzt werden!`);
					}
					
					oController.loadData();
				}
			});

		},

		sortCategoriesAndName : function(oEvent){
			var oView = this.getView();
			var oTable = oView.byId("TeamTable");
			oTable.sort(oView.byId("categories"), SortOrder.Ascending, false);
			oTable.sort(oView.byId("name"), SortOrder.Ascending, true);
		},

		sortDeliveryDate : function(oEvent) {
			var oCurrentColumn = oEvent.getParameter("column");
			var oDeliveryDateColumn = this.byId("deliverydate");
			if (oCurrentColumn != oDeliveryDateColumn) {
				oDeliveryDateColumn.setSorted(false); //No multi-column sorting
				return;
			}

			oEvent.preventDefault();

			var sOrder = oEvent.getParameter("sortOrder");
			var oDateFormat = DateFormat.getDateInstance({pattern: "dd/MM/yyyy"});

			this._resetSortingState(); //No multi-column sorting
			oDeliveryDateColumn.setSorted(true);
			oDeliveryDateColumn.setSortOrder(sOrder);

			var oSorter = new Sorter(oDeliveryDateColumn.getSortProperty(), sOrder === SortOrder.Descending);
			//The date data in the JSON model is string based. For a proper sorting the compare function needs to be customized.
			oSorter.fnCompare = function(a, b) {
				if (b == null) {
					return -1;
				}
				if (a == null) {
					return 1;
				}

				var aa = oDateFormat.parse(a).getTime();
				var bb = oDateFormat.parse(b).getTime();

				if (aa < bb) {
					return -1;
				}
				if (aa > bb) {
					return 1;
				}
				return 0;
			};

			this.byId("TeamTable").getBinding().sort(oSorter);
		},

		_resetSortingState : function() {
			var oTable = this.byId("TeamTable");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		},


	});

});