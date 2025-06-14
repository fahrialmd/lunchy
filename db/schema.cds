namespace com.fahrialmd.lunchy;

using {
                           managed,
                           cuid,
                           Currency,
    sap.common.CodeList as CodeList
} from '@sap/cds/common';

// Item Statuses
entity ItemStatuses : CodeList {
    key code : String(1) enum {
            Paid = 'P';
            Unpaid = 'U';
        } default 'U';
}

// Order Statuses
entity OrderStatuses : CodeList {
    key code : String(1) enum {
            Open = 'O';
            Close = 'C';
        } default 'O';
}

// Buyer Entity
entity Buyers : cuid, managed {
    buyerName    : String(100)          @title: 'Buyer Name';
    buyerEmpid   : String(20)           @title: 'Buyer Employee ID';
    buyerContact : String(20)           @title: 'Buyer Contact';
    isActive     : Boolean default true @title: 'Active';

    // Navigation to orders
    orders       : Association to many Orders
                       on orders.buyer = $self;
}

// Order Header Entity
entity Orders : cuid, managed {
    orderNumber      : String(10)                   @title: 'Order Number';
    buyer            : Association to Buyers;
    orderDate        : Date                         @title: 'Order Date';
    orderTime        : Time                         @title: 'Order Time';
    numberOfPeople   : Integer                      @title: 'Number of People';
    deliveryFee      : Integer                      @title: 'Delivery Fee'    @Semantics.amount.currencyCode: 'currency';
    discountPercent  : Decimal(5, 2)                @title: 'Discount %'      @assert.range                 : [
        0,
        100
    ];
    discountLimit    : Integer                      @title: 'Discount Limit'  @Semantics.amount.currencyCode: 'currency';
    extraCharges     : Integer                      @title: 'Extra Charges'   @Semantics.amount.currencyCode: 'currency';
    subtotal         : Integer                      @title: 'Subtotal'        @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    totalAmount      : Integer                      @title: 'Total Amount'    @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    currency         : Currency default 'IDR'       @title: 'Currency';
    status           : Association to OrderStatuses @title: 'Order Status';
    paymentMethod    : String(50)                   @title: 'Payment Method';
    gopayRecommended : Boolean                      @title: 'Gopay Recommended';

    // Navigation to order items
    items            : Composition of many OrderItems
                           on items.order = $self;
}

// Order Items Entity
entity OrderItems : cuid, managed {
    order            : Association to Orders;
    customerName     : String(100)                 @title: 'Customer Name';
    menuItemName     : String(100)                 @title: 'Menu Item';
    quantity         : Integer default 1           @title: 'Quantity';
    unitPrice        : Integer                     @title: 'Unit Price'         @Semantics.amount.currencyCode: 'currency';
    deliveryFee      : Integer                     @title: 'Item Delivery Fee'  @Semantics.amount.currencyCode: 'currency';
    discountPercent  : Decimal(5, 2)               @title: 'Item Discount %'    @assert.range                 : [
        0,
        100
    ];
    discountAmount   : Integer                     @title: 'Discount Amount'    @Semantics.amount.currencyCode: 'currency';
    overchargeAmount : Integer                     @title: 'Overcharge Amount'  @Semantics.amount.currencyCode: 'currency';
    itemTotal        : Integer                     @title: 'Item Total'         @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    itemStatus       : Association to ItemStatuses @title: 'Item Status';
    isConfirmed      : Boolean default false       @title: 'Confirmed';
    specialRequest   : String(200)                 @title: 'Special Requests';
    currency         : Currency default 'IDR'      @title: 'Currency';
}
