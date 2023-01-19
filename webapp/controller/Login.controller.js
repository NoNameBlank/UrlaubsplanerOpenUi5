sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Login", {
            onInit: function () {

            },
            handleClick: function(){
        //  var oRouter = sap.ui.core.UIComponent.getRouter();
        //         oRouter.navTo("RouteDashboard");
                this.getOwnerComponent().getRouter().navTo("RouteDashboard");
            }
        });

       

    });
