sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {
            onInit: function () {
                this.oOwnerComponent = this.getOwnerComponent();
                this.oRouter = this.oOwnerComponent.getRouter();
                this.oRouter.attachRouteMatched(this.onRouteMatched, this);
                var oVacationModel = new sap.ui.model.json.JSONModel();
                var User = {
                    Username : "Luca",
                    VacationLeft : "0",
                    VacationPlaned : "20",
                    VacationLastYear : "10",
                    Role : "Teamleiter"
                }
                oVacationModel.setProperty("/User", User);
                this.getView().setModel(oVacationModel, "VacationModel");
                this.getView().getModel("VacationModel").setProperty("/Vacationleft", 0);
                this.loadData();

               
            },
            onRouteMatched: function(oEvent){
                var Date =  this.getfirstDayOfWeek();
                var oKalender = this.byId("PC1");
                oKalender.setStartDate(Date);
                // this.getView().getModel("VacationModel").setProperty("/FirstDay", Date);
                

            },

            loadData: function() {
                var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					people: [{
						pic: "",
						name: "Luca Schöpke",
						role: "Azubi",
						freeDays: [5, 6],
						freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                        appointments: [{
                            pic: "",
                            title: "Urlaub",
                            start: new Date(2023, 1, 1, 11, 30),
                            end: new Date(2023, 2, 3, 11, 30),
                            type: "Type03",
							tentative: true
                        }]
					},{
                        pic: "",
                        name: "Philipp Marek",
                        role: "Azubi",
                        freeDays: [5, 6],
                        freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                    }
                ]
				});
				this.getView().setModel(oModel);
            },

            onClick: function() {

            
                var oKalender = this.byId("PC1");
                oKalender.setStartDate(firstDayOfWeek);
            },


            getfirstDayOfWeek: function() {

                var today = new Date();
                var day = today.getDay();
                return new Date(today.getFullYear(), today.getMonth(), today.getDate() - day + 1);

            },

            onOpenDialog: function () {
                var oView = this.getView();
                // create dialog lazily
                if (!this.byId("vacationPickerDialog")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                    id: oView.getId(),
                    name: "urlaubsplaner.urlaubsplaner.view.dialogs.VacationDateDialog",
                    controller: this
                }).then(function (oDialog) {
                // connect dialog to the root view 
                //of this component (models, lifecycle)
                oView.addDependent(oDialog);
                oDialog.open();
                });
                } else {
                    this.byId("vacationPickerDialog").open();
                }
            },
                    
            closeDialog: function () {
                this.byId("vacationPickerDialog").close();
                this.byId("datePicker").setValue(null);
                this.byId("datePicker2").setValue(null);
                
            },


            sendVacation: function () {
                var sUrlaubStart = this.byId("datePicker").getDateValue();
                var sUrlaubEnde = this.byId("datePicker2").getDateValue();
            
               

                this.closeDialog();
                MessageToast.show(`Hallo ${this.getView().getModel("VacationModel").getProperty("/User/Username")}, du hast deinen Urlaubsantrag vom ${sUrlaubStart.toLocaleDateString()} bis zum ${sUrlaubEnde.toLocaleDateString()} abgeschickt`)


            }

        


        });
    });
