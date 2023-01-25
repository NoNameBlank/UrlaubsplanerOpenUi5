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

                /*
                var oUserModel = new sap.ui.model.json.JSONModel();
                var User = {
                    Username: "Mock",
                    VacationLeft: "0",
                    VacationPlaned: "20",
                    VacationLastYear: "10",
                    Role: "Teamleiter"
                }
                oUserModel.setProperty("/User", User);
                this.getView().setModel(oUserModel, "UserModel");
                this.getView().getModel("UserModel").setProperty("/Vacationleft", 0);
                //var userId = oRouter.getRoute("RouteDashboard").getParameter("userId");
                debugger;
                */



                


            },
            onRouteMatched: function (oEvent) {
                debugger;
                var userId = oEvent.getParameter("arguments").userId;
                //  console.warn(userId);

                this.loadDataIntoUser(userId);
           
                /*
                var login = oEvent.getParameter("arguments");
                var sBenutzerLogin = login.sBenutzerLogin;
                var sBenutzerPasswort = login.sBenutzerPasswort;
                this.sBenutzerLogin = sBenutzerLogin;
                this.sBenutzerPasswort = sBenutzerPasswort;
                this.getView().getModel("UserModel").setProperty("/User/Username", this.sBenutzerLogin);
                */



                this.setFirstDay();
                // this.getView().getModel("UserModel").setProperty("/FirstDay", Date);


            },

            loadData: function () {
                /* var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    people: [{
                        pic: "",
                        name: "111",
                        role: "Teamleiter",
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
                    },
                    {
                        pic: "",
                        name: "222",
                        role: "Mitarbeiter",
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
                    },
                    ]
                });
                 this.getView().setModel(oModel, "UserModel");
                */

                //userModel

                



                // MOCK-Data Team
                var oTeamModel = new sap.ui.model.json.JSONModel();
                oTeamModel.setData({
                    people: [{
                        id: 3,
                        pic: "",
                        name: "3",
                        role: "Backoffice",
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
                        name: "4",
                        role: "Teamleiter",
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
                        name: "5",
                        role: "Mitarbeiter",
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


            loadDataIntoUser: function (userId) {

                var oUserModel = new sap.ui.model.json.JSONModel();
                oUserModel.setData({
                    people: [{
                        id: 1,
                        pic: "",
                        name: "11",
                        passwort: "123",
                        role: "Teamleiter",
                        vacation: 31,
                        vacationLeft: 5,
                        vacationPlaned: 20,
                        vacationLastYear: 10,
                        freeDays: [5, 6],
                        freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                        appointments: [{
                            pic: "",
                            title: "Urlaub",
                            start: new Date(2023, 1, 1, 11, 30),
                            end: new Date(2023, 2, 3, 11, 30),
                            type: "Type01",
                            tentative: true
                        }]
                        
                    },
                    {
                        id: 2,
                        pic: "",
                        name: "12",
                        passwort: "321",
                        role: "Mitarbeiter",
                        vacation: 31,
                        vacationLeft: 5,
                        vacationPlaned: 20,
                        vacationLastYear: 10,
                        freeDays: [5, 6],
                        freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                       //Die appointments Sind für den Kalender sie beschreiben sozusagen den Urlaub
                        appointments: [{
                            pic: "",
                            title: "Urlaub",
                            start: new Date(2023, 1, 1, 11, 30),
                            end: new Date(2023, 2, 3, 11, 30),
                            type: "Type03",
                            tentative: true
                        }]
                    },
                    ]
                });
                // oUserModel.setProperty("/User", User);
                // this.getView().setModel(oUserModel, "UserModel");
                var aEntries = oUserModel.getProperty("/people");
                debugger;
                var oUser = aEntries.find(function (oUser) {
                    return oUser.id === parseInt(userId);
                })
                 oUserModel.setProperty("/User", oUser);

                this.getView().setModel(oUserModel, "UserModel");
                
                //oUser.appointmants.push new date z.b.



            },


            onClick: function () {


                var oKalender = this.byId("PC1");
                oKalender.setStartDate(firstDayOfWeek);
            },


            getfirstDayOfWeek: function () {

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
                MessageToast.show(`Hallo ${this.getView().getModel("UserModel").getProperty("/User/Username")}, du hast deinen Urlaubsantrag vom ${sUrlaubStart.toLocaleDateString()} bis zum ${sUrlaubEnde.toLocaleDateString()} abgeschickt`)


            },


            setFirstDay: function () {
                var Date = this.getfirstDayOfWeek();
                var oKalender = [];
                oKalender.push(this.byId("EmployeePC"));
                oKalender.push(this.byId("OwnPC"));
                oKalender.push(this.byId("TeamPC"));
                oKalender.forEach(element => {
                    element.setStartDate(Date);
                });

            },






        });
    });
