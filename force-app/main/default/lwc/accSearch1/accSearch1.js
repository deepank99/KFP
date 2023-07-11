import { LightningElement, track ,} from 'lwc';
import getAccountfields from '@salesforce/apex/accountSearch1.getAccountfields';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccounts from '@salesforce/apex/accountSearch1.getAccounts';
//import getOperatorsFields from '@salesforce/apex/accountSearch1.getOperatorsFields';
//import getOperatorsFields from '@salesforce/apex/accountSearch1.getOperatorsFields';



const columns = [
  { label: 'Account Name', fieldName: 'Name', type: 'text' , sortable : true },
  { label: 'Billing City', fieldName: 'BillingCity', type: 'text' , sortable : true},
  { label: 'Billing State', fieldName: 'BillingState', type: 'text', sortable : true },
  { label: 'Billing Country', fieldName: 'BillingCountry', type: 'text' , sortable : true}
];
export default class FilterComponent extends LightningElement {
  @track fieldOptions = []; // Placeholder for field options
 // @track operatorOptions = []; // Placeholder for operator options
  @track filters = [{fieldname :"", operator :"", value: ""}]; // Placeholder for added filters
  @track filterValue = ''; // Placeholder for input field value
  @track isLoading = false;
  @track currentPage= 1;
  @track pageSize = 10;
  @track totalPages=1;
  @track sortBy;
  @track sortDirection;
  @track accounts = [];
  @track showResults = false;
 // @track fieldOpp= [];
  operatorOptions= [];
  columns=columns;

 

  connectedCallback() {
    getAccountfields()
            .then((dat) => {
                this.fieldOptions = dat;
            })
            .catch((errr) => {
                console.error(errr);
            });
           

    // Fetch operator options dynamically (replace with your logic to fetch from account object)
   
  }
  handleFieldNameChange(event) {
    const index = event.target.dataset.index;
    const selectedFieldName = event.target.value;
    let updatedFilters = [...this.filters]; // Copy the array to avoid mutating the original array
updatedFilters[index] = {
    ...updatedFilters[index],
    fieldName: selectedFieldName,
    operatorOptions: this.getFieldOptionsForField(selectedFieldName),
};
    this.filters = updatedFilters;
}

getFieldOptionsForField(fieldName) {

    const fieldOp = this.fieldOptions.find((option) => option.value === fieldName);
if (fieldOp) {
    const dataType = fieldOp.dataType;
    

console.log("dataType=>"+ dataType);
if (dataType === "STRING"  || dataType === "EMAIL" || dataType === "URL" ) {
    this.operatorOptions = [
    { label: "Equals", value: "=" },
    { label: "Not Equals to", value: "!=" },
    { label: "Contains", value: "LIKE" },
    { label: "Starts With", value: "STARTSWITH" },
    { label: "Ends With", value: "ENDSWITH" }
    ];
} else if (dataType === "BOOLEAN" || dataType === "PICKLIST" || dataType === "LOOKUP" || dataType === "MASTER DETAIL" || dataType === "CHECKBOX" || dataType === "ID" || dataType === "REFERENCE") {
    this.operatorOptions = [
    { label: "Equals", value: "=" },
    { label: "Not Equals to", value: "!=" }
    ];
} else if (dataType === "INTEGER" || dataType === "DOUBLE" || dataType === "CURRENCY" || dataType === "PERCENT=" || dataType === "DATE" || dataType === "DATETIME" || dataType === "PHONE" || dataType === "TEXTAREA") {
    this.operatorOptions = [
    { label: "Equals", value: "=" },
    { label: "Not Equals to", value: "!=" },
    { label: "Less than", value: "<" },
    { label: "Greater than", value: ">" },
    { label: "Less or equal", value: "<=" },
    { label: "Greater or equal", value: ">=" }
    ];
}
}

console.log('operatorOptions=> ' + JSON.stringify(this.operatorOptions));
return this.operatorOptions;


}

handleOperatorChange(event) {
const index = event.target.dataset.index;
let updatedFilters = this.filters;
updatedFilters[index].operator = event.target.value; 
this.filters = updatedFilters;

}


handleValueChange(event) {

    const index = event.target.dataset.index;
    let updatedFilters = this.filters;
    updatedFilters[index].value = event.target.value; 
    this.filters = updatedFilters;
    
   
}

addFilter() {
  let updatedFilters = JSON.parse(JSON.stringify(this.filters));
  updatedFilters.push({ fieldName: "", operator: "", value: "" });
  this.filters = updatedFilters;
}
get disableRemove() {
  return this.filters.length === 1 ;
}

handleDeleteFilter(event) {
  const index = event.currentTarget.dataset.index;
  let updatedFilters = JSON.parse(JSON.stringify(this.filters));
  updatedFilters.splice(index, 1);
  this.filters = updatedFilters;
}

  // eslint-disable-next-line consistent-return
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
    // eslint-disable-next-line no-undef
    getAccounts({filters : this.filters})
      .then(result => {
        this.accounts = result;
        let data = JSON.stringify(this.accounts);
        let dataa= JSON.parse(data);
        // eslint-disable-next-line eqeqeq
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
        this.fieldOptions = this.getAccountFieldsOptions();
        this.operatorOptions = this.getOperatorOptions();
  
        
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
      get operatorOption(){
    
        return this.operatorOptions;
    }

}