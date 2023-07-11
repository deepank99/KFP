/* eslint-disable eqeqeq */
import { LightningElement, track, } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountController.searchAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';




const columns = [
  { label: 'Account Name', fieldName: 'Name', type: 'text' , sortable : true },
  { label: 'Billing City', fieldName: 'BillingCity', type: 'text' , sortable : true},
  { label: 'Billing State', fieldName: 'BillingState', type: 'text', sortable : true },
  { label: 'Billing Country', fieldName: 'BillingCountry', type: 'text' , sortable : true}
];

export default class SearchAccounts extends LightningElement {
  @track billingCity = '';
  @track billingState = '';
  @track billingCountry = '';
  @track accounts = [];
  @track showResults = false;
  columns = columns;
  @track isLoading = false;
  @track currentPage= 1;
  @track pageSize = 10;
  @track totalPages=1;
  @track errr= false;
  @track sortBy;
  @track sortDirection;


  handleCityChange(event) {
    this.billingCity = event.target.value;
  }

  handleStateChange(event) {
    this.billingState = event.target.value;
  }

  handleCountryChange(event) {
    this.billingCountry = event.target.value;
  }

  handleSearch(event) {

    //Code required for validate field in button search
    const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
        .reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if (!isInputsCorrect) {
            return false; 
        }
    this.isLoading= true;
    searchAccounts({ 
      billingCity: this.billingCity, 
      billingState: this.billingState, 
      billingCountry: this.billingCountry 
    })
      .then(result => {
        this.accounts = result;
        let data = JSON.stringify(this.accounts);
        let dataa= JSON.parse(data);
        if (this.accounts == 0){
          const evet = new ShowToastEvent({
            title: 'ERROR',
            message:  'There are no records available for the given input.',
            variant : ' ERROR',
        });
        this.dispatchEvent(evet);
          
        }
        
        
        console.log(dataa.length, '<<<this.accounts>>', this.accounts);
        
        this.showResults = dataa.length > 0 ;
        
        this.isLoading= false;
        this.totalPages= Math.ceil(result.length / this.pageSize);
        
      })
      .catch(error => {
        this.isLoading = true;
        console.error('Error fetching accounts:', error);
        this.error=event.detail;
        this.errr= true;
        this.isLoading=false;
      });
     
}
        handlePrevious(){ 
          if(this.currentPage>1){
            this.currentPage --;
            console.log('Handling previous button' + this.handlePrevious);
          }
        }
        handleNext(){
          if(this.currentPage<this.totalPages){
            this.currentPage ++;
          }
        }
        handleFirst(){
          this.currentPage=1;
        }
        handleLast(){
          this.currentPage= this.totalPages;
        }
        get displayedAccounts(){
          const start = (this.currentPage - 1) * this.pageSize;
          const end= start + this.pageSize;
          return this.accounts.slice(start, end);
        }
        get bDisableFirst(){
          return this.currentPage ===1;
        }
        get bDisableLast(){
          return this.currentPage ===this.totalPages;
        }
     
        
       
        doSorting(event) {
          this.sortBy = event.detail.fieldName;
          this.sortDirection = event.detail.sortDirection;
          this.sortData(this.sortBy, this.sortDirection);
      }

     
      sortData(fieldname, direction) {
          let parseData = JSON.parse(JSON.stringify(this.accounts));
          // Return the value stored in the field
          let keyValue = (a) => {
              return a[fieldname];
          };
          // cheking reverse direction
          let isReverse = direction === 'asc' ? 1: -1;
          // sorting data
          parseData.sort((x, y) => {
              x = keyValue(x) ? keyValue(x) : ''; // handling null values
              y = keyValue(y) ? keyValue(y) : '';
              // sorting values based on direction
              return isReverse * ((x > y) - (y > x));
          });
          this.accounts = parseData;
          
      }    
    }