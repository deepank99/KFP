@isTest
private class TestQ1{
    @isTest static void TestT(){
        Teacher__c t1= new Teacher__c();
        t1.name = 'Teacher 1';
        t1.Subject__c = 'Match';
        Teacher__c t2= new Teacher__c();
        t2.name = 'Teacher 2';
        t2.Subject__c = 'Hindi';
        Teacher__c t3= new Teacher__c();
        t3.name = 'Teacher 3';
        t3.Subject__c = 'Science';
        List<Teacher__c> teachers = new List<Teacher__c>();
        teachers.add(t1);
        teachers.add(t2);
        teachers.add(t3);

        Test.startTest();
        insert teachers;
        Test.stopTest();

        System.assertEquals(true, t1.Id != null, 'Teacher 1 should be inserted');
        System.assertEquals(true, t2.Id == null, 'Teacher 2 should not be inserted');
        System.assertEquals(true, t3.Id != null, 'Teacher 3 should not be inserted');
        System.assertEquals('You cannot perform this operation.Teaching Hindi is not allowed',t2.Trigger_Error__c,'Error message should be added to teacher 2');
    }
}