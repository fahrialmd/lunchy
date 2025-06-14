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
