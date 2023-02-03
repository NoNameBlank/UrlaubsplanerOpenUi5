sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
  ], function(Controller, JSONModel, ODataModel) {
    "use strict";
  
    return Controller.extend("your.namespace.controller.HolidayPlanner", {
      onInit: function() {
        var oModel = new ODataModel("your.backend.service.url");
        this.getView().setModel(oModel);
      }
    });
  });
  //Dieser Controller legt bei seiner Initialisierung ein ODataModel an und bindet es an die View. Mit "your.namespace.controller.HolidayPlanner" muss der tatsächliche Namensraum ersetzt werden, unter dem der Controller in der Anwendung bereitgestellt wird. Ebenso muss die URL des Backend-Service durch "your.backend.service.url" ersetzt werden.
  
  
  
  
  