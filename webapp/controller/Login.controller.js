sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
	"./helper/DataHelper"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ODataModel, Datahelper) {
        "use strict";

        return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Login", {
            onInit: function () {
                
            },
            handleClick: function () {
                //  var oRouter = sap.ui.core.UIComponent.getRouter();
                //         oRouter.navTo("RouteDashboard");
                //Test Kommentar für Push

                var sBenutzerLogin = this.byId("benutzerInput").getValue();
                var sBenutzerPasswort = this.byId("passwordInput").getValue();

                var oModel = new sap.ui.model.xml.XMLModel();
                var that = this;
                //test KOMMENTAR




            var oController = this;
            var oParams = { "username": sBenutzerLogin, "passwort": sBenutzerPasswort };
			var sURL = "http://localhost:3000/api/userDetail";

			Datahelper.read(sURL, oParams, oController).then(function(oResponse){
                console.warn(oResponse)
                that.getOwnerComponent().getRouter().navTo("RouteDashboard", {
                    userId: oResponse.userId,
                    token: oResponse.token
                });
			}.bind(this)).catch(function(oError){
				console.log(oError);
				if(oError.status === 401){
				 			MessageToast.show("Deine Sitzung ist abgelaufen");
				 			var oRouter = oController.getOwnerComponent().getRouter();
							oRouter.navTo("RouteLogin", {}, true);
				}
                sap.m.MessageToast.show("BenutzerName oder Passwort falsch!");
			})

                this.getView().setModel(oModel);

            },
            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
    
                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("overview", {}, true);
                }
            },
            //DIe FUnktion soll später i Backend geladen werden
            
            checkUserExist: function (loginName, loginPasswort) {


                var oModel = this.getView().getModel("oUserModel");





            },

            
            loadData: function () {
                // var oModel = new sap.ui.model.json.JSONModel();
                // oModel.setData({
                //     people: [{
                //         id: 1,
                //         pic: "",
                //         name: "Jens",
                //         passwort: "123",
                //         role: "Teamleiter",
                //         vacation: 31,
                //         vacationLeft: 4,
                //         vacationPlaned: 3,
                //         vacationLastYear: 10,
                //         freeDays: [5, 6],
                //         freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                //         appointments: [{
                //             pic: "",
                //             title: "Urlaub",
                //             start: new Date(2023, 1, 1, 11, 30),
                //             end: new Date(2023, 2, 3, 11, 30),
                //             type: "Type03",
                //             tentative: true
                //         }],
                //     },
                //     {
                //         id: 2,
                //         pic: "",
                //         name: "Ulla",
                //         passwort: "321",
                //         role: "Mitarbeiter",
                //         vacation: 31,
                //         vacationLeft: 4,
                //         vacationPlaned: 3,
                //         vacationLastYear: 10,
                //         freeDays: [5, 6],
                //         freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                //         appointments: [{
                //             pic: "",
                //             title: "Urlaub",
                //             start: new Date(2023, 1, 1, 11, 30),
                //             end: new Date(2023, 2, 3, 11, 30),
                //             type: "Type03",
                //             tentative: true
                //         }],
                //     },
                //     {
                //         id: 3,
                //         pic: "",
                //         name: "Albert",
                //         passwort: "111",
                //         role: "Mitarbeiter",
                //         vacation: 31,
                //         vacationLeft: 4,
                //         vacationPlaned: 3,
                //         vacationLastYear: 10,
                //         freeDays: [5, 6],
                //         freeHours: [0, 1, 2, 3, 4, 5, 6, 17, 19, 20, 21, 22, 23],
                //         appointments: [{
                //             pic: "",
                //             title: "Urlaub",
                //             start: new Date(2023, 1, 1, 11, 30),
                //             end: new Date(2023, 2, 3, 11, 30),
                //             type: "Type03",
                //             tentative: true
                //         }],
                //     },
                //     ]
                // });
                // this.getView().setModel(oModel, "oUserModel");


                // var oDataModel = new ODataModel("http://localhost:3000/",{
                //     type: "JSON"
                // });
                // oDataModel.read("/users", {
                //     success:  function(oResponse){
                //         console.log(oResponse);
                //     },
                //     error: function(oResponse){
                //         console.log(oResponse);
                //     }
                // })








            },

        });



    });
