namespace com.fahrialmd.lunchy;

using {
    managed,
    cuid,
    Currency
} from '@sap/cds/common';

using {com.fahrialmd.lunchy as lunchy} from '../index';

// Order Items Entity
entity OrderItems : cuid, managed {
    order            : Association to lunchy.Orders;
    customerName     : String(100)                        @title: 'Customer Name';
    menuItemName     : String(100)                        @title: 'Menu Item';
    quantity         : Integer default 1                  @title: 'Quantity';
    unitPrice        : Integer                            @title: 'Unit Price'         @Semantics.amount.currencyCode: 'currency';
    deliveryFee      : Integer                            @title: 'Item Delivery Fee'  @Semantics.amount.currencyCode: 'currency';
    discountPercent  : Decimal(5, 2)                      @title: 'Item Discount %'    @assert.range                 : [
        0,
        100
    ];
    discountAmount   : Integer                            @title: 'Discount Amount'    @Semantics.amount.currencyCode: 'currency';
    overchargeAmount : Integer                            @title: 'Overcharge Amount'  @Semantics.amount.currencyCode: 'currency';
    itemTotal        : Integer                            @title: 'Item Total'         @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    itemStatus       : Association to lunchy.ItemStatuses @title: 'Item Status';
    isConfirmed      : Boolean default false              @title: 'Confirmed';
    specialRequest   : String(200)                        @title: 'Special Requests';
    currency         : Currency default 'IDR'             @title: 'Currency';
}
