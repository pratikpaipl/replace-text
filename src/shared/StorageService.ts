import { Inject, Injectable,  PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { DOCUMENT, Location } from '@angular/common'
import { EventService } from './EventService';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ShareComponent } from 'src/widget/share/share.component';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';

declare const gAnalytics
@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storeReloadToken:any
    navSavePage:any 
    errorMsg = ''
    pageTittle = ''
    labelList: any;
    sortItemList: any = []
    InterestResult = [];
    DataStatusResult: any = []
    ActiveStatusResult: any = []
    EnableStatusResult: any = []
    SubmitterConfirmationResult = [];
    PublishStatusResult = [];
    PlanStatusResult: any = []
    PitchStatusResult = [];
    languageList = [];
    valueList: any = []
    name: any
    email: any
    isView = false;
    //aproval from parth
    clickEnable = false;

    sec = 'pi2lifedatakey'
    isNew: any = false;
    cnt: any = 0;
    userData: any;

    regWeb: any;
    regEmail: any;
    public searchMsg: any;
    public lng: any = 'en';
    public alertPresented: any;
    public alertPresentedToken: any;

    IsSystemAdmin = false;
    AdminAccess = false;

    DECIMAL_SEPARATOR = ".";
    GROUP_SEPARATOR = ",";

    isLogin = false;
    isApiCalled = 10;
    // loginToken = '';
    navicateUrl = ''
    appType = ''
    PLATFORMID:any
    max_size = 25000000 
    logo_max_size = 5000000 

    width=60
    height=60

    screenWidth=1000

    public windowWidth: any;
    public windowHight: any;
    public aboveScroll: any=600;
    public IsWebView: any=true;
    

    constructor(@Inject(PLATFORM_ID) platformId: any,private cookieService: CookieService,@Inject(DOCUMENT) public doc: any,private metaService: Meta,private titleService: Title,public http: HttpClient, public network: Network,public modalController: ModalController, public toastController: ToastController, public router: Router,public route:ActivatedRoute, private eventService: EventService, public alertController: AlertController, private location: Location, public sanitizer: DomSanitizer) {       
        this.PLATFORMID = isPlatformBrowser(platformId)    
        this.eventService.formRefresh$.subscribe((item: any) => {
            this.isLogin = this.PLATFORMID ? this.cookieService.check(environment.cookiesKey) :false;
        });
        this.searchMsg = 'We could not find any deals matching your objective. You may change your alert or contact us '
        this.regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/;
        // this.regWeb = /^((http|ftp|https):\/\/)?([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/
        this.regWeb = /^(http|ftp|https?:\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,2000})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
        // this.regWeb = /^(http|ftp|https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?$/
        this.setNavigateUrl()
        this.getTextLabelList();
        this.getUserData();
        
        this.eventService.updateLng$.subscribe((item: any) => {
            this.getTextLabelList();
        });  
              
    }
    getTextLabelList() {
        this.http.get(environment.BaseUrl + 'text/text_list?LanguageCode=' + this.lng).subscribe(response => {
            let res: any = response;
            if (res.success) {
                this.labelList = res.data.list;
                this.sortItemList =  [{ lbl: this.getVal('recent'), val: 'recent' }, { lbl: this.getVal('a_z'), val: 'ascending' }, { lbl: this.getVal('z_a'), val: 'descending' }]
                this.DataStatusResult = [];
                this.DataStatusResult.push({ lbl: 'Under review', val: '0' })
                this.DataStatusResult.push({ lbl: 'Approved', val: '1' })
                this.DataStatusResult.push({ lbl: 'Rejected', val: '2' })
                this.DataStatusResult.push({ lbl: 'Expired', val: '3' })
        
                this.valueList = [];
                this.valueList.push({ lbl: '#5', val: '0' })
                this.valueList.push({ lbl: '#6', val: '1' })

                this.getTextList();
            }
        });
    }
    getCurrentTime() {
        return new Date().getTime() //moment().valueOf()
    }
    getMsg(msg?){
        let str = (msg != undefined?msg:this.searchMsg);
        let ms = ((msg != undefined)?str.replace('{{','').replace('}}',''):msg)
        return ms
    }
    getTrimData(contentData: string) {
        let content =  contentData != undefined ? this.onkeyup(contentData) == 0 ? '' : contentData : ''
        var htmlContent= $($.parseHTML(content));
        var text = htmlContent.filter('[data-f-id="pbf"]').html();
        var finalText = content.replace(text, '');
       return $(finalText).text() !='' ? finalText:''
    }
    findAllByKey(obj, keyToFind) {
        return Object.entries(obj).reduce((acc, [key, value]) => (key === keyToFind)? acc.concat(value):(typeof value === 'object' && value)? acc.concat(this. findAllByKey(value, keyToFind)): acc, []) || [];
      }
      
      findKey = (obj, val) => {
        // console.log('obj ',obj)
        if (typeof obj === "object") {
          for (const key in obj) {
            if (obj[key] === val) {                
              return obj;
            } else {
              const result = this.findKey(obj[key], val);
              if (result !== null) return result;
            }
          }
        }    
        return null;
      }
      getSeprater(type?,params?) {
        let url = (this.appType=='admin'?(params!=undefined?params:'')+'#': (type == undefined || (type !='user' && type!='auth'))?'/':(params!=undefined?params:'')+'#')
        return url
    }
    dispCount(value,total){
        let retStr='';
        retStr = ' ('+value+' / '+total+')'
        return retStr
    }
      dispMatchCnt(item,cnt){
        return (cnt != undefined?(cnt > 0 )?'<br />('+(cnt+' '+this.getVal('matched'))+')':'<br />('+this.getVal('not_matched')+')':'') 
      }
      login() {
        this.router.navigateByUrl('/auth#login');
      }
       actionCheckWithConfirm():boolean {

        let isAction=false;
        this.alertController.create({
            message: this.getVal('unsaved_changes'),
            animated: true,
            cssClass: 'alertCustomCssBtn',
            buttons: [
                {
                    text: this.getVal('yes'),
                    handler: () => { return true; }
                },
                {
                    text: this.getVal('no'),
                    role: 'cancel',
                    handler: () => {
                        return false;
                    }
                }
            ], backdropDismiss: true
        }).then(res => {
            res.present();      
          });
        //    alert.present();  
          return isAction;    
      }
      getMatchListTwoLevel(list: any=[],varnm:any) {
        let lst=''
    //.ImpactThemesAndAreas
        for (let i = 0; i < list.length; i++) {
          const main = list[i];
          lst = lst + '<span class="two-leve-data">'+main.ParentReferenceName+'</span><br />'
          var subObj =typeof main[varnm] === 'object' ? main[varnm] :JSON.parse(main[varnm])
          for (let j = 0; j < subObj.length; j++) {
            const element = subObj[j];
            if(element.IsMatch){
              lst =lst + ('<span class="match">'+element.ReferenceName+((j == subObj.length - 1)?'</span>':', </span>')+(j == subObj.length - 1?'<br /><br />':''))
            }else{
              lst = lst + (element.ReferenceName+((j == subObj.length - 1)?'':', ')+(j == subObj.length - 1?'<br /><br />':''))
            }
          }      
        }
        return lst;
      }
    checkDefault(value: any) {
        return value !=undefined?value:''
      }
      getKeyDatas(refList,listData,key: string,isTree?) {
        // throw new Error('Method not implemented.');
        var idx = refList.findIndex(p => p.FieldKey == key);
        return (idx != -1 && refList[idx].ReferenceValues != undefined && refList[idx].ReferenceValues != '')?(isTree?this.getTreeList(listData,refList[idx].ReferenceValues):refList[idx].ReferenceValues.split(',')):[];
      }
      getComaSepratedStr(data,sep?){
        let list = data != undefined ? JSON.parse(data):[]
        let str  = Array.prototype.map.call(list, function(item) { return item.ReferenceName; }).join(sep !=undefined?sep:",")
        return str;
      }

    getTreeList(list: any, def: any): any {
        let preSelected = def !=undefined && def !=''? typeof def =='string'?def.split(','):def:[]
       let nList = []
        const findItemNested = (arr, itemId, nestingKey) => (
          arr.reduce((a, item) => {           
            if (a) {
                return a
            };
            if (item.Children?.every(child => {
                child.checked
            })) {
                item.checked = true;
            }
            if (item.ReferenceKey.toString() === itemId.toString()){
                item.checked=true
              return item
              };
            if (item[nestingKey]){
                return findItemNested(item[nestingKey], itemId, nestingKey)
            } 
          }, null)
        );
    
        for (let i = 0; i < preSelected.length; i++) {
          const element = preSelected[i];
          const result = findItemNested(list, element, "Children");
          if(result != undefined) {
            nList.push(element)
            }
        }
         return nList
      }  
      getList(list: any[], value: any): any {
       let st= (value != undefined)?Array.prototype.map.call(list.filter(i => value.split(',').indexOf(i.ReferenceKey) !== -1), function(item) { return item.ReferenceKey; }).join(",").split(',').filter(e =>  e):''
       return st;
      }
      getListParmsWise( value: any): any {
        let valAr = (value != undefined && value !='')? value.split(',').map(Number):'';
        return valAr;
      }
      getListParmsWiseStr( value: any): any {
        let valAr = (value != undefined && value !='')? value.split(','):'';
        return valAr;
      }
      
    getStatus(status) {
        if(this.DataStatusResult.length>0 && status !=undefined)
        return this.DataStatusResult[status].lbl
    }
    getPitchStatus(status) {
        if(this.PitchStatusResult.length>0 && status !=undefined){
            let res =this.PitchStatusResult.find(x => (x.ReferenceKey === status));
            return res.ReferenceName
        }
    }
    getScrenigStatus(list,status) {
        if(list.length>0 && status != undefined && status !=''){
            let res =list.find(x => (x.val === status)|| (x.ReferenceKey === status));
            return res !=undefined ?res.lbl !=undefined?res.lbl:res.ReferenceName :''
        }
        return ''
    }
    async getSavedFilter(key: string, defValue) {
        // defValue = typeof (defValue === 'boolean')?defValue?'1':'':defValue
        return await this.rawValue(key, 0) != undefined ? await this.rawValue(key, 0) : defValue;
    }
    dispDate(val){
        let dis=moment(val, 'dd MMM yyyy hh:mm a').utc()
        return dis;
    }
    getFilterFromUrl(key: string, defValue: any) {
        const parms = this.searchToObject();
        const filterValue = parms[key];
        if (filterValue !== undefined && filterValue !== '') {
            if (['countryOfEnabler', 'ImpactThemesAndAreasKey', 'BusinessAreaCategoryIDs', 'BusinessAreaProductCategoryIDs', 'BusinessAreaServiceCategoryIDs', 'BusinessActivitiesKeys', 'BusinessInterestKeys', 'PrimaryBusinessActivityKeys', 'CustomerApplicationSectorIDs', 'SdgIDs', 'EsgKeys', 'ServiceAccreditationNames', 'ServiceComplianceIDs', 'AffiliatedWith', 'ServiceDeliveryKey', 'ServiceMethodIDs'].includes(key)) {
                return filterValue.split(',');
            } else {
                return filterValue.replace('-and-', '&');
            }
        } else {
            return defValue !== undefined ? defValue : '';
        }
    }
    getFilterFromUrl1(key: string, defValue) {
        let parms = this.searchToObject()
        if(key =='countryOfEnabler' || key =='ImpactThemesAndAreasKey' || key == 'BusinessAreaCategoryIDs' ||key == 'BusinessAreaProductCategoryIDs' ||key == 'BusinessAreaServiceCategoryIDs' || key=='BusinessActivitiesKeys' || key=='BusinessInterestKeys' || key == 'PrimaryBusinessActivityKeys' || key =='CustomerApplicationSectorIDs' || key =='SdgIDs'  || key =='EsgKeys' || key =='ServiceAccreditationNames' || key =='ServiceComplianceIDs' || key =='AffiliatedWith' || key=='ServiceDeliveryKey' || key =='ServiceMethodIDs')
        return parms[key] !=undefined && parms[key] !=''?parms[key].split(','):defValue!=undefined?defValue:''
        else
        return parms[key] !=undefined?parms[key].replace('-and-','&'):defValue !=undefined?defValue:'';
    }
    rawValue(id, type) {
        if (type == 1) {
            return this.getVal(id);
        }
        return this.getDataFromDb(id, type);
    }

    getDataFromDb(id, type) {
        return this.PLATFORMID?localStorage.getItem(id):'';
    }

    

    public setFirstLetterToUppercase(string: any): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    convertLocalDateToUTCDate(date, toUTC) {
        date = new Date(date);
        var localOffset = date.getTimezoneOffset() * 60000;
        var localTime = date.getTime();
        if (toUTC) {
            date = localTime + localOffset;
        } else {
            date = localTime - localOffset;
        }
        date = new Date(date);
        return date;
    }
    convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;   
    }
    setDataStore(response: any, from: string) {
        let res = this.getReponseData(response);
        let time = this.convertLocalDateToUTCDate(new Date(res.data.token.ExpireDate),false); 
        this.PLATFORMID?this.cookieService.set(environment.cookiesKey,JSON.stringify(response) ,time,'/',environment.cookiesDomain):false;
        this.PLATFORMID?localStorage.setItem('token', res.data.token.token):false;    
        this.storeReloadToken = res.data.token.token;    
        this.userData = res.data
        this.setNavigateUrl()
    }
    setUpProcess(from) {
        let checkC = this.cookieService.check(environment.cookiesKey)
        let res = checkC ?this.getReponseData(this.cookieService.get(environment.cookiesKey)):undefined
        if(checkC || this.storeReloadToken != undefined){
            let cToken = (res!=undefined)?(res.data !=undefined)?res.data.token.token :undefined :undefined
            this.setNavigateUrl()
            if(this.storeReloadToken != cToken){
                if(!checkC){
                    this.storeReloadToken = undefined
                }else{
                    this.storeReloadToken = cToken
                }
                location.reload();
            }
            this.userData = res.data
        }else{
            
        }
    }
    getUserData() {
        if (this.PLATFORMID) {
            let datas;
            if (this.cookieService.check(environment.cookiesKey)) {
                let res = this.getReponseData(this.cookieService.get(environment.cookiesKey))
                datas = res!=undefined?res.data:undefined
                this.userData = res.data
                this.storeReloadToken = datas.token.token
                if (datas != undefined && datas.UserData != undefined) {
                    this.isApiCalled = 10;
                    this.email = (datas != undefined && datas.UserData != undefined) ? datas.UserData.email : ''
                    this.name = datas.UserData.FirstName + ' ' + datas.UserData.LastName
                    this.AdminAccess = (datas != undefined && datas.UserData != undefined) ? datas.UserData.AdminAccess == 1 : false
                    this.IsSystemAdmin = (datas.UserData != undefined) ? datas.UserData.IsSystemAdmin == 1 : false;
                    this.lng = datas.UserData.LanguageCode;
                } else {
                    this.AdminAccess = false
                    this.IsSystemAdmin = false;
                }
            }
        }
    }
    setNavigateUrl() {
        var url = this.PLATFORMID?window.location.host:''
        this.isLogin = this.PLATFORMID ? this.cookieService.check(environment.cookiesKey) :false;
        if (url == 'localhost:8104' || url == 'localhost:8004' || url == 'dev.admin.funder.pi2.life' || url =='admin.funder.pi2.life') {
            this.navicateUrl = 'admin#dashboard'
            this.appType = 'admin'
        }

        if (url == 'test.funder.pi2.life' || url == 'localhost:2030' || url == 'localhost:8105' || url == 'localhost:8005' || url == 'dev.funder.pi2.life' || url =='funder.pi2.life') {
            this.navicateUrl = 'explore'+this.getSeprater()+'enablers'
            this.appType = 'front'
        }  
    }
    getReponseData(response: any) {
        // let res = environment.isDecript ? this.decryptData(response, environment.keyDataOrg) : response
        let data = typeof response === 'string' ? JSON.parse(response) : response;
        return data
    }
    saveData(key: string, value: any, isJson?) {
        if(this.PLATFORMID){
            if (key == 'PlayerID')
                localStorage.setItem(key, value);
            else if (key == 'UserID')
                localStorage.setItem(key, value);
            else if (key == 'token')
                localStorage.setItem(key, value);
            else if (key == 'InvitationKey')
                localStorage.setItem(key, value);
            else if (key == 'PageEmail')
                localStorage.setItem(key, value);
            else if (key == 'PageName')
                localStorage.setItem(key, value);
            else if (key == 'PageType')
                localStorage.setItem(key, value);
            else if (key == 'altMsg' || key == 'USER_INFO')
                localStorage.setItem(key, isJson ? JSON.stringify(value) : value);
            else {
                localStorage.setItem(key, value);
            }
        }
    }
    onkeyup(data, fnm?) {
        if (data == undefined)
            return 0;
        if (data.trim().length == 0) {
            return 0;
        }
        const parser = new DOMParser();
        const html = parser.parseFromString(data, 'text/html');
        return html.body.textContent.trim().length
    }
    planText(data, fnm?) {
        if (data == undefined)
            return '';
        if (data.trim().length == 0) {
            return '';
        }
        const parser = new DOMParser();
        const html = parser.parseFromString(data, 'text/html');
        return html.body.textContent.trim()
    }
    Explore() {
        let val =(this.explorePath()).split('#')
        this.navigatePage([val.length>0?val[0]:''],val.length>1?val[1]:'')
        // this.router.navigateByUrl(this.explorePath());
    }
    getPalceTypes(types) {
        let typ = types.replace(/\+/g, ' ')
        typ.replace(/,/g, ', ')
        var array = typ.split(',');
        let str = array.join(', ')
        return str.replace(/_/g, ' ');
    }

    toTrimFix(val) {
        if (isNaN(val)) {
            return val;
        }
        let result = val.substring(0, (val.indexOf('.') + 3));
        return result//parseFloat(val).toFixed(2) //.valueOf(2)
    }
    toFix(val) {
        if (isNaN(val)) {
            return val;
        }
        return parseFloat(val).toFixed(2) //.valueOf(2)
    }
    updateSegmentName(label,key,from?): string {
        let lbl = label;
    
        if(key == undefined)
        return lbl;
        if (key == 'funding-profile') {
            lbl = this.getVal('funding_profiles')
        }
        else if (key == 'impact-funding-resources') {
            lbl = this.getVal('impact_funding_resources')
        }else if (key == 'fundraise-needs') {
            lbl = this.getVal('fundraise_needs')
        }else if (key == 'funding-profiles-submitted') {
            lbl = this.getVal('funding_profiles_submitted')
        }else if (key == 'settings') {
            lbl = this.getVal('visbility_settings')
        }else if (key == 'matchmaking') {
            lbl = this.getVal('csv_matchmaking')
        }
        else {
            if(from == 'detils'){
                if(key == 'funding-profile-match-report')
                key='matching-funding-profiles' 
                else if(key == 'fundraise-need-match-report')
                key='matched-fundraise-needs' 
            }
            lbl = this.getVal(key.replace(/-/g, '_'))
        }
     
        
        return lbl;
    }
    public highlight(loadMsg, query, msg, action) {
        if (!query) {
            return this.nl2br(loadMsg);
        }
        return this.nl2br(loadMsg.replace(new RegExp("{{" + query + "}}", "gi"), match => {
            if (action != null)
                return '<span class="pointer under-line actonTg" data-action=" (click)=Contact()' + query + '" style="color: var(--ion-color-red) !important; font-weight:bold">' + msg + '</span>';
            else
                return '<span>' + msg + '</span>';
        }));
    }
    nl2br(text: string) {
        if(text != undefined)
        return (text != undefined)?text.replace(new RegExp('\r?\n', 'g'), '<br />'):''
    }
    nl2br2(text: string) {
        if(text != undefined)
        return (text != undefined)?text.replace(new RegExp('\r?\n', 'g'), '\n'):''
    }
    public getHtmlWithBypassedSecurity(code: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(code);
    }
    msgDisplay(arg0: boolean) {
        return arg0;
    }
    replaceAll(str, find, replace) {
        var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(escapedFind, 'g'), replace);
    }
    hasWhiteSpace(s) {
        return /\s/g.test(s);
    }
    checkMail(email,allow?): boolean {
        return (email == '' || !this.regEmail.test(allow?email.trim():email))
    }
    
    checkWeb(web): boolean {
        return (web == '' || !this.regWeb.test(web))
    }
    isNetwork() {
        if (this.network.type == 'none') {
            this.presentAlert('No internet', 'You do not have an Internet connection. Please check your connection status', 'Ok')
            return false;
        } else {
            return true;
        }
    }
    scrollTo(id) {
        if(this.PLATFORMID){
            let el = document.getElementById(id);
            if(el != undefined)
            el.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
        }
    }
    scrollToEnd(id) {
        if (this.PLATFORMID) {
            try {
                document.querySelector(id).scrollIntoView({behavior: 'smooth'});
            } catch (err) {
                console.log(' scrollToEnd ',err)
            }
        }
    }
    scrollFromUrlTo(id) {
        if(this.PLATFORMID){
            let el = document.getElementById(id);
            el.scrollIntoView({ behavior: "smooth", block: "end", inline: "center" });
        }
    }
    _keyUp(event: any,val:any) {
        if (event.key == '.') {
            event.preventDefault();
        }
    }
    getTextList1() {
        this.http.get(environment.BaseUrl + 'text/list?LanguageCode=' + this.lng).subscribe(response => {
            let res: any = response;
            if (res.success) {
                this.InterestResult = res.data.InterestResult;
                this.PitchStatusResult = res.data.PitchStatusResult;
                this.isView = true;
                this.clickEnable = res.data.clickEnable;
                this.errorMsg = this.getVal('content_currently_unavailable_label')
                if (this.PLATFORMID) {
                    localStorage.setItem('type', 'contact_us')
                    localStorage.removeItem('slug')
                }
                this.searchMsg = this.getVal('could_not_find_any_stores_for_selected_criteria_note');
    
                const mapDataResults = (resultArray: any[], data: any[]) => {
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        resultArray.push({ lbl: element.ReferenceName, val: element.ReferenceKey })
                    }
                }
    
                this.DataStatusResult = [];
                mapDataResults(this.DataStatusResult, res.data.DataStatusResult);
    
                this.sortItemList = [
                    { lbl: this.getVal('recent') },
                    { lbl: this.getVal('ascending') },
                    { lbl: this.getVal('descending') }
                ];
    
                this.ActiveStatusResult = [];
                mapDataResults(this.ActiveStatusResult, res.data.ActiveStatusResult);
    
                this.EnableStatusResult = [];
                mapDataResults(this.EnableStatusResult, res.data.EnableStatusResult);
    
                this.SubmitterConfirmationResult = [];
                mapDataResults(this.SubmitterConfirmationResult, res.data.SubmitterConfirmationResult);
    
                this.PublishStatusResult = [];
                mapDataResults(this.PublishStatusResult, res.data.PublishStatusResult);
    
                this.PlanStatusResult = res.data.PlanStatusResult;
                this.eventService.publishUpdateLabel(this.labelList);
            }
        });
    }
    
    getTextList() {
        this.http.get(environment.BaseUrl + 'text/list?LanguageCode=' + this.lng).subscribe(response => {
        // this.http.get(environment.BaseUrl + 'ListAllStores').subscribe(response => {
            let res: any = response;
            if (res.success) {
                this.InterestResult = res.data.InterestResult;
                this.PitchStatusResult = res.data.PitchStatusResult;
                this.isView = true;
                this.clickEnable = res.data.clickEnable;
                this.errorMsg = this.getVal('content_currently_unavailable_label')
                if(this.PLATFORMID){
                    localStorage.setItem('type', 'contact_us')
                    localStorage.removeItem('slug')
                }
                this.searchMsg = this.getVal('could_not_find_any_stores_for_selected_criteria_note');

                for (let k = 0; k < res.data.DataStatusResult.length; k++) {
                    const element = res.data.DataStatusResult[k];
                    // this.DataStatusResult[element.ReferenceKey].val = element.ReferenceKey
                    this.DataStatusResult[element.ReferenceKey].lbl = element.ReferenceName
                }

                this.sortItemList[0].lbl = this.getVal('recent') 
                this.sortItemList[1].lbl = this.getVal('ascending') 
                this.sortItemList[2].lbl = this.getVal('descending') 
                // [{ lbl: this.getVal('recent'), val: 'recent' }, { lbl: this.getVal('a_z'), val: 'ascending' }, { lbl: this.getVal('z_a'), val: 'descending' }]

                

                this.ActiveStatusResult = [] //res.data.ActiveStatusResult
                for (let i = 0; i < res.data.ActiveStatusResult.length; i++) {
                    const element = res.data.ActiveStatusResult[i];
                    this.ActiveStatusResult.push({ lbl: element.ReferenceName, val: element.ReferenceKey })
                }
                this.EnableStatusResult = [] //res.data.EnableStatusResult
                for (let i = 0; i < res.data.EnableStatusResult.length; i++) {
                    const element = res.data.EnableStatusResult[i];
                    this.EnableStatusResult.push({ lbl: element.ReferenceName, val: element.ReferenceKey })
                }
                this.SubmitterConfirmationResult = [] //res.data.SubmitterConfirmationResult
                for (let i = 0; i < res.data.SubmitterConfirmationResult.length; i++) {
                    const element = res.data.SubmitterConfirmationResult[i];
                    this.SubmitterConfirmationResult.push({ lbl: element.ReferenceName, val: element.ReferenceKey })
                }
                this.PublishStatusResult = [] //res.data.PublishStatusResult
                for (let i = 0; i < res.data.PublishStatusResult.length; i++) {
                    const element = res.data.PublishStatusResult[i];
                    this.PublishStatusResult.push({ lbl: element.ReferenceName, val: element.ReferenceKey })
                }
                this.PlanStatusResult = res.data.PlanStatusResult
                this.eventService.publishUpdateLabel(this.labelList);
            }
        });
    }

    getCurrency(type,list){
        if(type != undefined && type !='' && list != undefined){
            let obj = list.find(x => x.CurrencyID === type)
            return obj != undefined? obj.CurrencyCode:this.getVal('currency')
        }else{            
            return this.getVal('currency')
        }
    }
    format(event, exString?) {
        let valString = event != undefined ? event.target.value : exString!=undefined?exString:''
        if (!valString) {
            return '';
        }
        let val = valString.toString();
        const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
        let rt = parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
        return rt != undefined?rt:'';        
    };

    unFormat(val) {
        if (!val) {
            return '';
        }
        val = val.replace(/^0+/, '');
        if (this.GROUP_SEPARATOR === ',') {
            return val.replace(/,/g, '');
        } else {
            return val.replace(/\./g, '');
        }
    };
    getVal(key: any) {
        if (key != undefined && this.labelList != undefined) {
            key = key.replace(/-/g, '_');
            const value = this.labelList[key]
            return value != undefined ? value : '';
        }
    }
    // getVal(key: any) {
    //     if (this.labelList.length > 0 && key !=undefined) {
    //        var k = key
    //        const obj = this.labelList.find(x => x.TextKey === k.replace(/-/g, '_'));
    //         if (obj != undefined) {
    //             return obj.TextMessage;
    //         }else{
    //             return ''
    //         }
    //     } else {
    //         return ''
    //     }
    // }
    selCount(sel,list){
       return ' ('+((sel != undefined && sel !=''? sel.length:0)+' / '+list.length)+')'
    }
    calculateFilter(sdgShow?, SdgIDs?,esgShow?, EsgKeys?, countryShow?, CountryCodeKey?, impactThemeAreaShow?, impactThemesAndAreas?,EnablerShow?,Enablers?,FundingProviderTypeShow?,FundingProviderType?,MinimumTicketSizeShow?,MinimumTicketSize?,FundingTypeShow?,FundingType?,FundingStageShow?,FundingStage?,genderLensShow?,genderLens?) {
        let filteCnt = 0;
        if (sdgShow) {
            filteCnt = filteCnt + ((SdgIDs != undefined) ? SdgIDs.length : 0)
        }
        if (esgShow) {
            filteCnt = filteCnt + ((EsgKeys != undefined) ? EsgKeys.length : 0)
        }
        if (countryShow) {
            filteCnt = filteCnt + ((CountryCodeKey != undefined && CountryCodeKey != '') ? CountryCodeKey.length : 0)
        }
        if (impactThemeAreaShow) {
            filteCnt = filteCnt + ((impactThemesAndAreas != undefined) ? impactThemesAndAreas.length : 0)
        }
        if (EnablerShow) {
            filteCnt = filteCnt + ((Enablers != undefined) ? Enablers.length : 0)
        }
        if (FundingProviderTypeShow) {
            filteCnt = filteCnt + ((FundingProviderType != undefined) ? FundingProviderType.length : 0)
        }
        if (FundingTypeShow) {
            filteCnt = filteCnt + ((FundingType != undefined) ? FundingType.length : 0)
        }
        if (FundingStageShow) {
            filteCnt = filteCnt + ((FundingStage != undefined) ? FundingStage.length : 0)
        }
        if (MinimumTicketSizeShow) {
            filteCnt = filteCnt + ((MinimumTicketSize != undefined) ? MinimumTicketSize.length : 0)
        }
        if (genderLensShow) {
            filteCnt = filteCnt + ((genderLens != undefined) ? genderLens.length : 0)
        }
       
        
        return filteCnt;
    }

    async openAlertToken(status, message) {
        let vm = this
        if (!vm.alertPresentedToken) {
            vm.alertPresentedToken = true
            const alert = await this.alertController.create({
                message: message ? message : 'This is an alert message.',
                cssClass: 'alertAnimate',
                animated: true,
                buttons:  this.loginActionBtn(vm, status),
                backdropDismiss: false
            });
            await alert.present();
        }
    }
    loginActionBtn(vm, status) {
        let buttons = [];
        buttons.push({
            text: status == 401 ? 'Log in' : 'Ok',
            handler: () => {
                vm.alertPresentedToken = false
                if (status == 401) {
                    this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
                    this.storeReloadToken=undefined
                    this.eventService.publishFormRefresh(undefined)
                    this.userData = undefined;
                    this.isLogin = false
                    this.name = ''
                    this.email = ''
                    setTimeout(() => {
                        this.router.navigateByUrl(this.lng + '/auth#login', { replaceUrl: true });
                    }, 200);
                }
            }
        })
        if (this.appType != 'admin' && status == 401) {
            buttons.push({
                text: 'Explore',
                handler: () => {
                    vm.alertPresentedToken = false
                    if (status == 401) {
                        this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
                        this.storeReloadToken=undefined
                        this.eventService.publishFormRefresh(undefined)
                        this.userData = undefined;
                        this.isLogin = false
                        this.name = ''
                        this.email = ''
                        setTimeout(() => {
                            this.router.navigateByUrl(this.navicateUrl, { replaceUrl: true });
                        }, 200);
                    }
                }
            })
        }
        return buttons;
    }
    async presentAlert(title, msg, btnOk, isBack?) {
        let vm = this
        if (!vm.alertPresented) {
            vm.alertPresented = true
            const alert = await vm.alertController.create({
                //header: title,
                message: msg,
                animated: true,
                cssClass: 'alertCustomCssBtn',//alertCustomCss
                backdropDismiss: false,
                buttons: [
                    {
                        text: btnOk,
                        handler: () => {
                            vm.alertPresented = false
                            if (isBack)
                                this.backPage();
                        }
                    }
                ]
            });
            await alert.present();
        }
    }
    backPage() {
        this.location.back()
    }
    getData(id) {
        return localStorage.getItem(id);
    }
    async removeItem(key) {
        localStorage.removeItem(key);
        // this.dataStorage.create().then((data) => {
        //     this.dataStorage.remove(key);
        // });
    }
    Share(){
        let postData = new FormData();

        postData.append("ShareUrl",window.location.href);
        postData.append('LanguageCode', this.lng)
        postData.append('application', this.appType)

        let share=this.getVal('share');
        let twitter=this.getVal('twitter');
        let facebook=this.getVal('facebook');
        let linkedin=this.getVal('linkedin')  
        this.http.post(environment.BaseUrl + 'share/add', postData, {  headers: { 'skip': 'false' } }).subscribe(async response => {
            let res: any = response;
            const modal = await this.modalController.create({
                component: ShareComponent,
                cssClass: "modal-share",
                componentProps: { value: { ShareUrl:res.data.ShareLink,share:share,twitter:twitter,facebook:facebook,linkedin:linkedin },store:this },
            });
            await modal.present();
            await modal.onDidDismiss().then(() => {

            });
        });
    }
    searchToObject(data?) {
        if (this.PLATFORMID) {
            let urlm = (data !=undefined?data:window.location.search).replace(/\+/g, '%20')
            let url = urlm.replace(/&amp;/g, "&"); //replace(/\+/g, '%20')
            var pairs = url.substring(data !=undefined?0:1).split("&"), obj: any = {}, pair, i;
            for (i in pairs) {
                if (pairs[i] === "") continue;
                pair = pairs[i].split("=");
                obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return obj;
        } else {
            return {};
        }
    }
    
    navigatePage(path,fregment?,state?,qParam?,replaceUrl?){
        let navigationExtras:NavigationExtras =  {
            queryParams:qParam!=undefined?qParam:(this.searchToObject().length === 0)?null:this.searchToObject(),
        }
        if(fregment != undefined && fregment !='')
        navigationExtras.fragment = fregment
        if(state != undefined && state !='')
        navigationExtras.state = state
    
        if(replaceUrl != undefined)
        navigationExtras.replaceUrl=replaceUrl
        this.router.navigate(path,navigationExtras);
    }
    setGetParameter(paramName, paramValue,isRemove?)
    {
        var urlL = window.location.href;
        const url = new URL(urlL);
        if(isRemove == undefined || !isRemove){          
            url.searchParams.set(paramName, paramValue);
        }
        else{
            let params = new URLSearchParams(url.search);
            url.searchParams.delete(paramName);
            params.delete(paramName);
        }
        window.history.replaceState(null, '', url.toString());
    }
    getSetParmsVal(val: any) {
        return val.replace('&','-and-')
    }
     
    getParameter(paramName, paramValue, isRemove?) {
        if(this.PLATFORMID){
            var urlL = window.location.href;
            const url = new URL(urlL);
            if (isRemove == undefined || !isRemove) {
                if(url.searchParams.get(paramName))
                url.searchParams.delete(paramName)
                url.searchParams.set(paramName, paramValue);
            }
            else {
                let params = new URLSearchParams(url.search);
                url.searchParams.delete(paramName);
                params.delete(paramName);
            }
            return url.search;
        }else{
            return ''
        }
    }
    getDetailsParameters() {
        if(this.PLATFORMID){
            var urlL = window.location.href;
            const url = new URL(urlL);
            return url.search;
        }else{
            return ''
        }
    }
    getParameters(urlT) {
        return urlT.replace('?','');
    }
    checkPermissionObj(list, key: any,isSkip?) {
        if (list != undefined && isSkip == undefined){
            if (list.length > 0)
                return list.find(x => x.TextKey === key);
        }else{
            return isSkip;
        }
    }
    checkPermission(list, key: any) {
        if (list != undefined && list.OnCardPermissionData != undefined){         
            let data = JSON.parse(list.OnCardPermissionData)        
            if (data.length > 0){
                return data.find(x => x.TextKey === key);
            }
        }
        return false
        // return this.appType== 'front'?false:true;        
    }
    
    async showToast(msg: any, time: number, cls?: String,position?) {
        // position == undefined?'bottom':'middle'
        const toast = await this.toastController.create({
            // cssClass: position =='middle'?'toast-class-block-middle error' :cls != undefined ? "toast-class-block error" : "toast-class-block",
            cssClass: cls != undefined ? "toast-class-block error" : "toast-class-block",
            message: msg,
            duration: time,
            // position:position
        });
        toast.present();
    }

    headerAction(event) {
        if (event != undefined) {
            if (event.page == 'login'){
                this.navigatePage(['/auth'],event.page)
            }
            else if (event.page == 'my-profile'){
                this.navigatePage(['/user'],'my-profile')
            }
            else if (event.page == 'explore') {
                // this.Explore();
            }
            else if (event.page == 'home') {
                // this.router.navigateByUrl(this.navicateUrl);
                let val =(this.navicateUrl).split('#')
                this.navigatePage([val.length>0?val[0]:''],val.length>1?val[1]:'')
            }
            // this.Home();
            else if (event.page == 'notification')
                this.router.navigateByUrl('/notification');
            else if (event.page == 'recommend') {
            }
        }
    }
    headerActionAdmin(event) {
        if (event != undefined) {
            if (event.page == 'login'){
                this.navigatePage(['auth'],event.page)
            }
            else if (event.page == 'my-profile'){
                this.navigatePage(['user'],'my-profile')
            }
            else if (event.page == 'explore') {

                // this.Explore();
            }
            else if (event.page == 'home') {

                // this.Home();
            }
            else if (event.page == 'notification')
                this.router.navigateByUrl('/notification');
            else if (event.page == 'recommend') {
                
            }
        }
    }

    async presentLogout(message, btnYes, btnNo) {
        const alert = await this.alertController.create({
            message: message,
            animated: true,
            cssClass: 'alertAnimate',
            buttons: [
                {
                    text: btnNo ? btnNo : this.getVal('cancel'),
                    role: 'cancel',
                    handler: () => {

                    }
                },
                {
                    text: btnYes ? btnYes : this.getVal('yes'),
                    handler: () => {
                        localStorage.clear();
                        this.router.navigateByUrl('/login', { replaceUrl: true });
                    }
                }
            ], backdropDismiss: true
        });
        return await alert.present();
    }

    explorePath() {
        let action = 'enablers';
        return (this.appType == 'admin' ? ('/admin#dashboard') : ('/explore/' + action));
    }
    openPage(path: string,openFront:string,slug?,pagePath?) {
        let val =path.split('#')
        let urlp1 =val.length>0?val[0]:''
        let nSplt = urlp1.split('?')
        let urlp2 = this.getParameters(nSplt.length>1?nSplt[1]:'');
        let param =this.searchToObject(urlp2);
        
        this.navigatePage([nSplt[0]],val.length>1?val[1]:undefined,{Slug: slug != undefined ? slug : '',pagePath:pagePath},param)
    }
    openFPath(pageType, prod,isNew?) {
        let pType = pageType =='enablers'?'enabler':(pageType=='fundraise-needs' ||pageType=='fundraise-need' ||pageType=='fundraise-needs-submitted')?'fundraise-need':'funding-profile'
        let slug = pType=='enabler'?prod.EnablerSlug:pageType=='fundraise-need'?prod.FundraiseSlug != undefined?prod.FundraiseSlug:prod.FN_EnablerSlug:pageType=='funding-profiles-submitted'?prod.FP_EnablerSlug:pageType=='fundraise-needs-submitted' || pageType =='fundraise-needs'?prod.FN_EnablerSlug:prod.ProfileSlug != undefined?prod.ProfileSlug:prod.FP_EnablerSlug
        let action = pType=='enabler'?'overview':(pageType=='fundraise-needs' || pageType=='fundraise-need' ||pageType=='fundraise-needs-submitted')?'fundraise-form':'profile-form'
        return (isNew==undefined? environment.redirectFrontPath:'') + pType + '/' + slug +'/' +action
    }
    openFrontPath(pageType, prod,isNew?) {
        this.openFrontPage(this.openFPath(pageType, prod,isNew))
    }
    openFrontPage(path,IsSelf?) {
        window.open(path, (IsSelf != undefined && IsSelf) ? '_self' : '_blank')
    }
    titleCntWithPage(pageName, extr?,datas?) {
        var titl;
        if(pageName != undefined && pageName !='' && extr !=undefined ){
            titl = pageName + ' : '+extr+ ' | Funder'
        }else if(pageName != undefined && pageName !=''){
            titl = (pageName + ' | Funder')
        }
        // var titl = ((pageName != undefined && pageName !=''?(pageName + (extr == undefined?' | ':' : ') + (extr !=undefined?extr+' | ':'')):'')+'Funder')
        // console.log('titleCntWithPage 0 ',pageName,extr)
        // console.log('titleCntWithPage 1 ',titl)
        this.callAnalitics(titl,datas)
        this.titleService.setTitle(titl)
        this.pageTittle=titl;
    }
    callAnalitics(titl: string, datas: any) {
        let EnablerName = (datas != undefined && datas.EnablerName != undefined)?datas.EnablerName:'Funder'
        let EnablerID = (datas != undefined && datas.EnablerID != undefined)?datas.EnablerID:''
        let Obj:any ={enabler_id:'',enabler_name:'',fp_enabler_id:'',fn_enabler_id:''}
        Obj.enabler_id = EnablerID
        Obj.enabler_name = EnablerName
        if(datas != undefined){
            Obj.fp_enabler_id =datas.R_FP_EnablerID != undefined?datas.FPReferenceCode != undefined?datas.FPReferenceCode:datas.ReferenceCode :''
            Obj.fn_enabler_id =datas.R_FN_EnablerID != undefined?datas.FNReferenceCode != undefined?datas.FNReferenceCode:datas.ReferenceCode:''
        }
        if(this.PLATFORMID)
        gAnalytics(titl, this.appType.replace('_', " "), this.router.url,Obj)
    }
    updateMetaData(type: string, datas: any,from?) {
        let name = "", description = "",url = "",logo = ""
        if(type == 'fundraise-needs' || type == 'fundraise-need' ||  type == 'fundraise'){
            if(from =='details'){
                name =  datas.EnablerName +", "+datas.ReferenceCode+" | "+datas.CompanyName
                description =  this.getVal('raising')+" "+datas.TotalRaise+" "+datas.CurrencyCode+" "+this.getVal('at')+" "+datas.FundingStage+" "+this.getVal('stage_in')+" "+datas.FundingType+" "+this.getVal('investment')+" ("+datas.CountriesOfIncorporation+")"
            }else{
                name = datas.EnablerName
                description = datas.ShortDescription !=undefined?datas.ShortDescription:''
            }
        }else if(type =='funding-profile' || type =='funding-profiles'){
            if(from =='details'){
                name =  datas.EnablerName +", "+datas.ReferenceCode+" | "+datas.ProfileName
                description = datas.FundingProviderType+" "+this.getVal('is_looking_for_opportunities_to_invest')+" " +datas.TicketSizePerFunding+" ("+this.getVal('in')+" "+datas.FundingType+")"
             }else{
                name = datas.EnablerName
                description = datas.ShortDescription !=undefined?datas.ShortDescription:''
             }
        }else if(type =='enabler' || type =='enablers'){
            name = datas.EnablerName
            description = datas.ShortDescription !=undefined?datas.ShortDescription:''
        }else if(type =='contact-us' || type =='contact_us'){
            name = datas.ContactName
            description = datas.ShortDescription !=undefined?datas.ShortDescription:''
        }else if(type =='add-investees' || type =='add-investor'){
            name = datas.ContactName
            description = datas.ShortDescription !=undefined?datas.ShortDescription:''
        }else if(type =='plans_and_pricing'){
            name = datas.pTitle
            description = datas.ShortDescription !=undefined?datas.ShortDescription:''
        }else if(type =='impact-funding-resources'){
            name = datas.Title
            description =(datas.FundingProvider != undefined?' '+datas.FundingProvider+' ':'')+(datas.FundingResourceType != undefined?datas.FundingResourceType+' ':'')+datas.ShortDescription !=undefined?datas.ShortDescription:''
        }else{
            name = datas.pTitle
            description = datas.ShortDescription !=undefined?datas.ShortDescription:''
        }
        logo = datas.EnablerLogo !=undefined && datas.EnablerLogo !=''?datas.EnablerLogo :environment.social_logo;
        url = ((environment.redirectMain.substring(0,environment.redirectMain.length-1)))+this.router.url;
        this.metaService.updateTag({name:'title',  property: 'og:title', content: name });
        if(description != '') {
            this.metaService.updateTag({name:'description', property: 'description', content: description });
            this.metaService.updateTag({name:'og_description', property: 'og:description', content: description });
        }else{
            this.metaService.removeTag('description');
            this.metaService.removeTag('og_description');
        }
        this.metaService.updateTag({name:'url', property: 'og:url', content: url});
        this.metaService.updateTag({name:'type', property: 'og:type', content: 'website'});
        this.metaService.updateTag({name:'image',  property: 'og:image', content: logo});

        this.metaService.updateTag({name:'width',  property: 'og:image:width', content: '300'});
        this.metaService.updateTag({name:'height',  property: 'og:image:height', content: '260'});

        if(logo != '') {
            this.metaService.updateTag({name:'image:alt', property: 'og:image:alt', content: name+" "+description });
            // this.metaService.updateTag({name:'image:secure_url', property: 'og:image:secure_url', content: logo });
            // this.metaService.updateTag({name:'image:width', property: 'og:image:width', content: '200'});
            // this.metaService.updateTag({name:'image:height', property: 'og:image:height', content: '200' });
            // this.metaService.updateTag({name:'image:type', property: 'og:image:type', content: 'image/png' });
        }else{            
            
            this.metaService.updateTag({name:'image:alt', property: 'og:image:alt', content: '' });
        }

        // twitter card
        this.metaService.updateTag({name:'twitter:card',  property: 'twitter:card', content: 'summary' });
        // this.metaService.updateTag({name:'twitter:card',  property: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({name:'twitter:text:title',  property: 'twitter:text:title', content: name});
        this.metaService.updateTag({name:'twitter:title',  property: 'twitter:title', content: name });
        this.metaService.updateTag({name:'twitter:description', property: 'twitter:description', content: description });
        this.metaService.updateTag({name:'twitter:image', property: 'twitter:image', content: logo });
        if(logo != '') {
            this.metaService.updateTag({name:'twitter:image:alt', property: 'twitter:image:alt', content: name+" "+description });
        }else{
            this.metaService.updateTag({name:'twitter:image:alt', property: 'twitter:image:alt', content: ''});
        }
        this.metaService.updateTag({name:'twitter:url', property: 'twitter:url', content: url});

    }
    openAdmin() {
        window.open(environment.redirectAdmin, '_blank')
    }
    homePage(){
        if(this.appType =='admin'){
            this.router.navigateByUrl('admin#enablers');
            // window.open(environment.redirectFrontPath+'home', '_blank')
        }else{
            this.router.navigate(['home']);
        }
    }

    checkUndefined(prms: any) {
        return prms != undefined ?encodeURIComponent(prms.trim())  : '';
    }
    truncateText(text,length) {
        if (text.length <= length) {
            return text;
        }
        return text.substr(0, length) + '\u2026'
    }
}

