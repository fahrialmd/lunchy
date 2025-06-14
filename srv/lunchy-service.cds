using {com.fahrialmd.lunchy as lunchy} from '../db/';

namespace com.fahrialmd.lunchy.service;

@path: '/odata/v4/lunchy'
service LunchyService {

    // Main entities
    entity Orders        as projection on lunchy.Orders;
    entity OrderItems    as projection on lunchy.OrderItems;
    entity Buyers        as projection on lunchy.Buyers;

    // Code lists
    @readonly
    entity ItemStatuses  as projection on lunchy.ItemStatuses;

    @readonly
    entity OrderStatuses as projection on lunchy.OrderStatuses;
}
