import { getRecord } from 'lightning/uiRecordApi';
import { LightningElement,api,wire } from 'lwc';
import CLASS_OBJECT from '@salesforce/schema/CLass__c';
import NAME_FIELD from '@salesforce/schema/Class__c.Name';
import BOARD_FIELD from '@salesforce/schema/Class__c.Board__c';
import FEE_FIELD from '@salesforce/schema/Class__c.Fee__c';
import Id from '@salesforce/schema/Account.Id';
export default class ClassLightning extends LightningElement {
    @api record;
    class;
    err;
    @wire(getRecord,{record : '$record', fields: [NAME_FIELD, BOARD_FIELD, FEE_FIELD ], layoutTypes :['Full']})
    wiredClass ({err, data}){
        if(data){
            this.class = {
            Id : this.record,
            Name: data.fields.Name.value,
            Board: data.fields.Board__c.value,
            Fee: data.fields.Fee__c.value,


        };
        this.err = undefined;
    } else if (err){
        this.err = err;
        this.class = undefined;
    }
}
}