sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
    "sap/ui/export/library"
], function (Controller, Filter, FilterOperator, MessageToast, MessageBox, Spreadsheet, exportLibrary) {
    "use strict";

    const EdmType = exportLibrary.EdmType;

    return Controller.extend("foodorderadmin.controller.View1", {

        onInit: function () {
            // Initialize references
            this._oModel = this.getOwnerComponent().getModel();
            this._oTable = this.byId("ordersTable");
            this._aCurrentFilters = [];

            // Load initial data
            this._loadData();
        },

        /* =========================================================== */
        /* Data Loading                                                */
        /* =========================================================== */

        _loadData: function () {
            this._oModel.refresh();
            this._updateTableTitle();
        },

        _updateTableTitle: function () {
            const oBinding = this._oTable.getBinding("items");
            if (oBinding) {
                const iTotal = oBinding.getLength() || 0;
                const iFiltered = oBinding.getCurrentContexts().length || 0;

                let sTitle = `Orders (${iTotal})`;
                if (iFiltered !== iTotal) {
                    sTitle = `Orders (${iFiltered} of ${iTotal})`;
                }

                this.byId("tableTitle").setText(sTitle);
            }
        },

        /* =========================================================== */
        /* Filter Event Handlers                                      */
        /* =========================================================== */

        onFilterChange: function () {
            // Auto-apply filters on change (optional)
            // this.onApplyFilters();
        },

        onApplyFilters: function () {
            const aFilters = [];

            try {
                // Date Filter
                const oDateFilter = this.byId("orderDateFilter");
                if (oDateFilter && oDateFilter.getDateValue()) {
                    const dFrom = oDateFilter.getDateValue();
                    const dTo = oDateFilter.getSecondDateValue();
                    if (dFrom && dTo) {
                        const sFromDate = this._getDateOnlyISO(dFrom);
                        const sToDate = this._getDateOnlyISO(dTo);
                        aFilters.push(new Filter("orderDate", FilterOperator.BT, sFromDate, sToDate));
                    } else if (dFrom) {
                        const sFromDate = this._getDateOnlyISO(dFrom);
                        aFilters.push(new Filter("orderDate", FilterOperator.EQ, sFromDate));
                    }
                }

                // Buyer Filter
                const oBuyerFilter = this.byId("buyerFilter");
                if (oBuyerFilter) {
                    const sBuyerId = oBuyerFilter.getSelectedKey();
                    if (sBuyerId) {
                        aFilters.push(new Filter("buyer/buyerName", FilterOperator.EQ, sBuyerId));
                    }
                }

                // Status Filter
                const sStatusCode = this.byId("statusFilter").getSelectedKey();
                if (sStatusCode) {
                    aFilters.push(new Filter({
                        path: "status_code",
                        operator: FilterOperator.EQ,
                        value1: sStatusCode
                    }));
                }

                // Create a single filter with AND condition
                const oCombinedFilter = new Filter({
                    filters: aFilters,
                    and: true
                });

                // Apply filters to table
                const oBinding = this._oTable.getBinding("items");
                if (oBinding) {
                    oBinding.filter(oCombinedFilter);
                    this._aCurrentFilters = aFilters;
                    this._updateTableTitle();

                    MessageToast.show(`${aFilters.length} filter(s) applied`);
                } else {
                    MessageBox.error("Unable to apply filters. Table binding not found.");
                }

            } catch (oError) {
                MessageBox.error("Error applying filters: " + oError.message);
            }
        },

        onClearFilters: function () {
            // Clear all filter controls
            this.byId("orderDateFilter").setValue("");
            this.byId("buyerFilter").setSelectedKey("");
            this.byId("statusFilter").setSelectedKey("");

            // Clear table filters
            const oBinding = this._oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter([]);
                this._aCurrentFilters = [];
                this._updateTableTitle();
            }

            MessageToast.show("All filters cleared");
        },

        /* =========================================================== */
        /* Table Event Handlers                                       */
        /* =========================================================== */

        onOrderPress: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            const sOrderId = oBindingContext.getProperty("ID");
            const sOrderNumber = oBindingContext.getProperty("orderNumber");

            MessageToast.show(`Opening order: ${sOrderNumber}`);

            // Navigate to order details (implement as needed)
            // this._navigateToOrderDetails(sOrderId);
        },

        onCreateOrder: function () {
            MessageToast.show("Create Order functionality - To be implemented");
            // Implement order creation logic
        },

        onEditOrder: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            const sOrderNumber = oBindingContext.getProperty("orderNumber");
            const sStatus = oBindingContext.getProperty("status/code");

            if (sStatus === "C") {
                MessageBox.warning("Closed orders cannot be edited.");
                return;
            }

            MessageToast.show(`Edit order: ${sOrderNumber}`);
            // Implement edit logic
        },

        onViewDetails: function (oEvent) {
            const oBindingContext = oEvent.getSource().getBindingContext();
            const sOrderNumber = oBindingContext.getProperty("orderNumber");

            MessageToast.show(`View details for: ${sOrderNumber}`);
            // Implement details view
        },

        onRefresh: function () {
            this._loadData();
            MessageToast.show("Data refreshed successfully");
        },

        onExport: function () {
            const oBinding = this._oTable.getBinding("items");
            const aData = [];

            // Get current data (respecting filters)
            const aContexts = oBinding.getCurrentContexts();

            aContexts.forEach(function (oContext) {
                const oData = oContext.getObject();
                aData.push({
                    orderNumber: oData.orderNumber || "",
                    buyerName: oData.buyer?.buyerName || "",
                    buyerEmpId: oData.buyer?.buyerEmpid || "",
                    buyerContact: oData.buyer?.buyerContact || "",
                    orderDate: oData.orderDate || "",
                    orderTime: oData.orderTime || "",
                    numberOfPeople: oData.numberOfPeople || 0,
                    totalAmount: oData.totalAmount || 0,
                    currency: oData.currency_code || "IDR",
                    status: oData.status?.name || "",
                    deliveryFee: oData.deliveryFee || 0,
                    discountPercent: oData.discountPercent || 0
                });
            });

            // Create Excel export
            const oSpreadsheet = new Spreadsheet({
                workbook: {
                    columns: [
                        { label: "Order Number", property: "orderNumber", type: EdmType.String },
                        { label: "Buyer Name", property: "buyerName", type: EdmType.String },
                        { label: "Employee ID", property: "buyerEmpId", type: EdmType.String },
                        { label: "Contact", property: "buyerContact", type: EdmType.String },
                        { label: "Order Date", property: "orderDate", type: EdmType.Date },
                        { label: "Order Time", property: "orderTime", type: EdmType.TimeOfDay },
                        { label: "People Count", property: "numberOfPeople", type: EdmType.Number },
                        { label: "Total Amount", property: "totalAmount", type: EdmType.Number },
                        { label: "Currency", property: "currency", type: EdmType.String },
                        { label: "Status", property: "status", type: EdmType.String },
                        { label: "Delivery Fee", property: "deliveryFee", type: EdmType.Number },
                        { label: "Discount %", property: "discountPercent", type: EdmType.Number }
                    ]
                },
                dataSource: aData,
                fileName: `Food_Orders_Export_${new Date().toISOString().split('T')[0]}.xlsx`
            });

            oSpreadsheet.build();
            MessageToast.show("Excel export started");
        },

        /* =========================================================== */
        /* Formatters                                                  */
        /* =========================================================== */

        formatStatusState: function (sStatusCode) {
            switch (sStatusCode) {
                case "O": // Open
                    return "Warning";
                case "C": // Close
                    return "Success";
                default:
                    return "None";
            }
        },

        formatStatusIcon: function (sStatusCode) {
            switch (sStatusCode) {
                case "O": // Open
                    return "sap-icon://pending";
                case "C": // Close
                    return "sap-icon://accept";
                default:
                    return "sap-icon://question-mark";
            }
        },

        isOrderEditable: function (sStatusCode) {
            // Only open orders are editable
            return sStatusCode === "O";
        },


        /* =========================================================== */
        /* Helper Methods                                              */
        /* =========================================================== */

        _navigateToOrderDetails: function (sOrderId) {
            // Implement navigation to order details page
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("orderDetails", {
                orderId: sOrderId
            });
        },

        _getCurrentFilters: function () {
            return this._aCurrentFilters;
        },

        _hasActiveFilters: function () {
            return this._aCurrentFilters.length > 0;
        },

        _getDateOnlyISO: function (oDate) {
            if (!oDate) return null;

            // Get date in ISO format and take only the date part
            return oDate.toISOString().split('T')[0]; // Returns "2025-06-12"
        },
    });
});