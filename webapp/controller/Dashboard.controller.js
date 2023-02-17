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
            onNavBack: function () {
                
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteLogin", {}, true);
            },
            onRouteMatched: function (oEvent) {

                this.userId = oEvent.getParameter("arguments").userId;
                console.log(" UserId im DashboardController die durch Login übergeben wurde " + this.userId);
                this.loadData();
                this.setFirstDay();



            },
            
            loadData: function () {
               
                //GET /api/userById


                //in oView wird die Dashboard view geladen
                var oView = this.getView();
                //ein Objet vom Typ JSON Model erstellt (Für die User-Abfrage)
                var oModel = new sap.ui.model.json.JSONModel();
                //ein neues Model wird in JSON Format erstellt (für den Kalender)
                var oKalenderModel = new sap.ui.model.json.JSONModel();
                //ein Array wird deklariert (für die Appointments)
                var aArray = [];
                //this kann im ajax aufruf nicht verwendet werden
                var oController = this;
                
                //ajax ist ein Funktion von jQuery , dem man ein Object mit unten Stehen param übergeben kann
                jQuery.ajax({
                    //type: GET er soll nur Lesen 
                    type: "GET",
                    //Für das Backend WIchtig, damit das Backend weiß wie die Informationen verarbeitet werden können
                    contentType: "application/xml",
                    //die Route wo die Daten zu verfügung stehen
                    url: "http://localhost:3000/api/userById",
                    //Format der Daten in data stehen
                    dataType: "json",
                    //der Parameter userId wird mit an das Backendübergeben um mit dieser userId zugehörige werte aus dem Backend zu hohlen
                    data: $.param({ "userId": this.userId }),
                   //async  Er wartet auf die Daten response 
                    async: true,
                    
                    //Sollte es Erfolgreich sein dann. function (oResponse, textStatus, jqXHR) ?
                    success: function (oResponse) {
                        // console.log("Das müssten die Daten vom Eingeloggten User sein: ");
                        console.log(oResponse.data);
                        //Durchlauf durch das Array mit allen Urlaubseinträgen des Users
                        //oResponse: Das ist der Paramter den die Funktion erwartet
                        //.data: im Backend wird ein  var data erstellt in dem die Angefragten Daten im Backed gespeichert werden und an das Frontend übergeben werden
                        //.appointments: im Backend werden die User Daten in user.dataValues.appointments [] gespeichrt diese Appointments werden über die REsponse ans Frontend geschickt
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

                        //in das oModel von Typ JSONModel wird mit dem Pramaeter "/User " das die dateb von oResonse.data erhält
                        oModel.setProperty("/User", oResponse.data);
                        oView.setModel(oModel, "userDetail");
                        aArray.push(oResponse.data);
                        //Das ist das Model das in der Kalender geladen wird
                        oKalenderModel.setProperty("/people", aArray);
                        oView.setModel(oKalenderModel, "urlaubKalenderModel");
                        console.log("Hier drunte sollte das oKalenderModel ausgegeben werden.")
                        console.log(oKalenderModel);
                        if(oResponse.data.role === "Teamleiter"){
                            oController.loadOwnTeamData(oResponse.data.userId);
                        }
                       
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Fehler beim Laden der Benutzerdaten");
                    }
                }); 
                
                
            },
                
            loadOwnTeamData: function(userId) {
                var oView = this.getView();
                var oModel = new sap.ui.model.json.JSONModel();
                jQuery.ajax({
                    type: "GET",
                    contentType: "application/xml",
                    url: "http://localhost:3000/api/userTeam",
                    dataType: "json",
                    data: $.param({ "teamLeiterId": userId }),
                    async: true,
                    success: function (oResponse) {
                        
                        oModel.setProperty("/Team", oResponse.data);
                        oResponse.data.forEach(element => {
                            element.appointments.forEach(urlaubsobjekt => {
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
                        });
                       

                        console.log(oModel);
                        oView.setModel(oModel, "oTeamModel");
                    },
                    error: function (oResponse) {
                        sap.m.MessageToast.show("Fehler beim Laden der Benutzerdaten");
                    }
                })
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
                        vacationLeft: 432,
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
                
                                  

                this.getOwnerComponent().getRouter().navTo("RouteEmployees", 
                {
                    userId : this.userId
                });                       
            },


            vacationHandleClick: function () {
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
                this.byId("datePicker").setValue(null);
                this.byId("datePicker2").setValue(null);
                this.byId("InputGrundRequired").setValue(null);
            },


            sendVacation: function () {

                //Zu Buchunder Urlaub wird ausgelesen und in Variable gespeichert

                // POST - /api/urlaub 

                var sUrlaubStart = this.byId("datePicker").getDateValue();
                var sUrlaubEnde = this.byId("datePicker2").getDateValue();
                var sTitel = this.byId("InputGrundRequired").getValue();
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
                    this.urlaubPush(sUrlaubStart, sUrlaubEnde, sTitel);
                } else {
                    //Gebe Fehler Meldung mit Grund aus
                    console.log("Error zu wenig UrlaubsTage");
                   
                }
                this.closeDialog();
                


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

            urlaubPush: function (sUrlaubStart, sUrlaubsEnde, sTitel) {

                var oUser = this.getView().getModel("userDetail").getProperty("/User");
                var oController = this;
                //Wichtig für Anzeige im Kalender (setzt das Ende auch auf 23:59 Uhr an dem Tag)
                sUrlaubsEnde.setHours(23, 59);

                var oAppointment = {
                    pic: "",
                    userId: oUser.userId,
                    title: sTitel,
                    start: new Date(sUrlaubStart),
                    end: new Date(sUrlaubsEnde),
                    status: "beantragt"
                }
                console.log("urlaubsPush oAppointment ausgabe!")
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
                        oController.loadData();
                    },
                    error: function (oResponse) {
                        if(oResponse.status === 200){
                            sap.m.MessageToast.show("Urlaub erfolgreich beantragt");
                            oController.loadData();
                        }else{
                            sap.m.MessageToast.show("Fehler beim Antrag einreichen.");
                            console.log(oResponse);
                        }
                        
                        
                    }
                });      

            }

        });
    });
