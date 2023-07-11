@isTest
private class TestTrigger1{
    @isTest
    static void testTeacherNotAllowedToTeachHindi() {
        Teacher__c teacher = new Teacher__c(Name = 'John Doe', Subject__c = 'Hindi');
        System.Test.startTest();
        try {
            insert teacher;
            System.assert(false, 'Exception should have been thrown');
        } catch (DmlException ex){
            System.assertEquals('Teachers are not allowed to Teach Hindi', ex.getDmlMessage(0), 'Incorrect Error Message');
        }
        System.Test.stopTest();
        teacher.Subject__c = 'English';
        System.Test.startTest();
        try{
            update teacher;
            System.assert(false , 'Exception should have been thrown');
        } catch (DmlException ex){
            System.assertEquals('Teachers are not allowed to Teach Hindi', ex.getDmlMessage(0), 'Incorrect Error Message');
        }
        System.Test.stopTest();
        }
        }
    