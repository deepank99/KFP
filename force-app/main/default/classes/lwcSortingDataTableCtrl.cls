public with sharing class lwcSortingDataTableCtrl {
    @AuraEnabled(Cacheable = true)
    public static List<Account> sortAccountItem(String billingCity, String billingState, String billingCountry) {
        String query = 'SELECT Name, BillingCity, BillingState, BillingCountry FROM Account';
        String orderByClause = '';
    
        if (billingCity != null) {
            orderByClause += 'BillingCity ';
        }
    
        if (billingState != null) {
            if (orderByClause != '') {
                orderByClause += ', ';
            }
            orderByClause += 'BillingState ';
        }
    
        if (billingCountry != null) {
            if (orderByClause != '') {
                orderByClause += ', ';
            }
            orderByClause += 'BillingCountry ';
        }
    
        if (orderByClause != '') {
            query += ' ORDER BY ' + orderByClause;
        }
    
        return Database.query(query);
    }
    
}