sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, MessageBox, History) {
    "use strict";

    return Controller.extend("foodorderadmin.controller.OrderItems", {

        onInit: function () {
            // Get router and attach route matched event
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oModel = this.getOwnerComponent().getModel();

            this._oRouter.getRoute("orderItems").attachPatternMatched(this._onRouteMatched, this);
        },

        /* =========================================================== */
        /* Route Handling                                             */
        /* =========================================================== */

        _onRouteMatched: function (oEvent) {
            const sOrderId = oEvent.getParameter("arguments").orderId;
            console.log("Route matched with order ID:", sOrderId);

            this._bindView(sOrderId);
        },

        _bindView: function (sOrderId) {
            // Create binding path for the order
            const sObjectPath = `/Orders('${sOrderId}')`;

            console.log("Binding view to:", sObjectPath);

            // Bind the view to the order with expanded associations
            this.getView().bindElement({
                path: sObjectPath,
                parameters: {
                    expand: "buyer,status,items,items/itemStatus"
                },
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        _onBindingChange: function () {
            const oView = this.getView();
            const oElementBinding = oView.getElementBinding();

            // Check if data exists
            if (oElementBinding && !oElementBinding.getBoundContext()) {
                this._oRouter.getTargets().display("notFound");
                return;
            }

            // Update page title
            const oContext = oElementBinding.getBoundContext();
            if (oContext) {
                const sOrderNumber = oContext.getProperty("orderNumber");
                const sTitle = `Order ${sOrderNumber}`;

                // Update browser title if needed
                document.title = sTitle;

                console.log("Order loaded successfully:", sOrderNumber);
            }
        },

        /* =========================================================== */
        /* Event Handlers                                             */
        /* =========================================================== */

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                // Go back to previous page
                window.history.go(-1);
            } else {
                // Navigate to main view
                this._oRouter.navTo("main", {}, true);
            }
        },

        onEditOrder: function () {
            const oContext = this.getView().getBindingContext();
            const sOrderNumber = oContext.getProperty("orderNumber");

            MessageToast.show(`Edit order: ${sOrderNumber}`);

            // TODO: Implement edit functionality
            // You can:
            // 1. Navigate to edit view
            // 2. Open edit dialog
            // 3. Enable inline editing
        },

        onSaveOrder: function () {
            const oContext = this.getView().getBindingContext();
            const sOrderNumber = oContext.getProperty("orderNumber");

            MessageBox.confirm(
                `Save changes to order ${sOrderNumber}?`,
                {
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            // TODO: Implement save logic
                            this._saveOrder();
                        }
                    }.bind(this)
                }
            );
        },

        _saveOrder: function () {
            // Submit changes to backend
            this._oModel.submitChanges({
                success: function () {
                    MessageToast.show("Order saved successfully");
                },
                error: function (oError) {
                    MessageBox.error("Error saving order: " + oError.message);
                }
            });
        },

        onExportOrder: function () {
            const oContext = this.getView().getBindingContext();
            const sOrderNumber = oContext.getProperty("orderNumber");

            MessageToast.show(`Export order: ${sOrderNumber}`);

            // TODO: Implement export functionality
        },

        onPrintOrder: function () {
            const oContext = this.getView().getBindingContext();
            const sOrderNumber = oContext.getProperty("orderNumber");

            MessageToast.show(`Print order: ${sOrderNumber}`);

            // TODO: Implement print functionality
            // window.print(); // Simple browser print
        },

        /* =========================================================== */
        /* Order Items Event Handlers                                 */
        /* =========================================================== */

        onAddItem: function () {
            const oContext = this.getView().getBindingContext();
            const sOrderNumber = oContext.getProperty("orderNumber");

            MessageToast.show(`Add item to order: ${sOrderNumber}`);

            // TODO: Open add item dialog
        },

        onEditItem: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sCustomerName = oContext.getProperty("customerName");
            const sMenuItem = oContext.getProperty("menuItemName");

            MessageToast.show(`Edit item: ${sMenuItem} for ${sCustomerName}`);

            // TODO: Open edit item dialog
        },

        onDeleteItem: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sCustomerName = oContext.getProperty("customerName");
            const sMenuItem = oContext.getProperty("menuItemName");

            MessageBox.confirm(
                `Delete item "${sMenuItem}" for ${sCustomerName}?`,
                {
                    onClose: function (sAction) {
                        if (sAction === MessageBox.Action.OK) {
                            this._deleteItem(oContext);
                        }
                    }.bind(this)
                }
            );
        },

        _deleteItem: function (oContext) {
            // Delete the item
            this._oModel.remove(oContext.getPath(), {
                success: function () {
                    MessageToast.show("Item deleted successfully");
                },
                error: function (oError) {
                    MessageBox.error("Error deleting item: " + oError.message);
                }
            });
        },

        /* =========================================================== */
        /* Formatters                                                  */
        /* =========================================================== */

        formatStatusState: function (sStatusCode) {
            switch (sStatusCode) {
                case "O": return "Warning";
                case "C": return "Success";
                default: return "None";
            }
        },

        formatStatusIcon: function (sStatusCode) {
            switch (sStatusCode) {
                case "O": return "sap-icon://pending";
                case "C": return "sap-icon://accept";
                default: return "sap-icon://question-mark";
            }
        },

        formatAmountState: function (iAmount) {
            if (!iAmount) return "None";
            if (iAmount > 2000000) return "Error";
            if (iAmount > 1000000) return "Warning";
            return "Success";
        },

        formatItemStatusState: function (sStatusCode) {
            switch (sStatusCode) {
                case "P": return "Success"; // Paid
                case "U": return "Warning"; // Unpaid
                default: return "None";
            }
        },

        formatBoolean: function (bValue) {
            return bValue ? "Yes" : "No";
        },

        isOrderEditable: function (sStatusCode) {
            return sStatusCode === "O"; // Only open orders are editable
        },

        hasValue: function (sValue) {
            return !!sValue && sValue.trim().length > 0;
        }
    });
});