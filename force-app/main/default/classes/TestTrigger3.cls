@isTest
private class TestTrigger3{
    @isTest static void myTestTrigger3{
        Class__c cs = new  Class__c(Maxlimits__c = 2);
        insert cs;
        Student__c st1 = new Student__c(Class__c = cs.Id);
        Student__c st2 = new Student__c(Class__c = cs.Id);
        Student__c st3 = new Student__c(Class__c = cs.Id);

        List<Student__c> students = new List<Student__c>;
            students.add(st1);
            students.add(st2);
            students.add(st3);
            insert students;

            st1.Class__c = null;
            st2.Class__c = cs.Id;
            st3.Class__c = cs.Id;
            update students;

            st3= [Select Id, Class__c, class__r.Maxlimits__c FROM Student__c WHERE ID =: st3.Id];
            System.assertEquals('Cannot insert students.Class has reached its maximum limit' , st3.Errors__c);
    }

}