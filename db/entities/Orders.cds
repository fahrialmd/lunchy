namespace com.fahrialmd.lunchy;

using {
    managed,
    cuid,
    Currency
} from '@sap/cds/common';

using {com.fahrialmd.lunchy as lunchy} from '../index';

// Order Header Entity
entity Orders : cuid, managed {
    orderNumber      : String(10)                          @title: 'Order Number';
    description      : String(255)                         @title: 'Description';
    buyer            : Association to lunchy.Buyers;
    orderDate        : Date                                @title: 'Order Date';
    orderTime        : Time                                @title: 'Order Time';
    numberOfPeople   : Integer                             @title: 'Number of People';
    deliveryFee      : Integer                             @title: 'Delivery Fee'    @Semantics.amount.currencyCode: 'currency';
    discountPercent  : Decimal(5, 2)                       @title: 'Discount %'      @assert.range                 : [
        0,
        100
    ];
    discountLimit    : Integer                             @title: 'Discount Limit'  @Semantics.amount.currencyCode: 'currency';
    extraCharges     : Integer                             @title: 'Extra Charges'   @Semantics.amount.currencyCode: 'currency';
    subtotal         : Integer                             @title: 'Subtotal'        @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    totalAmount      : Integer                             @title: 'Total Amount'    @Core.Computed  @Semantics.amount.currencyCode: 'currency';
    currency         : Currency default 'IDR'              @title: 'Currency';
    status           : Association to lunchy.OrderStatuses @title: 'Order Status';
    paymentMethod    : String(50)                          @title: 'Payment Method';
    gopayRecommended : Boolean                             @title: 'Gopay Recommended';

    // Navigation to order items
    items            : Composition of many lunchy.OrderItems
                           on items.order = $self;
}
