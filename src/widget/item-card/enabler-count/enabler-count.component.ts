import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { environment } from "src/environments/environment";
import { ApiService } from "src/services/api.service";
import { EventService } from "src/shared/EventService";
import { StorageService } from "src/shared/StorageService";

@Component({
    selector: 'enabler-count',
    templateUrl: './enabler-count.component.html',
    styleUrls: ['./enabler-count.component.scss'],
})

export class EnablerCountComponent implements OnInit {

    @Input()
    EnablerSlug: any = ''
    @Input()
    isAddForm: any=false;
    @Input()
    prod: any;
    @Input()
    pageType: any;
    @Input()
    subtype: any;
    @Input()
    pageFrom: any = '';
    @Input()
    from: any = '';
    @Input()
    openFront: string = '0';
    @Input()
    FundraiseSlug: any;
    @Input()
    ProfileSlug: any;
    @Input()
    apiAction: any = '';
    @Input()
    ActionType: any = '';
    @Input()
    extraMenu: any = false;


    @Output()
    change: EventEmitter<Object> = new EventEmitter<Object>();
    constructor(public store: StorageService, public alertController: AlertController, private eventService: EventService, public router: Router, private apiService: ApiService) {

    }

    ngOnInit() {
        console.log('apiAction ',this.apiAction)

        this.ProfileSlug = (this.prod.ProfileSlug !=undefined)?this.prod.ProfileSlug:(this.ProfileSlug != undefined && this.ProfileSlug != '')?this.ProfileSlug:undefined;
        this.FundraiseSlug = (this.prod.FundraiseSlug !=undefined)?this.prod.FundraiseSlug:(this.FundraiseSlug != undefined && this.FundraiseSlug != '')?this.FundraiseSlug:undefined;
    }
    enablerDetails(type, item, action?, submissions?,main?) {       
        if (this.store.clickEnable) {            
            if(this.isAddForm){
                this.alertController.create({
                    message: this.store.getVal('unsaved_changes'),
                    animated: true,
                    cssClass: 'alertCustomCssBtn',
                    buttons: [
                        {
                            text: this.store.getVal('yes'),
                            handler: () => {
                                this.callClickAction(type, item, action, submissions,main)
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
                this.callClickAction(type, item, action, submissions,main)
            }
        }
    }
    
    openFullReport(lbl,fType){
        this.store.openPage(this.fullReportPath(lbl,fType),this.openFront)
    }

    fullReportPath(lbl,fType){
        let path=''
        let appendPath=''
        // appendPath = this.store.getDetailsParameters()
        let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
        apPath = apPath.includes('?')?apPath+'&':'?'+apPath;

        apPath = (apPath+'EnablerName='+ this.store.getSetParmsVal(this.prod.EnablerName))
        apPath = (apPath+'&EnablerSlug='+ this.prod.EnablerSlug)
        if(fType != undefined && fType !=''){
            apPath = (apPath+'&FilterType='+ fType)
            apPath = apPath+'&chipLbl='+lbl
            apPath = apPath+'&displayMode=1'
          }
     
          if(this.store.appType =='admin'){
            path=('/admin'+this.store.getSeprater(undefined,apPath)+'full-report')
          }
          else{
            path=('/user'+this.store.getSeprater('user',apPath)+'full-report')
          }
          return path
    }

    callClickAction(type, item, action?, submissions?,main?) {
        if (action == undefined)
        action = 'overview'
        let mAction = action;
        let state = { OnType: mAction, action: mAction, itemData: { EnablerSlug: item.EnablerSlug, EnablerName: item.EnablerName }}
        if (this.pageFrom == 'Top') {
            if (submissions != undefined)
            this.actionWithFilterParam(main !=undefined? this.routePathMain(type, item, action, submissions):this.routePath(type, item, action, submissions), state,submissions);
            else
            this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom })
        } else if (this.pageFrom == 'details') {
            this.actionWithFilterParam(main !=undefined? this.routePathMain(type, item, action, submissions):this.routePath(type, item, action, submissions), state,submissions);
        } else {
            this.actionWithFilterParam(main !=undefined? this.routePathMain(type, item, action, submissions): this.routePath(type, item, action, submissions), state,submissions);
        }
    }

    actionWithFilterParam(path,extra, type){
        this.store.openPage(path,this.openFront,this.from !='profile'?extra:undefined)
    }


    routePathMain(type, item, action?, submissions?) {
        let appendPath=''
        // appendPath = this.store.getDetailsParameters()
        let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
        if(this.from =='profile' && type !='match-report' && this.prod.EnablerFilterType != undefined){
        }
        
        let routePath = ''
        if (action == undefined)
        action = 'overview'
    if (this.store.clickEnable) {
        if (submissions != undefined) {
            if (submissions == 'match-report') {
                routePath = ('user/match-report/config/enabler/' + (this.ProfileSlug != undefined ? 'funding-profile' : 'fundraise') + '/' + (this.ProfileSlug != undefined ?this.ProfileSlug:this.FundraiseSlug) + '/' + this.prod.EnablerSlug);
                } else {
                    routePath = ('user'+(apPath!=undefined?apPath:'')+'#' + action);
                }
            } else if (action != undefined) {
                if ((this.from != 'admin') && action == 'my-enabler' && this.prod.IsMyEnabler == 1) {
                    routePath = (environment.redirectAdmin + 'admin/enabler/' + item.EnablerSlug +this.store.getSeprater('user',apPath)+ 'overview');
                } else {
                    if(this.from == 'user'){
                        routePath = ('user/enabler/' + item.EnablerSlug + '#' + action)
                    }else{
                        routePath = (((this.from == 'admin') ? 'admin/' : '') + 'enabler/' + item.EnablerSlug + this.store.getSeprater(undefined,apPath) + action)+(apPath!=undefined && this.from != 'admin'?apPath:'');
                    }
                }
            }
            return routePath;
        }
    }

    routePath(type, item, action?, submissions?) {
        let appendPath=''
        let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
        apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
        apPath = (apPath+'EnablerName='+ this.store.getSetParmsVal(this.prod.EnablerName))
        apPath = (apPath+'&EnablerSlug='+ this.prod.EnablerSlug)
        if(this.from =='profile' && type !='match-report' && this.prod.EnablerFilterType != undefined){
            apPath = (apPath+'&FilterType='+ this.prod.EnablerFilterType)
            apPath = apPath+'&chipLbl='+this.prod.chipLbl
        }
        
        let routePath = ''
        if (action == undefined)
        action = 'overview'
    if (this.store.clickEnable) {
        if (submissions != undefined) {
            if (submissions == 'match-report') {
                routePath = ('user/match-report/config/enabler/' + (this.ProfileSlug != undefined ? 'funding-profile' : 'fundraise') + '/' + (this.ProfileSlug != undefined ?this.ProfileSlug:this.FundraiseSlug) + '/' + this.prod.EnablerSlug);
                } else {
                    routePath = ('user'+(apPath!=undefined?apPath:'')+'#' + action);
                }
            } else if (action != undefined) {
                if ((this.from != 'admin') && action == 'my-enabler' && this.prod.IsMyEnabler == 1) {
                    routePath = (environment.redirectAdmin + 'admin/enabler/' + item.EnablerSlug +this.store.getSeprater('user',apPath)+ 'overview');
                } else {
                    routePath = (((this.from == 'admin') ? 'admin/' : '') + 'enabler/' + item.EnablerSlug + this.store.getSeprater(undefined,apPath) + action)+(apPath!=undefined && this.from != 'admin'?apPath:'');
                }
            }
            return routePath;
        }
    }
    callAction(event) {
        event.mAction = event.action
        this.eventService.publishChangeSegment(event);
    }

    async actionCall(type) {       
        if (this.from == 'profile') {         
            this.router.navigateByUrl('user/enabler/'+(type == 'investee' ? this.FundraiseSlug:this.ProfileSlug)+'/'+this.prod.EnablerSlug+'/'+type+'/add-with-enabler');
        } else {
            if (((type == 'investor' && this.prod.FPSubmissionAccept == 1) || (type == 'investee' && this.prod.FNSubmissionAccept == 1)) || this.store.appType =='admin')
                this.router.navigateByUrl(((this.from == 'admin') ? 'admin/' : '') + 'enabler/' + this.prod.EnablerSlug + '/' + type + '/add');
            else
                this.store.showToast(this.store.getVal('form_configuration_error'), 2000, 'error')
        }
    }

    navigateToAdmin(prod) {
        if(this.isAddForm){
            this.alertController.create({
                message: this.store.getVal('unsaved_changes'),
                animated: true,
                cssClass: 'alertCustomCssBtn',
                buttons: [
                    {
                        text: this.store.getVal('yes'),
                        handler: () => { 
                            if (this.from != 'admin' && this.prod.IsMyEnabler == 1) {
                                window.open(this.routePath('enablers', prod, 'my-enabler'), '_blank')
                            }
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
            if (this.from != 'admin' && this.prod.IsMyEnabler == 1) {
                window.open(this.routePath('enablers', prod, 'my-enabler'), '_blank')
            }            
        }
    }

    isFrontApp(): boolean {
        return (this.isFrontType() && this.isSubmissionAcceptable(this.prod, 'FPSubmissionAccept', 'submit_funding_profile')) || (this.isFrontType() && this.isSubmissionAcceptable(this.prod, 'FNSubmissionAccept', 'submit_fundraise_form'));
      }
      
      isBackendApp(): boolean {
        return this.store.appType === 'admin';
      }
      
      isFrontType(): boolean {
        return this.store.appType === 'front';
      }
      
      isSubmissionAcceptable(prod: any, submissionType: string, permissionType: string): boolean {
        return prod[submissionType] !== 0 && this.store.checkPermission(prod, permissionType);
      }

}