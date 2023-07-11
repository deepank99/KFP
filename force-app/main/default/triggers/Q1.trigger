trigger Q1 on Teacher__c (before insert, before update) {
for (Teacher__c t : Trigger.new) {
    if (t.Subject__c != null && t.Subject__c.equalsIgnoreCase('Hindi')){
        t.adderror('You cannot perform this operation. Teaching Hindi is not allowed');
    }

}
}