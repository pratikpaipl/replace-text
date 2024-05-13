import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { EventService } from "src/shared/EventService";
import { StorageService } from "src/shared/StorageService";
import { Location } from '@angular/common';

@Component({
    selector: 'funding-profile-count',
    templateUrl: './funding-profile-count.component.html',
    styleUrls: ['./funding-profile-count.component.scss'],
})

export class FundingProfileCountComponent implements OnInit {

    @Input()
    FP_EnablerSlug: any = ''
    
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
    console.log('prod --> ',this.prod)
    if (this.store.appType === 'front' && !this.location.path().includes('/user')) {
        this.from = 'front';
    }
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
    fundingProfileDetails(item, action?,skip?,FilterType?) {
        if (action == undefined)
        action = 'overview'
        if(this.from =='profile' && this.pageFrom != 'Top'){
            action='fundraise-need-match-report'
        }
        if(FilterType !=undefined && action=='fundraise-need-match-report' && (this.prod.MyMatch != undefined && this.prod.MyMatch ==1)){
            let subData = {chipLbl:(FilterType == 'introductions'?'total_'+FilterType:FilterType),EnablerFilterType:FilterType}
            localStorage.setItem('state',JSON.stringify(subData))
        }
        if(this.prod.IsMyFundingProfile != 1)
        action='profile-form'
        let mAction = action;
        if (this.pageFrom == 'details'&& skip == undefined) {
            if(this.subtype != 'enablers')
            this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom })
            else{
                this.store.openPage(this.routePath(item, action,true,FilterType),this.openFront)
            }
        } else if (this.pageFrom == 'Top' && skip == undefined) {
            // console.log('pagefrom ',this.pageFrom)
            // console.log('skip ',skip)
            // console.log('from ',this.from)
            if(this.from != 'front' && this.from !='user'){
                let item = JSON.parse(JSON.stringify(this.prod))
                item.EnablerFilterType=FilterType
                item.EnablerSlug=undefined
                item.EnablerName=undefined
                this.change.emit({ action: action, mAction: mAction, pageFrom: this.pageFrom,FilterType:FilterType,selItem:item })
            }
            else{
                this.store.openPage(this.routePath(item, action,true,FilterType),this.openFront)
            }
        } else {
                this.store.openPage(this.routePath(item, action,skip,FilterType),this.openFront)           
        }
    }
    callAction(event) {
        event.mAction = event.action
        this.eventService.publishChangeSegment(event);
    }
    openFullreport(row){        
        this.store.openPage(this.fullPath(row),this.openFront)
    }
    routePath(item, action?,skip?,FilterType?) {
        if(this.prod.MyMatch != undefined && this.prod.MyMatch ==1){
            return this.fullPath(item, FilterType)
        }else{
            let appendPath=''
            let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
            if((action=='fundraise-need-match-report' && this.from !='front') || this.prod.IsMyFundingProfile == 1){
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
                        routePath = ('admin/funding-profile/' + item.FP_EnablerSlug + this.store.getSeprater(undefined,apPath) + action);
                    } else if(this.from == 'front') {
                        if(this.prod.IsMyFundingProfile == 1) {
                            routePath = ('user/funding-profile/submissions/' + item.FP_EnablerSlug + this.store.getSeprater('user',apPath) + action);
                        }else{
                            routePath = ('funding-profile/' + item.FP_EnablerSlug + this.store.getSeprater()+'profile-form')+(apPath!=undefined?apPath:'');                        
                        }
                    } else if(this.from == 'profile') {
                        routePath = ('user/funding-profile/submissions/' + item.FP_EnablerSlug + this.store.getSeprater('user',apPath) + action);
                    }else if(this.from == 'user') {
                        if(this.prod.IsMyFundingProfile == 1) {
                            routePath = ('/user/funding-profile/submissions/' +this.FP_EnablerSlug+this.store.getSeprater('user',apPath)+(action=='overview'?'profile-form':action))
                          }else if(this.pageFrom =='details'){
                            routePath = ('/user/'+this.prod.EnablerSlug+'/submitted/'+('funding-profile')+'/' +this.prod.FP_EnablerSlug+this.store.getSeprater('user',apPath)+(action=='overview'?'profile-form':action))
                          }
                    }
                }
                return (skip || (this.from == 'user' && this.pageFrom == 'details'))?routePath:((this.pageFrom == 'details') || this.pageFrom == 'Top')?'':routePath;
            }
        }
    }


    fullPath(row,FilterType?){
        let path=''
        let appendPath=''
        appendPath = this.store.getDetailsParameters()
        let apPath = appendPath.split('#')!= undefined && appendPath.split('#').length>0?appendPath.split('#')[0]:appendPath;
        apPath = apPath.includes('?')?apPath+'&':'?'+apPath;
        // if(row.ProfileName != undefined){
          apPath = apPath+(row.ProfileName != undefined?'ProfileName='+ this.store.getSetParmsVal(row.ProfileName):'')
          if(FilterType != undefined){
              apPath =  apPath +('&FilterType='+ FilterType)
              apPath = apPath+'&chipLbl='+(FilterType == 'introductions'?'total_'+FilterType:FilterType)
          }
          apPath = apPath+'&FP_EnablerSlug='+ row.FP_EnablerSlug
          apPath = apPath+'&ReferenceCode='+ row.ReferenceCode
        // }
        path = (this.store.appType =='admin'?'admin':'user')+apPath+'#full-report'

        return path.replace('?&','?')
    }
    actionCall(type) {
        let basePath = '';
        if (this.from === 'admin') {
            basePath = 'admin/';
        }
        const url = `${basePath}enabler/${this.prod.EnablerSlug}/${type}/add`;
        this.router.navigateByUrl(url);
    }
}