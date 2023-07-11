trigger Trigger3 on Student__c (before insert) {
        Set<Id> classIds = new Set<ID>();
        for (Student__c student : Trigger.new) {
            if (student.Class__c != null) {
                classIds.add(student.Class__c);
            }
        }

        Map<Id, Class__c> classesWithStudents = new Map<Id, Class__c>(
            [Select Id, Maxlimits__c , (Select Id FROM Students__r)
            FROM Class__c
            WHERE Id IN :classIds ]
        );

        for (Student__c student :Trigger.new) {
            if (student.Class__c !=null && classesWithStudents.containsKey(student.Class__c)) {
                Class__c cls= classesWithStudents.get(Student.Class__c);
                if (cls.Students__r.size() >= cls.Maxlimits__c) {
                    student.addError('Cannot insert Student. Class has reached its maximum limit');
                } 
            }
        }
}