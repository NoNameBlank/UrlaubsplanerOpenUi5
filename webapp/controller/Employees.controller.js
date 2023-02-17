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
], function(Log, Controller, Sorter, JSONModel, DateFormat, ToolbarSpacer, library, jQuery, Fragment) {
	"use strict";

	// shortcut for sap.ui.table.SortOrder
	var SortOrder = library.SortOrder;

	return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {

		onInit : function() {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
			this.loadData();

		},


		onRouteMatched: function (oEvent) {

			this.userId = oEvent.getParameter("arguments").userId;


		},
		onNavBack: function () {
			this.getOwnerComponent().getRouter().navTo("RouteDashboard", {
				userId: this.userId 
				
			   });
		},
		loadData: function () {

			// MOCK-Data Team
			//Aufruf GET /Api/User

			var oView = this.getView();
			var oModel = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/xml",
				url: "http://localhost:3000/api/User",
				dataType: "json",
				data: $.param({ "teamLeiterId": this.userId }),
				async: true,
				success: function (oResponse) {
					console.log(oResponse);
					oModel.setProperty("/Users", oResponse.users)
					oView.setModel(oModel, "oTeamModel");
				},
				error: function (oResponse) {
					sap.m.MessageToast.show("Fehler beim Laden der Benutzerdaten");
				}
			})
		},


		loadDataIntoUser: function (userId) {

			//Aufruf  POST  /api/user

			
		},


		clearAllSortings : function(oEvent) {
			var oTable = this.byId("table");
			oTable.getBinding().sort(null);
			this._resetSortingState();
		},
		

		
		//Funktion unbennenn
		onEditUser: function (e) {
			var oView = this.getView();
			var sPath = e.getSource().getBindingContext('oTeamModel').getPath();
			var oModel = this.getView().getModel('oTeamModel');
			var oRowData = oModel.getProperty(sPath);
			var oEditModel = new sap.ui.model.json.JSONModel();
			switch (oRowData.role) {
				case "Mitarbeiter":
					oRowData.rolekey = "MA";
					break;
				case "Teamleiter":
					oRowData.rolekey = "TL";
					break;
				case "Backoffice":
					oRowData.rolekey = "BO";
					break;
				case "Admin":
					oRowData.rolekey = "AD";
					break;
				default:
					break;
			}
			oEditModel.setProperty("/EditUser", oRowData);
			oView.setModel(oEditModel, "oEditModel");
			console.log(oEditModel);
			this.openDialog();
			
		},
		openDialog: function(){
			var oView = this.getView();
			if (!this.byId("EmployeeEditDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: this.getView().getId(),
					name: "urlaubsplaner.urlaubsplaner.view.dialogs.EmployeesEditDialog",
					controller: this
				}).then(function (oDialog) {

					oView.addDependent(oDialog);
					oDialog.open();
					debugger;
				});
			} else {
				this.byId("EmployeeEditDialog").open();
			}
		},

		sortCategories : function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("table");
			var oCategoriesColumn = oView.byId("categories");

			oTable.sort(oCategoriesColumn, this._bSortColumnDescending ? SortOrder.Descending : SortOrder.Ascending, /*extend existing sorting*/true);
			this._bSortColumnDescending = !this._bSortColumnDescending;
		},
		closeDialog: function(){
			this.byId("EmployeeEditDialog").close();
		},
		



		sortCategoriesAndName : function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("table");
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

			this.byId("table").getBinding().sort(oSorter);
		},

		_resetSortingState : function() {
			var oTable = this.byId("table");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		}

	});

});