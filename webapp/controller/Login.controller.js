sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",

],

    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ReadData) {
        "use strict";

        return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Login", {
            onInit: function () {


            },
            handleClick: function () {

                var sBenutzerLogin = this.byId("benutzerInput").getValue();
                var sBenutzerPasswort = this.byId("passwordInput").getValue();

                var oModel = new sap.ui.model.xml.XMLModel();
                var that = this;

                ReadData.readDataLogin(sBenutzerLogin, sBenutzerPasswort)
                    .then(function (data) {
                        console.log(data);

                        that.getOwnerComponent().getRouter().navTo("RouteDashboard", {
                            userId: data.userId
                        });
                    })
                    .catch(function (oResponse) {
                        sap.m.MessageToast.show("BenutzerName oder Passwort falsch!");
                    });

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





            }




        });



    });
