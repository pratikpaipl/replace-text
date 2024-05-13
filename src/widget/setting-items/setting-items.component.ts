import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'setting-items',
  templateUrl: './setting-items.component.html',
  styleUrls: ['./setting-items.component.scss'],
})
export class SettingItemComponent implements OnInit {

  @Input()
  apiEnd: any = ''

  @Input()
  FP_EnablerSlug: any
  @Input()
  FN_EnablerSlug: any
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
  IsPublish: any = false;
  @Input()
  addImpactThemes: any= false;

  EnablerDefault: any;
  
  SettingList: any = [];

  PublicSiteList: any = [];
  UserAccountList: any = [];
  isShowMsg = false;

  publicListView=true;
  userListView=true;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor( public store: StorageService,public apiService: ApiService, public alertController: AlertController,) {
  }
  callApi() {
    this.getSettingParameterList();
  }
  ngOnInit() {
    setTimeout(() => {
      this.callApi();
    }, this.store.isApiCalled);
  }

  getSettingParameterList() {
    this.SettingList = [];
      let param = "?EnablerSlug="+this.EnablerSlug+"&PageType="+this.type+"_setting"
      param = param+(this.FN_EnablerSlug != undefined?"&FN_EnablerSlug="+this.FN_EnablerSlug:'')      
      param = param+(this.FP_EnablerSlug != undefined?"&FP_EnablerSlug="+this.FP_EnablerSlug:'')
      this.apiService.getSettingParameterList(this.apiEnd,param).subscribe(response => {
        let res = response
        if (res.success && res.data != undefined) {
            this.EnablerDefault = res.data.enabler_default != undefined?res.data.enabler_default:undefined
            this.SettingList = res.data.setting_list;
            for (let i = 0; i < this.SettingList.length; i++) {
              let AnswerJson = JSON.parse(this.SettingList[i].AnswerJson);              
              if(this.SettingList[i].AnswerKey == undefined || this.SettingList[i].AnswerKey ==null){
                let sel = AnswerJson.find(x => x.IsDefault === 1)
                this.SettingList[i].AnswerKey= sel.SettingKey
              }
              this.SettingList[i].Answers = AnswerJson;
            }
            this.PublicSiteList=[]
            this.UserAccountList=[]
            for (let k = 0; k < this.SettingList.length; k++) {
              const element = this.SettingList[k];
              if(element.GroupType =='public'){
                this.PublicSiteList.push(element)
              }else if(element.GroupType =='user'){
                this.UserAccountList.push(element)
              }
            }
        } 
      });
  }
  checkValue(ev,pos,ext?){
    if(ev.modal != undefined){
      let ansPos
      if(ext ==0){
        ansPos = this.SettingList.findIndex(c => c.SettingKey == this.PublicSiteList[pos].SettingKey)
      }else{
        ansPos = this.SettingList.findIndex(c => c.SettingKey == this.UserAccountList[pos].SettingKey)        
      }
      this.SettingList[ansPos].AnswerKey=ev.modal;
    }
  }
  viewSH(varnm){
    this[varnm] = !this[varnm]
  }
  SettingAction (event,val) {
    if(event != undefined) {
      if(event == 2) {
      } else {
        if(event == 1) {
          this.submit('save');
        } else if(event == 0) {
          for (let k = 0; k < this.SettingList.length; k++) {
            const element = this.SettingList[k];
            let sel = element.Answers.find(x => x.IsDefault === 1)
            this.SettingList[k].AnswerKey=sel.SettingKey;
          }
          this.submit('reset');
        }
      }
    }
  }
  submit(type) {
    let resAns=[]
    for (let k = 0; k < this.SettingList.length; k++) {
      const element = this.SettingList[k];

      if(this.type =='enablers')
      resAns.push({"QuestionKey": element.SettingKey,"AnswerKey": element.AnswerKey,"EnablerSettingID": element.EnablerSettingID})
      if(this.type =='fundraise')
      resAns.push({"QuestionKey": element.SettingKey,"AnswerKey": element.AnswerKey,"R_FNF_SettingID": element.R_FNF_SettingID})
      if(this.type =='funding_profile')
      resAns.push({"QuestionKey": element.SettingKey,"AnswerKey": element.AnswerKey,"R_FPF_SettingID": element.R_FPF_SettingID})
    }
    let postData = new FormData();
    if(this.EnablerDefault != undefined)
    postData.append("EnablerDefault", this.EnablerDefault?'1':'0');
    postData.append("EnablerSlug", this.EnablerSlug);
    if(this.FP_EnablerSlug != undefined)
    postData.append("FP_EnablerSlug", this.FP_EnablerSlug);
    if(this.FN_EnablerSlug != undefined)
    postData.append("FN_EnablerSlug", this.FN_EnablerSlug);
    if(this.type =='enablers')
    postData.append("IsPublish", this.IsPublish?'1':'0');
    postData.append("PageType", this.type+"_setting");
    postData.append("SettingJson", JSON.stringify(resAns));
    this.apiService.updateSetting((this.type =='enablers'?'enabler':this.type),postData).subscribe(response => {
      let res = response
      if (res.success) {
       this.callApi()
       this.change.emit({IsPublish:this.IsPublish})
        this.store.showToast(res.message, 4000);
      } 
    });
  }
}
