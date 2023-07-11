import { LightningElement ,api,wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import STUDENT_OBJECT from '@salesforce/schema/Student__c';
import NAME_FIELD from '@salesforce/schema/Student__c.name';
import EMAIL_FIELD from '@salesforce/schema/Student__c.email__c';
import AGE_FIELD from '@salesforce/schema/Student__c.age__c';
import DOB_FIELD from '@salesforce/schema/Student__c.DOB__c';
import SEX_FIELD from '@salesforce/schema/Student__c.Sex__c';


export default class StudentLightning extends LightningElement {
    @api recordID;
    student = true;
    error;
@wire(getRecord,{recordID: '$recordID' ,fields: [NAME_FIELD, EMAIL_FIELD, AGE_FIELD, DOB_FIELD, SEX_FIELD], layoutTypes: ['Full'] })
wiredStudent({ error, data }) {
    if (data) {
      this.student = {
        Id: this.recordId,
        Name: data.fields.Name.value,
        Email__c: data.fields.Email__c.value,
        Age__c: data.fields.Age__c.value,
        Sex__c: data.fields.Sex__c.value,
        DOB__c: data.fields.DOB__c.value,
      };
      this.error = undefined;
    } else if (error) {
        this.error = error;
        this.student = undefined;
      }
      }
      }
