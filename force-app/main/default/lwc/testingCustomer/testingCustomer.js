import { LightningElement, track,wire,api } from 'lwc';
import SignUpPage from './articles.html.html';
import articleTable from './articleTable.html';
import newsletter from './newsletter.html';
import getArticleList from '@salesforce/apex/ArticleClass.getArticleList';
import userLoginPage from './testingCustomer.html';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';


const columns = [
    {
        label: 'Article Media Type',
        fieldName: 'Article_Media_Type__c',
        type: 'Picklist',
        editable: true,
        sortable: true,
    }, {
        label: 'Media Impact Score',
        fieldName: 'Media_Impact_Score__c',
        type: 'Number',
        editable: true,
        sortable: true,
    }, {
        label: 'Published Date',
        fieldName: 'Published_Date__c',
        type: 'Date',
        editable: true,
        sortable: true,
    },  {
        label: 'Related Tweets',
        fieldName: 'Related_Tweets__c',
        type: 'Number',
        sortable: true,
        editable: true
    }
    
];
export default class TestingCustomer extends LightningElement {

page = null;
render(){

return this.page ===  'Add Articles' ? SignUpPage :
 this.page === 'View Articles' ? articleTable : 
 this.page === 'Newsletters' ? newsletter :
  userLoginPage ;

}
handleHomeClick(event){

  this.page = event.target.label;
 
}
    modeName ='Edit';
  


     handleSubmit(event){
            // stop the form from submitting
        const fields = event.detail.fields;
        fields.Name = 'Tushar Sharma'; // modify a field
        console.log('fields', fields);
        console.log('fields 2', fields.Name);
        this.template.querySelector('lightning-record-form').submit(fields);
     }

     handleSuccess(event) {
        console.log('fields');
        const evt = new ShowToastEvent({
            title: "Account updated",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }
    
         columns = columns;
    @track accObj;
    fldsItemValues = [];
    @track sortBy;
    @track sortDirection;
 
    @wire(getArticleList)
    cons(result) {
        this.accObj = result;
        if (result.error) {
            this.accObj = undefined;
        }
    };
 
    saveHandleAction(event) {
        this.fldsItemValues = event.detail.draftValues;
        const inputsItems = this.fldsItemValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
       
        const promises = inputsItems.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Records Updated Successfully!!',
                    variant: 'success'
                })
            );
            this.fldsItemValues = [];
            return this.refresh();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'An Error Occured!!',
                    variant: 'error'
                })
            );
        }).finally(() => {
            this.fldsItemValues = [];
        });
    }
 
   
    async refresh() {
        await refreshApex(this.accObj);
    }

    handleSortAccountData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortAccountData(event.detail.fieldName, event.detail.sortDirection);
    }


    sortAccountData(fieldname, direction) {
        
        let parseData = JSON.parse(JSON.stringify(this.accObj.data));
       
        let keyValue = (a) => {
            return a[fieldname];
        };


       let isReverse = direction === 'asc' ? 1: -1;


           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';
           
            return isReverse * ((x > y) - (y > x));
        });
        
        this.accObj.data = parseData;


    }
  handleSubmitarticle(event){
         
      const fieldsarticle = event.detail.fields;
      console.log('Fields -->',fieldsarticle);
      this.template.querySelector('lightning-record-edit-form').submit(fieldsarticle);
   }

   handleSuccessarticle(event) {
          
         const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record is Created successfully',
            variant: 'success'
         });
         this.dispatchEvent(evt);
   }

    //=========================================================================
 handleSubmit(event){
         
      const fields = event.detail.fields;
      console.log('Fields -->',fields);
      this.template.querySelector('lightning-record-edit-form').submit(fields);
   }

   handleSuccess(event) {
          this.openoutlet = false;
         const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record is Created successfully',
            variant: 'success'
         });
         this.dispatchEvent(evt);
   }
handleSuccessnews(event) {
        
         const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record is Created successfully',
            variant: 'success'
         });
         this.dispatchEvent(evt);
   }
   handleSubmitnews(event){
         
      const fieldsnews = event.detail.fields;
      console.log('Fields -->',fieldsnews);
      this.template.querySelector('lightning-record-edit-form').submit(fieldsnews);
   }
   @track openoutlet = false;

openoutlethandler() { 
    this.openoutlet = true;
    
}
cancelopenoutlethandler() {
    this.openoutlet = false;

}

  @track opencontact = false;

opencontacthandler() { 
    this.opencontact = true;
    
}
cancelopencontacthandler() {
    this.opencontact = false;

}
}