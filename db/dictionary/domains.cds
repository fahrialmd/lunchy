namespace com.fahrialmd.lunchy;

using {sap.common.CodeList as CodeList} from '@sap/cds/common';

// Item Status CodeList
entity ItemStatuses : CodeList {
    key code : String(1) enum {
            Paid = 'P';
            Unpaid = 'U';
        } default 'U';
}

// Order Status CodeList
entity OrderStatuses : CodeList {
    key code : String(1) enum {
            Open = 'O';
            Close = 'C';
        } default 'O';
}

// Payment Method Type CodeList
entity PaymentMethodTypes : CodeList {
    key code : String(10) enum {
            Bank = 'B';
            EWallet = 'E';
        };
}
