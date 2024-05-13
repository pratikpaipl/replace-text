import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { EventService } from "src/shared/EventService";
import { StorageService } from "src/shared/StorageService";
import { Location } from '@angular/common';

@Component({
    selector: 'fundraise-count',
    templateUrl: './fundraise-count.component.html',
    styleUrls: ['./fundraise-count.component.scss'],
})

export class FundraiseCountComponent implements OnInit {

    @Input()
    FN_EnablerSlug: any = ''

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
    apiAction: any = '';
    @Input()
    ActionType: any = '';

    

    @Output()
    change: EventEmitter<Object> = new EventEmitter<Object>();
    constructor(private location: Location,public store: StorageService, private eventService: EventService, public router: Router) {


    }

    ngOnInit() {
        this.from = this.store.appType == 'front' && !this.location.path().includes('/user')?'front':this.from
    }
    routeMasterPath(type,slug, action){
        return ('/user/'+type+'/' + slug+this.store.getSeprater('user')+action)
    }
    masterClick(type,slug, action){
        if(this.pageFrom == 'Top') {
            this.change.emit({ action: action, mAction: action, pageFrom: this.pageFrom })
        }else{
            this.store.openPage(this.routeMasterPath(type,slug, action),this.openFront)
        }
      }
    fundraiseDetails(item, action?,skip?,FilterType?) {
        if (action == undefined)
        action = 'overview'
        if(this.from =='profile' && this.pageFrom != 'Top'){
            action='funding-profile-match-report'
        }
        if(this.prod.IsMyFundraise != 1)
        action='fundraise-form'
    
        if(FilterType !=undefined && action=='funding-profile-match-report' ){
            let subData = {chipLbl:(FilterType == 'introductions'?'total_'+FilterType:FilterType),EnablerFilterType:FilterType}
            localStorage.setItem('state',JSON.stringify(subData))
        }
        let mAction = action;
        if (this.store.clickEnable) {
            if (this.pageFrom == 'details' && skip == undefined) {
                if(this.subtype != 'enablers')
                this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom })
                else{
                    this.store.openPage(this.routePath(item, action,true,FilterType),this.openFront)
                }
            } else if (this.pageFrom == 'Top' && skip == undefined) {   
            //     console.log('pagefrom ',this.pageFrom)
            // console.log('skip ',skip)
            // console.log('from ',this.from)
                if(this.from != 'front' && this.from !='user'){
                    let item = JSON.parse(JSON.stringify(this.prod))
                    item.EnablerFilterType=FilterType
                    item.EnablerSlug=undefined
                    item.EnablerName=undefined
                    // this.store.setGetParameter('FilterType',FilterType,(FilterType == undefined || FilterType ==''))  
                    // this.store.setGetParameter('chipLbl',(FilterType == 'introductions'?'total_'+FilterType:FilterType),(FilterType == undefined || FilterType ==''))  
                    // this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom})
                    this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom,FilterType:FilterType,selItem:item })
                }
                else{
                    this.store.openPage(this.routePath(item, action,true,FilterType),this.openFront)
                }
            } else {               
                this.store.openPage(this.routePath(item, action,skip,FilterType),this.openFront)
            }
        }
    }

    

    routePath(item, action?,skip?,FilterType?) {
        if(this.prod.MyMatch != undefined && this.prod.MyMatch ==1){
            return this.fullPath(item, FilterType);
        }else{
            let appendPath=''
            // appendPath = this.store.getDetailsParameters()
            let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
            
            if((action =='funding-profile-match-report' && this.from !='front') || this.prod.IsMyFundraise == 1){
                if(FilterType !=undefined && FilterType !=''){
                    apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
                    apPath = (apPath+'FilterType='+ FilterType)
                    apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
                }
              }
            let routePath = ''
            if (action == undefined)
                action = 'overview'
            if (this.store.clickEnable) {
                if (action != undefined) {
                    if(this.from == 'admin') {
                        routePath = ('admin/fundraise/' + item.FN_EnablerSlug + this.store.getSeprater(undefined,apPath) + action);
                    } else if(this.from == 'front') {
                        if(this.prod.IsMyFundraise == 1) {
                            routePath = ('user/fundraise-need/submissions/' + item.FN_EnablerSlug + this.store.getSeprater('user',apPath) + action);
                        }else{
                            routePath = ('fundraise-need/' + item.FN_EnablerSlug + this.store.getSeprater(undefined,apPath)+'fundraise-form')+(apPath!=undefined?apPath:'');                        
                        }
                    } else if(this.from == 'profile' ) {
                        routePath = ('user/fundraise-need/submissions/' + item.FN_EnablerSlug + this.store.getSeprater('user',apPath) + action);
                    }else if(this.from == 'user') {
                        if(this.prod.IsMyFundraise == 1) {
                            routePath = ('/user/fundraise-need/submissions/'+this.prod.FN_EnablerSlug+this.store.getSeprater('user',apPath)+(action=='overview'?'fundraise-form':action))
                          }else if(this.pageFrom =='details'){
                            routePath = ('/user/'+this.prod.EnablerSlug+'/submitted/fundraise-need'+'/' +(this.prod.FN_EnablerSlug)+this.store.getSeprater('user',apPath)+(action=='overview'?'fundraise-form':action))
                          }
                    }
                }
                return (skip || (this.from == 'user' && this.pageFrom == 'details'))?routePath:(this.pageFrom == 'details' || this.pageFrom == 'Top')?'':routePath;
            }
        }
    }


    callAction(event) {
        event.mAction = event.action
        this.eventService.publishChangeSegment(event);
    }
    
    fullPath(row,FilterType?){
        let path=''
        let appendPath=''
        appendPath = this.store.getDetailsParameters()
        let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
        apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
        // if(row.CompanyName != undefined){
            apPath = apPath+(row.CompanyName != undefined?'CompanyName='+ this.store.getSetParmsVal(row.CompanyName):'')
            if(FilterType != undefined){
                apPath = apPath+('&FilterType='+ FilterType)
                apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
            }
            apPath = apPath+'&FN_EnablerSlug='+ row.FN_EnablerSlug
            apPath = apPath+'&ReferenceCode='+ row.ReferenceCode
        // }
        path = (this.store.appType =='admin'?'admin':'user')+apPath+'#full-report'
        return path.replace('?&','?')
    }
    openFullreport(row){        
        this.store.openPage(this.fullPath(row),this.openFront)
    }
      openPage(url,state?){
        let val =url.split('#')
        this.store.navigatePage([val.length>0?val[0]:''],val.length>1?val[1]:'',state)
      }
    actionCall(type) {
        this.router.navigateByUrl(((this.from == 'admin')?'admin/':'')+'enabler/'+this.prod.EnablerSlug+'/'+type+'/add');
    }
    openTeaser(){
        this.router.navigateByUrl(this.teaserPath())
      }
      teaserPath(){
        return (this.from =='front'?'marketplace':this.from)+'/investee/'+(this.prod.FundraiseSlug != undefined?this.prod.FundraiseSlug:this.prod.FN_EnablerSlug !=undefined?this.prod.FN_EnablerSlug:this.FN_EnablerSlug)+'/teaser'
      }
}