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
                console.log(" UserId im DashboardController die durch Login übergeben wurde " + this.userId);
                this.loadData();
                this.setFirstDay();



            },
            
            loadData: function () {
               
                var oView = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
                var oKalenderModel = new sap.ui.model.json.JSONModel();
                var aArray = [];
                var that = this;
                
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/xml",
                    url: "http://localhost:3000/api/userdetails",
                    dataType: "json",
                    data: $.param({ "userId": this.userId }),
                    async: true,
                    success: function (oResponse, textStatus, jqXHR) {
                        console.log("Das müssten die Daten vom Eingeloggten User sein: ");
                        console.log(oResponse);
                        //Durchlauf durch das Array mit allen Urlaubseinträgen des Users
                        oResponse.data.appointments.forEach(urlaubsobjekt => {
                            console.log(urlaubsobjekt);
                            urlaubsobjekt.type = "Type05";
                            var dateParts = urlaubsobjekt.startDatum.split(".");
                            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                            urlaubsobjekt.startDatum = dateObject;
                            dateParts = urlaubsobjekt.endDatum.split(".");
                            dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                            urlaubsobjekt.endDatum = dateObject;
                        });


                        oModel.setProperty("/User", oResponse.data);
                        oView.setModel(oModel, "userDetail");
                        aArray.push(oResponse.data);
                        
                        oKalenderModel.setProperty("/people", aArray);
                        oView.setModel(oKalenderModel, "urlaubKalenderModel");
                        console.log("Hier drunte sollte das oKalenderModel ausgegeben werden.")
                        console.log(oKalenderModel);
                        debugger;
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Fehler beim Laden der Benutzerdaten");
                    }
                });                
            },
                

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

                var sUrlaubStart = this.byId("datePicker").getDateValue();
                var sUrlaubEnde = this.byId("datePicker2").getDateValue();
                var today = new Date();
                var day = today.getDay();
                var iUserRestTage = this.getView().getModel("userDetail").getProperty("/User/restUrlaub");
                //Speicher die Zeit zwischen urlaubsStart und urlaubEnde in ms  in diffTage
                var diffTage = sUrlaubEnde.getTime() - sUrlaubStart.getTime();
                //diffTage wird durch Tag in ms geteilt und der floatwert wird durch Math.floor in eine ganze Zahl konvertiert
                var iTage = Math.floor(1 + (diffTage / (24 * 60 * 60 * 1000)));

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


                    //Aufruf der update funktion vom Backend  
                    this.urlaubPush(sUrlaubStart, sUrlaubEnde);
                } else {
                    //Gebe Fehler Meldung mit Grund aus
                    console.log("Error zu wenig UrlaubsTage");
                   
                }
                this.closeDialog();
                


            },


            setFirstDay: function () {
                var Date = this.getfirstDayOfWeek();
                var oKalender = [];
                // oKalender.push(this.byId("EmployeePC"));
                oKalender.push(this.byId("OwnPC"));
                oKalender.push(this.byId("TeamPC"));
                oKalender.forEach(element => {
                    element.setStartDate(Date);
                });

            },

            urlaubPush: function (sUrlaubStart, sUrlaubsEnde) {

                var oUser = this.getView().getModel("userDetail").getProperty("/User");

                //Wichtig für Anzeige im Kalender (setzt das Ende auch auf 23:59 Uhr an dem Tag)
                sUrlaubsEnde.setHours(23, 59);

                var oAppointment = {
                    pic: "",
                    userId: oUser.userId,
                    title: "Urlaub",
                    start: new Date(sUrlaubStart),
                    end: new Date(sUrlaubsEnde),
                    status: "beantragt"
                }

                console.log(oAppointment);

                //hier muss der Ajax Call rein mit einem push auf /Urlaub, mitgegebn wird dem Call oAppointment als data
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/api/urlaub",
                    dataType: "json",
                    data: $.param({oAppointment}),
                    async: true,
                    success: function (oResponse, textStatus, jqXHR) {
                        sap.m.MessageToast.show("Urlaub erfolgreich beantragt");
                        console.log(oResponse);
                        //nach dem Call muss ein erneutes laden der Daten erfolgen -> aufruf loaddata funktion
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Fehler beim Antrag einreichen.");
                        console.log(oResponse);
                    }
                });         
                






            }






        });
    });
