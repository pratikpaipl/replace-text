import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'data-setup-items',
  templateUrl: './data-setup-items.component.html',
  styleUrls: ['./data-setup-items.component.scss'],
})
export class DataSetupItemComponent implements OnInit, OnDestroy {

  @Input()
  apiEnd: any = ''

  @Input()
  EnablerSlug: any = ''
  @Input()
  ActionType: any = ''
  @Input()
  type: string = '';
  @Input()
  pageType: string = '';
  @Input()
  pageFrom: string = '';
  @Input()
  from: string = '';
  @Input()
  addImpactThemes: any= false;
  
  ImpactThemeArealist: any = [];
  ImpactAreaList: any = [];
  NewImpactAreaList: any = [];
  

  isShowMsg = false;
  IsImpactThemeAreaUn:any = false;
  IsImpactAreaUn:any = false;

  loadMsg: any = '';
  ImpactTheme: any = '';
  selectedImpactTheme: any;
  selectedImpactThemeOld: any;  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor( public store: StorageService, private eventService: EventService, public apiService: ApiService, public alertController: AlertController,) {
    
  }
  callApi() {
    this.getDataSetupList(false, "");
  }
  ngOnInit() {   
    setTimeout(() => {
      this.callApi();
    }, this.store.isApiCalled);
  }
  ngOnDestroy() {
    
  }
  ngOnChanges() {

  }
  async onFocusSelect(select){
    if(!select.isOpen){
     await select.filter('')
    }
  }
  async filter(event,select){    
    if(select.isOpen){
      await select.filter(event.target.value)
      // this.checkUpdate(select)
    }else{
      select.filter('')
    }
  }
  getDataSetupList(isFirstLoad, event) {
    let param = "?EnablerSlug="+this.EnablerSlug+"&PageType="+this.type+"_data_setup"
    this.apiService.getDataSetupList(this.apiEnd,param).subscribe(response => {
      let res = response
      if (res.success && res.data != undefined) {
          this.ImpactThemeArealist =  res.data.impact_themes_list
      } 
    });
  }




  submit(event) {
    if(event == 1) {
      let isCall = false;
      this.IsImpactThemeAreaUn = false;
      this.loadMsg = '';
      if(this.selectedImpactTheme == undefined || this.selectedImpactTheme == '') {
        this.IsImpactThemeAreaUn = true;
        this.store.scrollTo('impact_theme_list');
        isCall = true
      } 
      
      let msg='';
      
      for (let i = 0; i < this.NewImpactAreaList.length; i++) {
        let ele = this.NewImpactAreaList[i];
        this.NewImpactAreaList[i].error = this.NewImpactAreaList[i].error?this.NewImpactAreaList[i].error:false;       
        if(ele.ImpactThemeName == undefined || ele.ImpactThemeName == '' || ele.error) {
          ele.error = true;
          isCall = true
          msg=this.store.getVal('please_complete_required_field');
        }
      }    
      if(this.ImpactAreaList.length ==0 && this.NewImpactAreaList.length ==0 ){
        isCall = true
        msg = msg ==''?this.store.getVal('data_setup_areas_required'):msg;
      }
      if(this.NewImpactAreaList.length ==0){
        isCall = true
        msg = this.store.getVal('data_setup_areas_required');
      }

      if(isCall) {
        this.loadMsg = msg //this.store.getVal('please_complete_required_field');
      } else {
        let postData = new FormData();

        let selPrimery=''
        let selPrimeryName=''
        for (let i = 0; i < this.ImpactThemeArealist.length; i++) {
          const element = this.ImpactThemeArealist[i];
          if(element.ReferenceKey == this.selectedImpactTheme){
            selPrimery = element.ReferenceKey;
            selPrimeryName = element.ReferenceName;
          }
        }

        let check = this.ImpactThemeArealist.findIndex(c => c.ReferenceKey == this.selectedImpactTheme)
        if(check == -1){
          selPrimery=''
          selPrimeryName=this.selectedImpactTheme
        }
        postData.append("ParentImpactThemeKey", selPrimery);
        postData.append("ParentImpactThemeName",selPrimeryName);
        postData.append("ImpactThemeJson", this.NewImpactAreaList.length>0?JSON.stringify(this.NewImpactAreaList):'');
        postData.append("EnablerSlug", this.EnablerSlug);
        postData.append("PageType", this.type+"_data_setup");
      

        this.apiService.updateDataSetup(postData).subscribe(response => {
          let res = response
          if (res.success) {
            this.ImpactAreaList = [];
            this.NewImpactAreaList = [];
            this.selectedImpactTheme = undefined
            this.selectedImpactThemeOld = undefined
            this.IsImpactThemeAreaUn = false;
            this.IsImpactAreaUn = false;
            this.store.showToast(res.message, 4000);
            if(check == -1){
              this.getDataSetupList(false, "");
            }
          } 
        });
      } 
    } else if(event == 0) {
      this.loadMsg = '';
      this.IsImpactThemeAreaUn = false;
      this.selectedImpactTheme = undefined
      this.NewImpactAreaList = []
      this.ImpactAreaList = []
    }
    
  }

  addNewTags = (term) => ({ ReferenceKey: term, ReferenceName: term });


  async customSelect(event,isCheck?){
    if(event.modalName !=undefined){
      if(this.selectedImpactThemeOld != undefined && this.selectedImpactThemeOld != '') {
        const alert = await this.alertController.create({
          message: 'If you change theme before saving, your changes will be lost.',
          animated: true,
          cssClass: 'alertCustomCssBtn',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                // this['' + event.modalName] = event.modal
                this.selectedImpactThemeOld = event.modal //this.selectedImpactTheme
                this.changeImpactAreaList(event)
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                this.selectedImpactTheme = this.selectedImpactThemeOld
              }
            }
          ], backdropDismiss: true
        });
        return await alert.present();
      } else {
        this['' + event.modalName] = event.modal
        this.selectedImpactThemeOld = JSON.parse(JSON.stringify({modal:event.modal})).modal 
        this.changeImpactAreaList(event)
      }
    }
  }

  async onChangeImpactTheme (event) {
    if(this.selectedImpactThemeOld != undefined && this.selectedImpactThemeOld != '') {
      const alert = await this.alertController.create({
        message: 'If you change theme before saving, your changes will be lost.',
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.selectedImpactThemeOld = this.selectedImpactTheme
              this.changeImpactAreaList(event)
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              this.selectedImpactTheme = this.selectedImpactThemeOld
            }
          }
        ], backdropDismiss: true
      });
      return await alert.present();
    } else {
      this.selectedImpactThemeOld = this.selectedImpactTheme;
      this.changeImpactAreaList(event)
    }
  }

  changeImpactAreaList (event) {
    this.ImpactAreaList = [];
    this.NewImpactAreaList = [];
    if(event.modal != undefined && event.modal != '') {
      let check = event.list.findIndex(c => c.ReferenceKey == event.modal)
      if(check != -1){
        this.apiService.getImpactThemeAreaList(event.modal).subscribe(response => {
          let res = response
          if (res.success && res.data.list != undefined) {
            this.ImpactAreaList = res.data.list;
          }
          this.loadMsg=''
        });
      }
      this.addToList()
    }
  }

  addToList() {
    this.NewImpactAreaList.push({error:false,ImpactThemeName: ''})
  }
  valuechange($event,item,i){
    this.NewImpactAreaList[i].isAdded = this.isAdded(item);
    this.NewImpactAreaList[i].error = this.isAdded(item);
  }
  isAdded(item) {
    let nList = this.NewImpactAreaList;
    let iAdded=false
    for (let index = 0; index < nList.length; index++) {
      const element = nList[index];
      if(element != item){
        if(element.ImpactThemeName.toLowerCase() == item.ImpactThemeName.trim().toLowerCase())
        iAdded =true
      }
    }
    for (let index = 0; index < this.ImpactAreaList.length; index++) {
      const element = this.ImpactAreaList[index];
      if(element.ReferenceName.toLowerCase() == item.ImpactThemeName.trim().toLowerCase())
      iAdded =true
    }
    return iAdded//(filteredArray.length != 0 && NewfilteredArray.length != 0);
    // }
  }

  removeToList(i) {
    if (i > -1) {
      this.NewImpactAreaList.splice(i, 1);
    }
  }
  
}
