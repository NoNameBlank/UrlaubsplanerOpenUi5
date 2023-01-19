sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("urlaubsplaner.urlaubsplaner.controller.Dashboard", {
            onInit: function () {

            },
            onRouteMatched: function(){

            },
            onClick: function() {
                debugger;
                var oKalender = this.byId("PC1");
                oKalender.setStartDate(new Date());
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
            }
        });
    });
