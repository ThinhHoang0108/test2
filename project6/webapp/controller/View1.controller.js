sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    // "project6/utils/formatter",
    "sap/ui/core/Fragment",
], (Controller, Filter, FilterOperator, MessageBox, SelectDialog, Fragment) => {
    "use strict";

    return Controller.extend("project6.controller.View1", {
        // formatter: Formatter,

        onInit: function () {
            this.getOwnerComponent().getModel().read("/Travel", {
                urlParameters: {
                    "$expand": "to_customer,to_agency"
                },
                success: function (orderData) {
                    // console.log(orderData.results);
                    
                    for (let i = 0; i < orderData.results.length; i++) {
                        orderData.results[i].newColumn = orderData.results[i].FirstName + orderData.results[i].LastName;
                        
                    }
                    // Create a new JSON model
                    var oJsonModel = new sap.ui.model.json.JSONModel();

                    // Set the data to the JSON model directly from orderData.results
                    oJsonModel.setData(orderData.results);

                    // Set the model to the view with a named model "oJsonForView"
                    this.getView().setModel(oJsonModel, "oJsonForView");

                    // Optionally set a property "/TravelData" in the default model
                    //test commit
                    this.getView().getModel().setProperty("/TravelData", orderData.results);
                }.bind(this),
                error: function (oError) {
                    console.log("fail connected");
                }
            });

            // Initialize Agency Dialog
            this._oAgencyDialog = new SelectDialog({
                title: "Select Agency",
                items: {
                    path: "/travelAgency",
                    template: new sap.m.StandardListItem({
                        title: "{AgencyId}",
                        description: "{Name}" // Display agency name
                    })
                },
                search: function (oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("AgencyId", FilterOperator.Contains, sValue);
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                confirm: function (oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        var sAgencyId = oSelectedItem.getTitle();
                        this._oAgencyInput.setValue(sAgencyId);
                    }
                }.bind(this)
            });

            this.getView().addDependent(this._oAgencyDialog);

            // Initialize Customer Dialog
            this._oCustomerDialog = new SelectDialog({
                title: "Select Customer",
                items: {
                    path: "/travelCustomer",
                    template: new sap.m.StandardListItem({
                        title: "{CustomerId}",
                        description: "{FirstName} {LastName}" // Display customer name
                    })
                },
                search: function (oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("CustomerId", FilterOperator.Contains, sValue);
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                },
                confirm: function (oEvent) {
                    var oSelectedItem = oEvent.getParameter("selectedItem");
                    if (oSelectedItem) {
                        var sCustomerId = oSelectedItem.getTitle();
                        this._oCustomerInput.setValue(sCustomerId);
                    }
                }.bind(this)
            });

            this.getView().addDependent(this._oCustomerDialog);
        },

        onAgencyValueHelp: function (oEvent) {
            this._oAgencyInput = oEvent.getSource();
            this._oAgencyDialog.open();
        },

        onCustomerValueHelp: function (oEvent) {
            this._oCustomerInput = oEvent.getSource();
            this._oCustomerDialog.open();
        },


        saveFunc: function () {
            var agencyIDRef = this.getView().byId("agID").getValue();
            var customerIDRef = this.getView().byId("cusID").getValue();
            if (agencyIDRef.trim() !== "" && customerIDRef.trim() !== "") {
                MessageBox.success("Travel has been edited successfully");
            } else {
                MessageBox.warning("Travel must be in a valid format");
            }

        },

        f4HelpForAgencyId: function () {
            if (!this.agID) {
                this.agID = sap.ui.xmlfragment("project6/fragments/Travel", this);
                this.getView().addDependent(this.agID);
            }
            this.agID.open();
        },

        f4HelpForCustomerId: function () {
            if (!this.cusID) {
                this.cusID = sap.ui.xmlfragment("project6/fragments/Customer", this);
                this.getView().addDependent(this.cusID);
            }
            this.cusID.open();
        },

        onPressAddNewProduct() {
            // Load and display the create new product dialog
            if (!this._oCreateProductDialog) {
                this._loadDialog("Create").then(oDialog => {
                    this._oCreateProductDialog = oDialog
                    oDialog.open()
                })
            } else {
                this._oCreateProductDialog.open()
            }
        },
        onPressCancelNewProduct() {
            // Get the SimpleForm by its ID
            var oSimpleForm = this.getView().byId("SimpleFormToolbar");

            // Get all input fields inside the SimpleForm
            var aFormContent = oSimpleForm.getContent();

            // Iterate through each field and reset its value
            aFormContent.forEach(function (oField) {
                if (oField instanceof sap.m.Input || oField instanceof sap.m.DatePicker) {
                    oField.setValue(""); // Reset the value to empty
                }
            });

            // Close the dialog
            this._oCreateProductDialog.close();
        },

        onValueHelpDialogClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"), oInput;
            var sFragmentId = oEvent.getSource().getId();

            if (sFragmentId.includes("agencyDialog")) {
                oInput = this.byId("agID");
            } else if (sFragmentId.includes("customerDialog")) {
                oInput = this.byId("cusID");
            }

            if (!oSelectedItem) {
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
        },
        _loadDialog(sFragmentName) {
            return new Promise((resolve, reject) => {
                Fragment.load({
                    id: this.getView().getId(),
                    name: `com.sap.project6.fragments.${sFragmentName}`,
                    controller: this
                }).then(oDialog => {
                    this.getView().addDependent(oDialog);
                    resolve(oDialog)
                })
            })
        }
    });
});