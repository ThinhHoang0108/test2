sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/SelectDialog",
    "project4/utils/formatter",
], (Controller, Filter, FilterOperator, MessageBox, SelectDialog, Formatter) => {
    "use strict";

    return Controller.extend("project4.controller.View1", {
        formatter: Formatter,
        onInit: function () {
            console.log("Formatter Loaded:", this.formatter);
            // Load data for travelCustomer
            this.getOwnerComponent().getModel().read("/Travel", {
                urlParameters: {
                    "$expand": "to_customer,to_agency"
                },
                success: function (orderData) {
                    var lv_d1 = orderData.results;
                    var oJsonModel = new sap.ui.model.json.JSONModel();
                    oJsonModel.setData(lv_d1);
                    this.getView().setModel(oJsonModel, "oJsonForView");
                    console.log('success connected');
                }.bind(this),
                error: function (oError) {
                    console.log("fail connected");
                }
            });

            // Initialize Agency Dialog
            this._oAgencyDialog = new SelectDialog({
                title: "Select Agency",
                items: {
                    path: "/travelAgency", // Entity Set trong OData Model
                    template: new sap.m.StandardListItem({
                        title: "{AgencyId}",
                        description: "{Name}" // Hiển thị tên đại lý
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
                        var sAgencyId = oSelectedItem.getTitle(); // Lấy AgencyId từ mục được chọn
                        this._oAgencyInput.setValue(sAgencyId); // Gán AgencyId vào Input
                    }
                }.bind(this)
            });

            this.getView().addDependent(this._oAgencyDialog);

            // Initialize Customer Dialog
            this._oCustomerDialog = new SelectDialog({
                title: "Select Customer",
                items: {
                    path: "/travelCustomer", // Entity Set trong OData Model
                    template: new sap.m.StandardListItem({
                        title: "{CustomerId}",
                        description: "{FirstName} {LastName}" // Hiển thị tên khách hàng
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
                        var sCustomerId = oSelectedItem.getTitle(); // Lấy CustomerId từ mục được chọn
                        this._oCustomerInput.setValue(sCustomerId); // Gán CustomerId vào Input
                    }
                }.bind(this)
            });

            this.getView().addDependent(this._oCustomerDialog);
        },

        onAgencyValueHelp: function (oEvent) {
            // Lưu tham chiếu đến Input để sử dụng trong confirm callback
            this._oAgencyInput = oEvent.getSource();
            this._oAgencyDialog.open();
        },

        onCustomerValueHelp: function (oEvent) {
            // Lưu tham chiếu đến Input để sử dụng trong confirm callback
            this._oCustomerInput = oEvent.getSource();
            this._oCustomerDialog.open();
        },
        saveFunc: function () {
            var agencyIDRef = this.getView().byId("agID").getValue();
            var customerIDRef = this.getView().byId("cusID").getValue();
            if (agencyIDRef.trim() !== "" && customerIDRef.trim() !== "") {
                // alert("Success");
                MessageBox.success("Travel has been edit successfully");
            } else {
                // alert("Fail empty");
                MessageBox.warning("Travel must be in format");
            }
        },
        f4HelpForAgencyId: function () {
            //create fragment instance
            if (!this.agID) {
                this.agID = sap.ui.xmlfragment("project4/fragments/Travel", this);
                this.getView().addDependent(this.agID);
            }
            this.agID.open();
        },
        f4HelpForCustomerId: function () {
            //create fragment instance
            if (!this.cusID) {
                this.cusID = sap.ui.xmlfragment("project4/fragments/Customer", this);
                this.getView().addDependent(this.cusID);
            }
            this.cusID.open();

        },
        onValueHelpDialogClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem"), oInput;
            var sFragmentId = oEvent.getSource().getId();
            if (sFragmentId.includes("agencyDialog")) {
                // Fragment là Agency
                oInput = this.byId("agID"); // Id của input cho Agency
            } else if (sFragmentId.includes("customerDialog")) {
                // Fragment là Customer
                oInput = this.byId("cusID"); // Id của input cho Customer
            }

            if (!oSelectedItem) {
                // Nếu không có mục nào được chọn, reset giá trị của input
                oInput.resetProperty("value");
                return;
            }

            oInput.setValue(oSelectedItem.getTitle());
        }
    });
});