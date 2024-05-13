import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ApiService } from 'src/services/api.service';
import { EventService } from '../../../../shared/EventService';
import { StorageService } from '../../../../shared/StorageService';

@Component({
  selector: 'add-reference-data',
  templateUrl: 'add-reference-data.page.html',
  styleUrls: ['add-reference-data.page.scss'],
})
export class AddReferenceDataPage implements OnInit {
  
  private subscription: any;
  private subscriptionParent: any;
  
  loadMsg = ''
  MinRaiseError: any  = ''
  dataAction: any = [];
  title: any = 'Add Reference Data'

  
  ReferenceTypeList = []
  LanguageList = []
  NewReferenceDataList:any = []

  from: any = 'home'
  type: any = 'add'
  titl: any = '';
  
  
  @ViewChild('CompanySelecter') ngSelectCompany: NgSelectComponent;
  
  constructor(public eventService: EventService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router) {

  }
  
  ngOnInit(){
    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
    this.getData('add');
  }
  onChange(event,item,pos){
    
  }
  getData(type) {
    this.subscription = this.apiService.getData('reference_value', type, '', undefined).subscribe(async response => {
      let res: any = response;
      // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        this.ReferenceTypeList = res.data.reference_type_list != undefined?res.data.reference_type_list:[];
        this.LanguageList = res.data.language_list != undefined?res.data.language_list:[];
      }
      this.addToList();
    });
  }
  
  
  
  
  
  async callAction(event) {
      if(event == 1) {
        if(this.NewReferenceDataList.length > 0) {
          this.publishReferenceData();
        } else {
          this.loadMsg = this.store.getVal('please_enter_reference_data')
        }
      } else if(event == 0) {
         const alert = await this.alertController.create({
          message: this.store.getVal('unsaved_changes'),
          animated: true,
          cssClass: 'alertCustomCssBtn',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.clearData()
                setTimeout(() => {
                  this.store.scrollTo('all_ui');
                }, 300);
                this.eventService.publishUpdateData({ segment: 'reference-data', reload: true });
                this.store.backPage();
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => { }
            }
          ], backdropDismiss: true
        });
        return await alert.present();
      }
  }
  
  customSelect(event,val,pos,isCall?){
    if(event.modalName !=undefined){
      this.NewReferenceDataList[pos][event.modalName] = event.modal  
    }
    if(event.modalName !=undefined && isCall){
      if (pos != undefined) {
        let ele = this.NewReferenceDataList[pos];
        if(ele.ReferenceType != undefined && ele.ReferenceType != '') {
            this.NewReferenceDataList[pos].IsReferenceTypeUn= false;
        }
        if(ele.ReferenceName != undefined && ele.ReferenceName.trim() != '') {
          this.NewReferenceDataList[pos].IsReferenceNameUn = false;
        }
        
        if(ele.DisplayOrder == undefined || ele.DisplayOrder == '') {
          this.NewReferenceDataList[pos].IsDisplayOrderUn = false;
        } else {
          if(!/^[0-9]+$/.test(ele.DisplayOrder)) {
          }else{
            this.NewReferenceDataList[pos].IsDisplayOrderUn = false;
          } 
        }
    
        if(ele.LanguageID != undefined && ele.LanguageID != '') {
          this.NewReferenceDataList[pos].IsLanguageUn = false;
        }
      }
      if(this.NewReferenceDataList[pos].ReferenceType !=undefined && this.NewReferenceDataList[pos].LanguageID !=undefined)
      this.subscriptionParent = this.apiService.getParentReferenceValueData(this.NewReferenceDataList[pos].ReferenceType ,this.NewReferenceDataList[pos].LanguageID).subscribe(async response => {
        let res: any = response;
        if (res.success && res.data != undefined) {
          this.NewReferenceDataList[pos].ParentReferenceKey=undefined
          this.NewReferenceDataList[pos].ParentTypeList=[]
          for (let k = 0; k < res.data.Parent_reference_list.length; k++) {
            this.NewReferenceDataList[pos].ParentTypeList = res.data.Parent_reference_list
          }
        }
      });
    }
}
  
  publishReferenceData() {    
    let isCall = false  
      let postData = new FormData();
      for (let i = 0; i < this.NewReferenceDataList.length; i++) {
        let ele = this.NewReferenceDataList[i];
        this.NewReferenceDataList[i].IsReferenceTypeUn = false;
        this.NewReferenceDataList[i].IsReferenceNameUn = false;
        this.NewReferenceDataList[i].IsDisplayOrderUn = false;
        this.NewReferenceDataList[i].IsLanguageUn = false;
      

        if(ele.ReferenceType == undefined || ele.ReferenceType == '') {
          ele.IsReferenceTypeUn = true;
          isCall = true
        }
        if(ele.ReferenceName == undefined || ele.ReferenceName.trim() == '') {
          ele.IsReferenceNameUn = true;
          isCall = true
        }
        
        if(ele.DisplayOrder == undefined || ele.DisplayOrder == '') {
        } else {
          if(!/^[0-9]+$/.test(ele.DisplayOrder)) {
            ele.IsDisplayOrderUn = true;
            isCall = true
          } 
        }
    
        if(ele.LanguageID == undefined || ele.LanguageID == '') {
          ele.IsLanguageUn = true;
          isCall = true
        }
      }
      if(isCall) {
       this.loadMsg = this.store.getVal('please_complete_required_field')
     } else {
      // for (let k = 0; k < this.NewReferenceDataList.length; k++) {
      //   delete this.NewReferenceDataList[k].ParentTypeList;
      // }
      postData.append("ReferenceDataJson", JSON.stringify(this.NewReferenceDataList));  
      this.apiService.addData('reference_value', postData, 'add').subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.clearData();
          this.store.showToast(res.message, 2000);
          this.store.backPage();
        } else {
          let ReferenceNames = '';
          if(res.data != undefined) {
            ReferenceNames = res.data.list.map(obj => obj.ReferenceName).join(',')
          }
          this.loadMsg = res.message;
          this.loadMsg += (ReferenceNames != undefined && ReferenceNames != '')?"<br> "+this.store.getVal('reference_name')+" : "+ReferenceNames:''
          setTimeout(() => {
            this.store.scrollTo('errorPage');
          }, 3000);
        }
      });   
    }
  }
  
  clearData() {
    this.clearError();
    this.NewReferenceDataList = [];
  }
  
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.subscriptionParent !=undefined)
    this.subscriptionParent.unsubscribe();
  }

  addToList() {
        this.NewReferenceDataList.push({
          ParentTypeList:[],
          ParentReferenceKey:undefined,
          ReferenceType:undefined,
          ReferenceName:'',
          OriginalValue:'',
          DisplayOrder:'',
          LanguageID:undefined
        });
  }

  clearError() {
    this.loadMsg = '';
  }


  async removeReferenceData(item,index) {
      const alert = await this.alertController.create({
        header: this.store.getVal('delete'),
        message: this.store.getVal('delete_confirmation'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('cancel'),
            role: 'cancel',
            handler: () => {
  
            }
          },
          {
            text: this.store.getVal('delete'),
            handler: () => {
              this.NewReferenceDataList.splice(index, 1);
              this.loadMsg=this.NewReferenceDataList.length<1?'':this.loadMsg
            }
          }
        ], backdropDismiss: true
      });
      return await alert.present();
  }

}
