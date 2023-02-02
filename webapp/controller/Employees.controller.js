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
			var oTeamModel = new sap.ui.model.json.JSONModel();
			oTeamModel.setData({
				people: [{
					id: 3,
					pic: "",
					name: "Jens",
					role: "Backoffice",
					vacation: 31,
					vacationLeft: 10,
					vacationPlaned: 0,
					vacationLastYear: 0,
					freeDays: [5, 6],
					freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
					appointments: [{
						pic: "",
						title: "Urlaub",
						start: new Date(2023, 1, 1, 11, 30),
						end: new Date(2023, 2, 3, 11, 30),
						type: "Type03",
						tentative: true
					}],
				},
				{
					id: 4,
					pic: "",
					name: "Ulla",
					role: "Teamleiter",
					vacation: 31,
					vacationLeft: 10,
					vacationPlaned: 0,
					vacationLastYear: 0,
					freeDays: [5, 6],
					freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
					appointments: [{
						pic: "",
						title: "Urlaub",
						start: new Date(2023, 1, 1, 11, 30),
						end: new Date(2023, 2, 3, 11, 30),
						type: "Type03",
						tentative: true
					}],
				},
				{
					id: 5,
					pic: "",
					name: "Albert",
					role: "Mitarbeiter",
					vacation: 57,
					vacationLeft: 22,
					vacationPlaned: 35,
					vacationLastYear: 5,
					freeDays: [5, 6],
					freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
					appointments: [{
						pic: "",
						title: "Urlaub",
						start: new Date(2023, 1, 1, 11, 30),
						end: new Date(2023, 2, 3, 11, 30),
						type: "Type03",
						tentative: true
					}],
				},
				{
					id: 6,
					pic: "",
					name: "Berthold",
					role: "Mitarbeiter",
					vacation: 57,
					vacationLeft: 22,
					vacationPlaned: 35,
					vacationLastYear: 5,
					freeDays: [5, 6],
					freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
					appointments: [{
						pic: "",
						title: "Urlaub",
						start: new Date(2023, 1, 1, 11, 30),
						end: new Date(2023, 2, 3, 11, 30),
						type: "Type03",
						tentative: true
					}],
				},
				{
					id: 7,
					pic: "",
					name: "Rainer",
					role: "Mitarbeiter",
					vacation: 57,
					vacationLeft: 22,
					vacationPlaned: 35,
					vacationLastYear: 5,
					freeDays: [5, 6],
					freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
					appointments: [{
						pic: "",
						title: "Urlaub",
						start: new Date(2023, 1, 1, 11, 30),
						end: new Date(2023, 2, 3, 11, 30),
						type: "Type03",
						tentative: true
					}],
				},
				]
			});
			this.getView().setModel(oTeamModel, "oTeamModel");
		},


		clearAllSortings : function(oEvent) {
			var oTable = this.byId("table");
			oTable.getBinding().sort(null);
			this._resetSortingState();
		},
		

		

		  bearbeiten: function () {
			var oTable = this.byId("table");
			var aSelectedIndices = oTable.getSelectedIndices();
			console.log(aSelectedIndices);
			var oView = this.getView();
			// create dialog lazily
			
			if (!this.byId("EmployeeEditDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "urlaubsplaner.urlaubsplaner.view.dialogs.EmployeesEditDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view 
					//of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
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