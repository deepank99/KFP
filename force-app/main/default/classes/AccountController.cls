public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String billingCity, String billingState, String billingCountry) {
      String query = 'SELECT Name, BillingCity, BillingState, BillingCountry FROM Account';
  
      if (String.isNotBlank(billingCity)) {
        query += ' WHERE BillingCity = \'' + String.escapeSingleQuotes(billingCity) + '\'';
      }
      if (String.isNotBlank(billingState)) {
        if (String.isNotBlank(billingCity)) {
          query += ' AND';
        } else {
          query += ' WHERE';
        }
        query += ' BillingState = \'' + String.escapeSingleQuotes(billingState) + '\'';
      }
      if (String.isNotBlank(billingCountry)) {
        if (String.isNotBlank(billingCity) || String.isNotBlank(billingState)) {
          query += ' AND';
        } else {
          query += ' WHERE';
        }
        query += ' BillingCountry = \'' + String.escapeSingleQuotes(billingCountry) + '\'';
      }
  
      query += ' LIMIT 100';
  
      return Database.query(query);
    }
  }
  