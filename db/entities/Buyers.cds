namespace com.fahrialmd.lunchy;

using {
    managed,
    cuid
} from '@sap/cds/common';

using {com.fahrialmd.lunchy as lunchy} from '../index';

// Buyer Entity
entity Buyers : cuid, managed {
    buyerName    : String(100);
    buyerEmpid   : String(20);
    buyerContact : String(20);
    isActive     : Boolean default true;

    // Navigation to orders
    orders       : Association to many lunchy.Orders
                       on orders.buyer = $self;
}
