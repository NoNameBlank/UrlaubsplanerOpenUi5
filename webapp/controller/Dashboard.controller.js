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

               






            },
            onRouteMatched: function (oEvent) {

                this.userId = oEvent.getParameter("arguments").userId;
                console.log( " UserId im DashboardController die durch Login übergeben wurde "  + this.userId);
                // this.loadData();
                // this.loadDataIntoUser(this.userId);

               debugger;



                this.setFirstDay();
                


            },
            /*
            loadData: function () {
               


                // MOCK-Data Team
                var oTeamModel = new sap.ui.model.json.JSONModel();
                oTeamModel.setData({
                    people: [{
                        id: 1,
                        pic: "",
                        name: "Jens",
                        role: "Teamleiter",
                        vacation: 31,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
                        id: 2,
                        pic: "",
                        name: "Ulla",
                        role: "Mitarbeiter",
                        vacation: 31,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
                        id: 3,
                        pic: "",
                        name: "Albert",
                        role: "Mitarbeiter",
                        vacation: 31,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
                

               

                
                var aEntries = oTeamModel.getProperty("/peopleTeam");
                var oTeamModel= aEntries;
              






                
            },
                */

            /*
            loadDataIntoUser: function (userId) {

                var oUserModel = new sap.ui.model.json.JSONModel();
                oUserModel.setData({
                    people: [{
                        id: 1,
                        pic: "",
                        name: "Jens",
                        role: "Teamleiter",
                        vacation: 20,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
                        id: 2,
                        pic: "",
                        name: "Ulla",
                        role: "Mitarbeiter",
                        vacation: 31,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
                        id: 3,
                        pic: "",
                        name: "Albert",
                        role: "Mitarbeiter",
                        vacation: 31,
                        vacationLeft: 4,
                        vacationPlaned: 3,
                        vacationLastYear: 10,
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
              
                var aEntries = oUserModel.getProperty("/people");

                var oUser = aEntries.find(function (oUser) {
                    return oUser.id === parseInt(userId);
                })
                oUserModel.setProperty("/User", oUser);

                this.getView().setModel(oUserModel, "UserModel");

               



            },
            */
            employeeHandleClick: function () {



                this.getOwnerComponent().getRouter().navTo("RouteEmployees");
               
            },


            urlaubsVerwaltungHandleClick: function () {
                
               
                 
                this.getOwnerComponent().getRouter().navTo("RouteUrlaubsVerwaltung", {
                    userId: this.userId,
                    
                 });
              
                
                
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
               // this.byId("datePicker").setValue(null);
                //this.byId("datePicker2").setValue(null);
                //this.byId("InputGrundRequired").setValue(null);

            },


            sendVacation: function () {




                //Zu Buchunder Urlaub wird ausgelesen und in Variable gespeichert
            
                var oUser = this.getView().getModel("UserModel").getProperty("/User");
                var sUrlaubStart = this.byId("datePicker").getDateValue();
                var sUrlaubEnde = this.byId("datePicker2").getDateValue();
                var today = new Date();
                var day = today.getDay();

               




                //Speicher die Zeit zwischen urlaubsStart und urlaubEnde in ms  in diffTage
                var diffTage = sUrlaubEnde.getTime() - sUrlaubStart.getTime();
                //diffTage wird durch Tag in ms geteilt und der floatwert wird durch Math.floor in eine ganze Zahl konvertiert
                var iTage = Math.floor(1 + (diffTage / (24 * 60 * 60 * 1000)));




                //Hole dir verbleibende und breitsgeplante Tage
                var iUserRestTage = this.getView().getModel("UserModel").getProperty("/User/vacationLeft");
                var iUserBeantragt = this.getView().getModel("UserModel").getProperty("/User/vacationPlaned");


                //Schaue ob beantragte Tage kleinerGleich Restage sind wenn ja dann
                if (sUrlaubStart < today) {

                    MessageToast.show("Dein Urlaub darf nicht in der Vergangenheit liegen!");
                }
                else if (sUrlaubEnde < today) {

                    MessageToast.show("Dein Urlaub darf nicht in der Vergangenheit liegen!");
                }
                else if (sUrlaubEnde < sUrlaubStart) {

                    MessageToast.show("Dein Urlaubs Ende darf nicht vor dem Beginn deines Urlaubs liegen!");
                }
                else if (iTage <= iUserRestTage) {

                    //UrlaubsVerwaltungDaten
                    this.sUrlaubsVerwaltungStart = sUrlaubStart;
                    this.sUrlaubsVerwaltungEnde = sUrlaubEnde;

                    
                    //Pushe den geplante Urlaub + ändere die Models auf Aktuelle Werte    
                    
                  
                    this.urlaubPush(sUrlaubStart, sUrlaubEnde, oUser);
                    this.byId("OwnPC").getModel("UserModel").setProperty("/User/vacationLeft", iUserRestTage -iTage);
                    this.byId("OwnPC").getModel("UserModel").setProperty("/User/vacationPlaned", iUserBeantragt + iTage);
                   
                } else {
                    //Gebe Fehler Meldung mit Grund aus
                    console.log("Error zu wenig UrlaubsTage");
                    MessageToast.show(`Fehler ${this.getView().getModel("UserModel").getProperty("/User/name")}, du hast nur ${iUserRestTage} Tage zur Verfügung und hast versucht ${iTage} Tage zubeantragen. `)

                }




                // var sUrlaubsGrund = this.byId("InputGrundRequired").getValue();


                this.closeDialog();
                //MessageToast.show(`Hallo ${this.getView().getModel("UserModel").getProperty("/User/name")}, du hast deinen Urlaubsantrag vom ${sUrlaubStart.toLocaleDateString()} bis zum ${sUrlaubEnde.toLocaleDateString()} abgeschickt`)

                //Beantragter Urlaub wird in
                //this.urlaubPush(sUrlaubStart, sUrlaubEnde, oUser);


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

            urlaubPush: function (sUrlaubStart, sUrlaubsEnde, oUser) {

                var aAppointments = oUser.appointments;
                
                //Wichtig für Anzeige im Kalender
                sUrlaubsEnde.setHours(23, 59);

                console.log(sUrlaubsEnde);
                aAppointments.push({
                    pic: "",
                    title: "Urlaub",
                    start: new Date(sUrlaubStart),
                    end: new Date(sUrlaubsEnde),
                    type: "Type05",
                    tentative: true
                })

                this.byId("OwnPC").getModel("UserModel").setProperty("/User/appointments", aAppointments);
                //this.byId("TeamPC").getModel("oTeamModel").setProperty("/Team/appointments", aAppointments);
                
               
               

                 


            }






        });
    });
