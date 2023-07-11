@isTest
private class TestDay3 {
    @isTest 
     static void myTestDay3(){
        Student__c s1 = new Student__c(Name = 'Deepaaa');
        Student__c s2 = new Student__c(Name = 'Binny');

        insert s1;
        insert s2;
}


    }
