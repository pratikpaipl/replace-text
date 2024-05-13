import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'prod-title',
  templateUrl: './prod-title.component.html',
  styleUrls: ['./prod-title.component.scss'],
})
export class ProdTitleComponent implements OnInit {

  @Input()
  Slug: any = ''
  @Input()
  EnablerSlug: any = ''
  @Input()
  FP_EnablerSlug: any = ''
  @Input()
  FN_EnablerSlug: any = ''
  @Input()
  ActionType: any = ''
  @Input()
  apiAction: any = ''

  @Input()
  from: string;
  @Input()
  openFront: string = '0';
  @Input()
  Name: string = '';
  @Input()
  isAddForm: any=false;
  @Input()
  pageFrom: string;
  @Input()
  pageType: string;
  @Input()
  prod: any;
  @Input()
  title: string;
  @Input()
  itemTitle: string;
  @Input()
  subType: string;
  @Input()
  role: string;
  @Input()
  isAdd: boolean = false;
  @Input()
  extraTitle: boolean = false;

  @Input()
  keyword: string;
  @Input()
  sort: string;
  @Input()
  hideAction: any = '0';
  @Input()
  extraMenu: boolean=true;

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  
  constructor(public store: StorageService,public alertController: AlertController, public router: Router) {

  }
  onAction(slug) {
    this.router.navigateByUrl('/admin/' + 'add-roles' + '/' + slug + '/' + this.subType);
  }
  ngOnInit() {
    // console.log('-->',this.extraTitle)
  }
  filterItem(type,item){
    // this.change.emit({Type:type,item:item});
  }
  routePath(isSame) {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    
    // console.log('routePath ',this.pageType)
    let action;
    (this.apiAction != 'enabler') ? action = 'enabler' : ''
    let strPath = '';
    if (this.pageType =='matched-fundraise-needs' ){
      if(isSame){
        if(this.store.appType != 'admin'){
          strPath = ('/user/funding-profile/submissions/' + this.FP_EnablerSlug+this.store.getSeprater('user')+'profile-form')
        }else{
          strPath = ('admin/'+'funding-profiles-submitted/'+this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
        }
      }else{
        if(this.prod.IsMyFundraise == 1) {
          strPath =('/user/fundraise-need/submissions/' + this.prod.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
        }else{
          strPath = "user/funding-profile/details/"+this.pageType+"/"+(this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(this.prod.FP_EnablerSlug !=undefined?this.prod.FP_EnablerSlug:this.FP_EnablerSlug)+"/fundraise_funding_profile"+this.store.getSeprater('user',apPath)+"fundraise-form"              
        }
      }
    }else if(this.pageType =='matching-funding-profiles' ){
      if(isSame){
        if(this.store.appType != 'admin'){
          strPath = ('/user/fundraise-need/submissions/' + this.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
        }else{
          strPath = ('admin/'+'fundraise-needs-submitted/'+this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')

        }
      }else{
        if(this.prod.IsMyFundingProfile == 1||this.prod.IsMyFundraise == 1) {
          strPath = ('/user/funding-profile/submissions/' + this.prod.FP_EnablerSlug+this.store.getSeprater('user',apPath)+'profile-form')
        }else{
          strPath = "user/fundraise-need/details/"+this.pageType+"/"+(this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug)+"/"+(this.prod.FP_EnablerSlug !=undefined?this.prod.FP_EnablerSlug:this.FP_EnablerSlug)+"/funding_profile_fundraise"+this.store.getSeprater('user',apPath)+"profile-form"
        }
      }
    }
    else if (this.from != 'admin' || this.openFront == '1') {
   
    
      if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='profile' && this.pageFrom !='details'){
        strPath = ('/user/funding-profile/submissions/' + this.prod.FP_EnablerSlug+this.store.getSeprater('user',apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.ProfileSlug!=undefined && this.from =='profile' && this.pageFrom !='details' ){
        strPath =('/user/funding-profile/' + this.prod.ProfileSlug+this.store.getSeprater('user',apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='front' && this.pageFrom !='details'){
        strPath =('/funding-profile/' + this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
      }
      else if(this.pageType=='funding-profiles' && this.prod.FP_EnablerSlug !=undefined && this.from =='front' && this.pageFrom =='details'){
        strPath =('/funding-profile/' + this.prod.FP_EnablerSlug+this.store.getSeprater(undefined,apPath)+'profile-form')
      }
      else if(this.pageType=='fundraise' && this.prod.FN_EnablerSlug !=undefined&& this.from =='profile' && this.pageFrom !='details'){
        strPath =('/user/fundraise-need/submissions/' + this.prod.FN_EnablerSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
      }
      else if((this.pageType=='fundraise' || this.pageType=='fundraise-needs') && this.prod.FN_EnablerSlug !=undefined&& this.from =='front' && this.pageFrom !='details'){
        strPath =('/fundraise-need/' + this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')
      }
      else if((this.pageType=='fundraise' || this.pageType=='fundraise-needs') && this.prod.FN_EnablerSlug !=undefined&& this.from =='front' && this.pageFrom =='details'){
        strPath =('/fundraise-need/' + this.prod.FN_EnablerSlug+this.store.getSeprater(undefined,apPath)+'fundraise-form')
      }
      else if(this.pageType=='fundraise' && this.prod.FundraiseSlug !=undefined&& this.from =='profile' && this.pageFrom !='details'){
        strPath =('/user/fundraise-need/' + this.prod.FundraiseSlug+this.store.getSeprater('user',apPath)+'fundraise-form')
      }
      else{
        // console.log('this.from --..--..--> ',this.pageFrom)
        if(this.from =='user'){
          if(this.prod.IsMyFundingProfile == 1|| this.prod.IsMyFundraise == 1) {
            strPath = ('/user/'+(this.pageType =='funding-profiles'?'funding-profile':'fundraise-need')+'/submissions/' +( (this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FP_EnablerSlug))+this.store.getSeprater('user',apPath)+(this.pageType =='funding-profiles'?'profile-form':'fundraise-form'))
          }else if(this.pageFrom =='details'){
            strPath = ('/user/'+this.prod.EnablerSlug+'/submitted/'+(this.pageType =='funding-profiles'?'funding-profile':'fundraise-need')+'/' +( (this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FP_EnablerSlug))+this.store.getSeprater('user',apPath)+(this.pageType =='funding-profiles'?'profile-form':'fundraise-form'))
          }
          else{
            strPath = 'user/' + (this.pageType == 'enablers'?'enabler':this.pageType) + '/' + ((this.pageType == 'enablers') ? this.prod.EnablerSlug : this.Slug) +this.store.getSeprater((this.from == 'user' && this.pageType == 'enablers'&& !this.isAddForm?this.from:undefined),apPath)+ 'overview';
          }      
        }else{
          strPath = (this.from == 'user' && this.pageType == 'enablers' && !this.isAddForm ?'user':'')+('/' + (this.pageType == 'enablers'?'enabler':this.pageType) + '/' + ((this.pageType == 'enablers') ? this.prod.EnablerSlug : this.Slug) +this.store.getSeprater((this.from == 'user' && this.pageType == 'enablers'&& !this.isAddForm?this.from:undefined),apPath)+ 'overview');
        }
      }      
    } else if (this.from == 'admin') {
      if (this.pageType == 'funding-profile-view') {
        if(this.prod.ProfileSlug !=undefined)
        strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug +this.store.getSeprater(undefined,apPath)+ 'profile-form');
      } else if (this.pageType == 'enabler-view' || this.pageType == 'enablers'|| this.pageType == 'enabler') {
        if(this.prod.EnablerSlug !=undefined)
        strPath = ('/admin/enabler/' + this.prod.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview');
      } else if (this.pageType == 'fundraise-view' || this.pageType == 'fundraise' ) {
        if(this.prod.FundraiseSlug !=undefined)
        strPath = ('/admin/' +(this.pageType == 'fundraise-view'?'fundraise-needs':'fundraise')+'/' + this.prod.FundraiseSlug + (this.pageType == 'fundraise-view'?this.store.getSeprater(undefined,apPath)+'fundraise-form':this.store.getSeprater(undefined,apPath)+'overview'));
        else if(this.prod.ProfileSlug !=undefined)
        strPath = ('/admin/funding-profile/' + this.prod.ProfileSlug +this.store.getSeprater(undefined,apPath)+ 'profile-form');
      } else {

      }
    }
    let exParms = !strPath.includes('#')?(apPath!=undefined?apPath:''):''
    return strPath+exParms;
  }
  
  openEnabler(){
    this.store.openPage(this.enablerPath(),this.openFront)    
  }
  enablerPath() {
    let appendPath=''
    appendPath = this.store.getDetailsParameters()
    let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
    let routePath=''
    if (this.from == 'admin' && this.store.appType =='admin') {
      routePath = ('/admin/enabler/' + this.prod.EnablerSlug +this.store.getSeprater(undefined,apPath)+ 'overview');
    }
    else if (this.from != 'admin' || this.store.appType =='front') {
      routePath = (this.from != 'front'?'user':'')+'/enabler/'+ this.prod.EnablerSlug +this.store.getSeprater((this.from != 'front'?'user':undefined),apPath)+'overview'
    }
    let exParms = !routePath.includes('#')?(apPath!=undefined?apPath:''):''
    return routePath+exParms;
  }
  itemDetails(isSame) {
    if(this.isAddForm){
      this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
            {
                text: this.store.getVal('yes'),
                handler: () => { 
                  this.store.openPage(this.routePath(isSame),this.openFront)
                }
            },
            {
                text: this.store.getVal('no'),
                role: 'cancel',
                handler: () => {
                    return false;
                }
            }
        ], backdropDismiss: true
    }).then(res => {
        res.present();      
      });
    }else{
      this.store.openPage(this.routePath(isSame),this.openFront)
    }
  }
}

