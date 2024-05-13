import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Router } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';
import { Platform, ToastController } from "@ionic/angular";
import { ApiService } from "./api.service";
import { StorageService } from "src/shared/StorageService";
import { EventService } from "src/shared/EventService";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";

declare const browserUID
declare const $
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    PLATFORMID:any=false;
    authState = new BehaviorSubject(false);
    userDatas = new BehaviorSubject({
        UserData: undefined, token: undefined
    });

    // Init with null to filter out the first value in a guard!
    // isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    token = '';
    storageHost: any
    constructor(private router: Router,private cookieService: CookieService, @Inject(PLATFORM_ID) platformId: any,private platform: Platform,private apiService: ApiService,private eventService: EventService,private store: StorageService,public toastController: ToastController) {
        this.PLATFORMID = isPlatformBrowser(platformId)
        this.platform.ready().then(async () => {
            this.ifLoggedIn();
        });
    }
    ifLoggedIn() {
        if(this.PLATFORMID){
            this.userData()
        }
    }
    userData() {
        let datas;
        if(this.cookieService.check(environment.cookiesKey)){
            let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
            datas = res!=undefined?res.data:undefined
            this.login(datas)
            if (datas != undefined && datas.UserData != undefined) {
                this.store.email = datas.UserData.Email
                this.store.AdminAccess = datas.UserData.AdminAccess == 1
                this.store.IsSystemAdmin = datas.UserData.IsSystemAdmin == 1;
            } else {
                this.store.email = ''
                this.store.AdminAccess = false
                this.store.IsSystemAdmin = false;
            }
        }
    }
    login(response) {
        this.store.userData = response
        this.store.email = (response != undefined && response.UserData != undefined) ?this.store.userData.email:''
    }
    logout(type) {
        this.callLogout(type);
    }
    async removedata() {
        this.authState.next(false);
    }
    isAuthenticated() {
        return this.authState.value;
    }
    callLogout(from: any) {
        var postData = new FormData();
        this.apiService.logout(postData).subscribe(response => {
            let res: any = response;
            if (res.success) {
                if(this.PLATFORMID){
                    this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
                    this.store.storeReloadToken=undefined
                }
                this.store.name = ''
                this.store.email = ''
                this.store.isLogin = false
                // this.store.loginToken = undefined
                this.store.AdminAccess = false
                this.store.IsSystemAdmin = false;
                localStorage.removeItem('setLogin')
                localStorage.clear()
                this.removedata();
                this.eventService.publishFormRefresh(undefined);
                if(from != 'admin'){
                    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
                }
                this.store.setNavigateUrl()
                this.userDatas.next(undefined);
                this.router.navigateByUrl((from == 'admin' ? '/auth#login' : '/explore/enablers'), { replaceUrl: true });
            }
        });
    }
}