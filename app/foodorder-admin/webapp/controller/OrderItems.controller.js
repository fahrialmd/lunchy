sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/ValueState",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, History, ValueState, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("foodorderadmin.controller.OrderItems", {

        // Event Handlers

        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("orderItems").attachPatternMatched(this._onRouteMatched, this);
        },

        onAddItem: function () {
            var oBindingContext = this.getView().getBindingContext();

            if (!oBindingContext) {
                MessageToast.show("No order selected");
                return;
            }

            var sOrderId = oBindingContext.getProperty("ID");
            var sOrderNumber = oBindingContext.getProperty("orderNumber");

            MessageToast.show("Add item to order: " + sOrderNumber);
        },

        onDeleteSelected: function () {
            var oTable = this.byId("orderItemsTable");
            var aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                MessageToast.show("Please select items to delete");
                return;
            }

            var aSelectedItems = [];
            aSelectedIndices.forEach(function (iIndex) {
                var oContext = oTable.getContextByIndex(iIndex);
                if (oContext) {
                    aSelectedItems.push({
                        id: oContext.getProperty("ID"),
                        name: oContext.getProperty("menuItemName"),
                        customer: oContext.getProperty("customerName")
                    });
                }
            });
            var sMessage = "Are you sure you want to delete " + aSelectedItems.length + " item(s)?";
            if (aSelectedItems.length === 1) {
                sMessage = "Are you sure you want to delete item '" +
                    aSelectedItems[0].name + "' for " + aSelectedItems[0].customer + "?";
            }

            MessageBox.confirm(sMessage, {
                title: "Delete Items",
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        this._deleteItems(aSelectedItems);
                    }
                }.bind(this)
            });
        },

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var aSelectedIndices = oTable.getSelectedIndices();

            // Enable/disable delete button based on selection
            var oDeleteButton = this.byId("deleteSelectedButton");
            if (oDeleteButton) {
                oDeleteButton.setEnabled(aSelectedIndices.length > 0);
            }
        },

        onRefresh: function () {
            var oBinding = this.getView().getElementBinding();
            if (oBinding) {
                oBinding.refresh();
                MessageToast.show("Data refreshed");
            }
        },



        onEditOrder: function () {
            var oBindingContext = this.getView().getBindingContext();

            if (!oBindingContext) {
                MessageToast.show("No order selected");
                return;
            }

            var sOrderId = oBindingContext.getProperty("ID");
            MessageToast.show("Edit order: " + sOrderId);

            // TODO: Navigate to edit page or open dialog
            // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            // oRouter.navTo("editOrder", { orderId: sOrderId });
        },
        onDeleteOrder: function () {
            var oBindingContext = this.getView().getBindingContext();

            if (!oBindingContext) {
                MessageToast.show("No order selected");
                return;
            }

            var sOrderNumber = oBindingContext.getProperty("orderNumber");
            var sOrderId = oBindingContext.getProperty("ID");

            MessageBox.confirm(
                "Are you sure you want to delete order '" + sOrderNumber + "'?",
                {
                    title: "Delete Order",
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            this._deleteOrder(sOrderId);
                        }
                    }.bind(this)
                }
            );
        },

        // Internal Methods

        _deleteItems: function (aItems) {
            var oModel = this.getView().getModel();
            var oTable = this.byId("orderItemsTable");

            // TODO: Implement actual deletion logic
            // For now, just show success message
            MessageToast.show("Deleted " + aItems.length + " item(s)");

            // Clear selection
            oTable.clearSelection();

            // Refresh the binding to update the table
            var oBinding = oTable.getBinding("rows");
            if (oBinding) {
                oBinding.refresh();
            }
        },

        _deleteOrder: function (sOrderId) {
            // TODO: Implement actual deletion logic
            MessageToast.show("Order deleted: " + sOrderId);

            // Navigate back after deletion
            this._navBack();
        },

        _onRouteMatched: function (oEvent) {
            var sOrderId = oEvent.getParameter("arguments").orderId;
            var sOrderPath = "/Orders('" + sOrderId + "')";

            this.getView().bindElement({
                path: sOrderPath,
                parameters: {
                    $expand: "buyer,status,items($expand=itemStatus)"
                },
                events: {
                    dataReceived: function (oEvent) {
                        var oData = oEvent.getParameter("data");
                        console.log("Received data:", oData);

                        // Data exists, log details
                        console.log("✅ Order found:", oData);
                        console.log("Order Number:", oData.orderNumber);
                        console.log("Items:", oData.items);
                    }.bind(this)
                }
            });
        },

        _navBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("main", {}, true);
            }
        },

        // Formatting Functions

        formatStatusState: function (sStatusCode) {
            switch (sStatusCode) {
                case "O":
                    return ValueState.Warning;
                case "C":
                    return ValueState.Success;
                case "P":
                    return ValueState.Success;
                case "U":
                    return ValueState.Error;
                default:
                    return ValueState.None;
            }
        },

        formatStatusIcon: function (sStatusCode) {
            switch (sStatusCode) {
                case "O":
                    return "sap-icon://pending";
                case "C":
                    return "sap-icon://accept";
                default:
                    return "";
            }
        },

        formatItemStatusState: function (sItemStatusCode) {
            switch (sItemStatusCode) {
                case "P":
                    return ValueState.Success; // Paid - Success (green)
                case "U":
                    return ValueState.Error;   // Unpaid - Error (red)
                default:
                    return ValueState.None;
            }
        },

        formatItemStatusIcon: function (sItemStatusCode) {
            switch (sItemStatusCode) {
                case "P":
                    return "sap-icon://accept";
                case "U":
                    return "sap-icon://decline";
                default:
                    return "";
            }
        },

    });
});