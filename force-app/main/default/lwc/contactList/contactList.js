import { LightningElement , wire} from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
import FIRST_NAME from '@salesforce/schema/Contact.FirstName';
import LAST_NAME from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import getContacts from '@salesforce/apex/ContactController.getContacts';
const COLUMNS = [
    { label: 'FIRST NAME', fieldName: FIRST_NAME.fieldApiName, type: 'text' },
    { label: 'LAST NAME', fieldName: LAST_NAME.fieldApiName, type: 'text' },
    { label: 'EMAIL', fieldName: EMAIL.fieldApiName, type: 'email' },
];

export default class ContactList extends LightningElement {
    columns= COLUMNS;
    @wire (getContacts)
    contacts;
    get errors() {
        return (this.contacts.error) ?
            reduceErrors(this.contacts.error) : [];
    }
}