import { Component, OnInit, Input } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { actType } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
@Component({
  selector: 'status-view',
  templateUrl: './status-view.component.html',
  styleUrls: ['./status-view.component.scss'],
})
export class StatusViewComponent implements OnInit {

  @Input()
  prod: any;
  prodDup: any;
  @Input()
  subtype: any;
  @Input()
  pageFrom: any;
  @Input()
  from: any;
  @Input()
  pageType: any;
  
  @Input()
  apiAction:any
  @Input()
  ActionType:any
  @Input()
  EnablerSlug:any
  @Input()
  ProfileSlug:any
  @Input()
  elementClass:any = false
  stripe:any;

  constructor(public store: StorageService,public alertController: AlertController, public apiService:ApiService, private eventService: EventService) {
    
  }

  async ngOnInit() {
   this.prodDup = JSON.parse(JSON.stringify(this.prod))
  }

  async changeStatus(type,val,isConfig?) {
    
    let postData = new FormData();
      let fromPage = ''
      let endPoint = ''
      
      postData.append(type, val);
      if(type == 'IsEnable') {
        endPoint = 'update_enable'
      } else if(type == 'IsActive') {
        endPoint = 'update_active'
        if(this.from =='profile'){
          endPoint = 'my_update_active'
        }
      } else if(type == 'DataStatus') {
        endPoint = 'update_data_status'   
      } else if(type == 'ScreeningStatus') {
        endPoint = 'update_screening_status'
      } else if(type == 'IsPublish') {
        endPoint = 'update_publish'
      } else if(type == 'IsFeatured') {
        endPoint = 'update_featured'
      }
      
      fromPage = actType.fundraise
      if (this.apiAction == actType.enabler || this.apiAction == actType.enabler+'s') {
        fromPage = actType.enabler
      }     
      if (this.apiAction == actType.funding_profile || this.apiAction == actType.funding_profile_enabler) {
        fromPage = actType.funding_profile      
      }
      // postData.append('Type', this.ActionType)
      if(this.prod.FN_EnablerSlug !=undefined){
        postData.append("FN_EnablerSlug", this.prod.FN_EnablerSlug);
      }
      if(this.prod.FP_EnablerSlug !=undefined){
        postData.append("FP_EnablerSlug", this.prod.FP_EnablerSlug);
      }
      if (this.prod.EnablerSlug != undefined) {
        postData.append("EnablerSlug", this.prod.EnablerSlug);
      }
      if (this.prod.ProfileSlug !=undefined) {
        postData.append("ProfileSlug", this.prod.ProfileSlug);
      }
      postData.append("PageType", this.apiAction);
      postData.append("Link", window.location.href);
      if(isConfig){
        const alert = await this.alertController.create({
          message: this.store.getVal('fp_fn_enabler_confirmation'),
          animated: true,
          cssClass: 'alertCustomCssBtn',
          
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                postData.append("EmailSend",'1')
                this.callStatusUpdate(endPoint,fromPage, postData,type,val,isConfig)
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => { 
                postData.append("EmailSend",'0')
                this.callStatusUpdate(endPoint,fromPage, postData,type,val,isConfig)
              }
            }
          ], backdropDismiss: false
        });
        return await alert.present();
      
      }else{
        this.callStatusUpdate(endPoint,fromPage, postData,type,val,isConfig)
      }
     


    }
  callStatusUpdate(endPoint: string, fromPage: any, postData: FormData,type,val,isConfig?) {
    this.apiService.update(fromPage, endPoint, postData).subscribe(async response => {
      // let res = this.store.getReponseData(response)
      let res: any = response;
      if (res.success) {
        if(type == 'IsEnable') {
          this.prod.IsEnable = val
        } else if(type == 'IsActive') {
          this.prod.IsActive = val
        } else if(type == 'DataStatus') {
          this.prod.DataStatus = val
        } else if(type == 'IsPublish') {
          this.prod.IsPublish = val
        } else if(type == 'IsFeatured') {
          this.prod.IsFeatured = val
        }

        this.store.showToast(res.message, 2000);
        this.prod.pageFrom = this.pageFrom;
        let resp:any= res.data.detail != undefined? res.data.detail:this.prod;
        if(resp != undefined)
        resp.pageFrom = this.pageFrom;
        this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType),details:resp})
      } else {
        if(type == 'IsEnable') {
          this.prod.IsEnable = this.prodDup.IsEnable
        } else if(type == 'IsActive') {
          this.prod.IsActive= this.prodDup.IsActive
        } else if(type == 'IsPublish') {
          this.prod.IsPublish = this.prodDup.IsPublish
        } else if(type == 'IsFeatured') {
          this.prod.IsFeatured = this.prodDup.IsFeatured
        }
        if(type == 'IsPublish') {
          this.prod.IsPublish = '0'
        }
        if(type == 'IsFeatured') {
          this.prod.IsFeatured = '0'
        }
        if(isConfig){
          let postData = new FormData();
          if(this.prod.FN_EnablerSlug !=undefined){
            postData.append("FN_EnablerSlug", this.prod.FN_EnablerSlug);
          }
          if(this.prod.FP_EnablerSlug !=undefined){
            postData.append("FP_EnablerSlug", this.prod.FP_EnablerSlug);
          }
          if (this.prod.EnablerSlug != undefined) {
            postData.append("EnablerSlug", this.prod.EnablerSlug);
          }
          if (this.prod.ProfileSlug !=undefined) {
            postData.append("ProfileSlug", this.prod.ProfileSlug);
          }
          postData.append('TransactionLogID',res.data.TransactionLogID)
          // let sessionID = res.data.SessionID
          if(res.data.CallPaymentGateway != undefined && res.data.CallPaymentGateway){
            window.open(res.data.SessionUrl,'_self');
          }else{
            if(type == 'IsEnable') {
              this.prod.IsEnable = this.prodDup.IsEnable
            } else if(type == 'IsActive') {
              this.prod.IsActive= this.prodDup.IsActive
            } else if(type == 'DataStatus') {
              this.prod.DataStatus = this.prodDup.DataStatus
            } else if(type == 'IsPublish') {
              this.prod.IsPublish = this.prodDup.IsPublish
            } else if(type == 'IsFeatured') {
              this.prod.IsFeatured = this.prodDup.IsFeatured
            }
            if(type == 'IsPublish') {
              this.prod.IsPublish = '0'
            }
            if(type == 'IsFeatured') {
              this.prod.IsFeatured = '0'
            }
            const alert = await this.alertController.create({
              header: this.store.getVal('error'),
              message: res.message,
              animated: true,
              cssClass: 'alertCustomCssBtn',
              buttons: [
                {
                  text:this.store.getVal('okay'),
                  handler: () => {
                    if(this.prod.IsOperative != 0){
                      if(this.prod.PlanID != undefined){
                        this.store.openPage('admin?EnablerID='+this.prod.EnablerID+'&PlanID='+this.prod.PlanID+'#subscripions','1')
                      }else{
                        this.store.openPage('admin?EnablerID='+this.prod.EnablerID+'#subscripions','1')
                      }
                    }
                  }
                }
              ], backdropDismiss: false
            });
            return await alert.present();
          }
        }else{
          this.store.showToast(res.message, 2000, 'error');
        }
      }
    });
  }
  planPath(prod){
    return prod.ActivePlanName!=undefined?('admin?EnablerID='+prod.EnablerID+'&PlanID='+prod.ActivePlanID+'#subscripions'):('admin?EnablerID='+prod.EnablerID+'#subscripions')
  }
  openToPlan(prod){
    // EnablerID=1#subscripions
    this.store.openPage(this.planPath(prod),'1')
  }
  callPayment(endPoint: string, fromPage: any, postData: FormData,type,val,payment?) {
    postData.append('PaymentStatus',payment?'success':'fail')
    this.apiService.update(fromPage, endPoint, postData).subscribe(async response => {
      // let res = this.store.getReponseData(response)
      let res: any = response;
      if (res.success) {

        if(type == 'IsEnable') {
          this.prod.IsEnable = val
        } else if(type == 'IsActive') {
          this.prod.IsActive = val
        } else if(type == 'DataStatus') {
          this.prod.DataStatus = val
        } else if(type == 'IsPublish') {
          this.prod.IsPublish = val
        } else if(type == 'IsFeatured') {
          this.prod.IsFeatured = val
        }

        this.store.showToast(res.message, 2000);
        this.prod.pageFrom = this.pageFrom;
        let resp:any= res.data.detail != undefined? res.data.detail:this.prod;
        if(resp != undefined)
        resp.pageFrom = this.pageFrom;
        this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType),details:resp})
      } else {
        if(type == 'IsEnable') {
          this.prod.IsEnable = this.prodDup.IsEnable
        } else if(type == 'IsActive') {
          this.prod.IsActive= this.prodDup.IsActive
        } else if(type == 'DataStatus') {
          this.prod.DataStatus = this.prodDup.DataStatus
        } else if(type == 'IsPublish') {
          this.prod.IsPublish = this.prodDup.IsPublish
        } else if(type == 'IsFeatured') {
          this.prod.IsFeatured = this.prodDup.IsFeatured
        }
        if(type == 'IsPublish') {
          this.prod.IsPublish = '0'
        }
        if(type == 'IsFeatured') {
          this.prod.IsFeatured = '0'
        }
       
          this.store.showToast(res.message, 2000, 'error');
      }
    });
  }

  selectStatus(event){
      let postData = new FormData();
      let fromPage = ''
      let endPoint = 'update_data_status'
  
      postData.append("PageType", this.apiAction);
      postData.append("DataStatus", event);
      
      if (this.apiAction == actType.enabler) {
        fromPage = actType.enabler
        postData.append("EnablerSlug", this.prod.EnablerSlug);
      }
      if (this.apiAction == actType.funding_profile) {
        fromPage = actType.funding_profile
        postData.append("ProfileSlug", this.prod.ProfileSlug);
      }
    
      postData.append('Type', this.ActionType)
      postData.append("Link", window.location.href);
      this.apiService.update(fromPage, endPoint, postData).subscribe(response => {
        // let res = this.store.getReponseData(response)
        let res: any = response;
        if (res.success) {
          this.prod.DataStatus = event
          this.store.showToast(res.message, 2000);
          this.prod.pageFrom = this.pageFrom;
          this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
        }
      });
    }
}