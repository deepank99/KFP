import { LightningElement ,track, wire} from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    error =undefined;
    @track searchOptions;
    
    @wire(getBoatTypes, {boatTypeId : '$selectedboatTypeId'})
    boatTypes({data, error}) {
        if (data){
            this.searchOptions = data.map(type => {
                return {
                    value : type.Id,
                    label :type.Name,
                }
            });
            this.searchOptions.unshift({label :"All types", values : ''});
            
        }else if(error){
            this.searchOptions="undefined";
            this.error = error;
        }
    }
    handleSearchOptionChange(event){
        this.selectedBoatTypeId = event.detail.value;
        const searchEvent = new CustomEvent('search', {
            detail : {boatTypeId: this.selectedBoatTypeId}
        })
        this.dispatchEvent(searchEvent);


    }
}