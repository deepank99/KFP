trigger Trigger2 on Class__c (before delete) {
    Set<Id> classIds = new Set<Id>();
    for (Class__c cls : Trigger.old) {
        classIds.add(cls.Id);
    }
    Map<Id, Class__c> classesWithStudents = new Map<Id, Class__c>([
        SELECT Id, (SELECT Id, Gender__c FROM Students__r WHERE Gender__c = 'Female') 
        FROM Class__c 
        WHERE Id IN :classIds
    ]);
    for (Class__c cls : Trigger.old) {
        if (classesWithStudents.containsKey(cls.Id)) {
            List<Student__c> femaleStudents = classesWithStudents.get(cls.Id).Students__r;
            if (femaleStudents.size() > 1) {
                cls.addError('Cannot delete class with more than one female student.');
            }
        }
    }
}
