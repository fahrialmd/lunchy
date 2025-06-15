namespace com.fahrialmd.lunchy;

using {
    managed,
    cuid
} from '@sap/cds/common';

using {com.fahrialmd.lunchy as lunchy} from '../index';

// Payment Methods Entity (Child of Buyer)
entity PaymentMethods : cuid, managed {
    buyer         : Association to lunchy.Buyers             @title: 'Buyer';
    paymentMethod : Association to lunchy.PaymentMethodTypes @title: 'Payment Method Type';
    paymentName   : String(50)                               @title: 'Payment Name'; // BRI, BCA, GOPAY, etc.
    accountNumber : String(100)                              @title: 'Account Number';
    isActive      : Boolean default true                     @title: 'Is Active';
    isPrimary     : Boolean default false                    @title: 'Is Primary Payment';
}
