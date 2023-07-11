trigger Trigger4 on Student__c (after insert, after update) {
    Set<Id> classIds = new Set<Id>();
    for (Student__c student : Trigger.new) {
        classIds.add(student.Class__c);
    }

    List<Class__c> classesToUpdate = [SELECT Id, MyCount__c, (SELECT Id FROM Students__r) FROM Class__c WHERE Id IN :classIds];

    List<Class__c> classesToUpdateWithCount = new List<Class__c>();
    for (Class__c classObj : classesToUpdate) {
        classObj.MyCount__c = classObj.Students__r.size();
        classesToUpdateWithCount.add(classObj);
    }
    update classesToUpdateWithCount;
}
