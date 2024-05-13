import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';
import { LoadingService } from '../LoaderService';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoadingInterceptorService {
    
    //  token:any;
    // userData: any;
    public alertPresentedToken: any;
    PLATFORMID:any=false
    activeRequests: number = 0;
    header: any;
    appType = ''
    navicateUrl=''
    altMsg = 'You do not have an Internet connection.<br/> Please check your connection status'
    altMsgServer = 'Sorry, something went wrong. Please try again later'
    expTime:any = 1000*60
    constructor( @Inject(PLATFORM_ID) platformId: any,private cookieService: CookieService, private loadingScreenService: LoadingService,public eventService:EventService, public router: Router, public network: Network,public alertController: AlertController) {
        this.PLATFORMID = isPlatformBrowser(platformId)
    }
    setNavigateUrl() {
        const url = this.PLATFORMID ? window.location.host : '';
        if (url.includes('admin.funder.pi2.life') || url.includes('localhost:8104') || url.includes('localhost:8004') || url.includes('dev.admin.funder.pi2.life')) {
          this.navicateUrl = 'admin#dashboard';
          this.appType = 'admin';
        } else if (url.includes('funder.pi2.life') || url.includes('test.funder.pi2.life') || url.includes('localhost:2030') || url.includes('localhost:8105') || url.includes('localhost:8005') || url.includes('dev.funder.pi2.life')) {
          this.navicateUrl = 'explore' + this.getSeprater() + 'enablers';
          this.appType = 'front';
        }
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.activeRequests++;
        if (!this.isOnline()) {
            return throwError(this.createConnectivityError());
        }
        this.startLoading();
        // if (!request.headers.get('skip')) {
        // }
        const modifiedRequest = this.modifyRequest(request);
        return next.handle(modifiedRequest).pipe(
            timeout(this.expTime),
            map((event: HttpEvent<any>) => this.handleResponse(event)),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
            finalize(() => this.finalizeRequest())
            );
        }
        private isOnline(): boolean {
            return this.PLATFORMID?window.navigator.onLine:true;
        }
        private createConnectivityError(): HttpErrorResponse {
            return new HttpErrorResponse({
                status: 0,
                error: {
                    description: 'Check Connectivity!',
                    message: this.altMsg
                },
                statusText: 'Check Connectivity!'
            });
        }
        private startLoading(): void {
            // Call your loading service to start loading
            this.loadingScreenService.startLoading();
        }
        private modifyRequest(request: HttpRequest<any>): HttpRequest<any> {
            let token = this.getToken();
            let headers = {
                'pi2life_api_key': environment.apiKey,
                'Access-Control-Max-Age': '10'
            };
            if (token) {
                headers['Authorization'] = 'Bearer ' + token;
            }
            return request.clone({
                setHeaders: headers,
                reportProgress: true,
                withCredentials: false
            });
        }    
      private getToken(): string | undefined {
        if (this.cookieService.check(environment.cookiesKey)) {
          let res = this.getReponseData(this.cookieService.get(environment.cookiesKey));
          return res?.data?.token?.token;
        }
        return undefined;
      }
      private handleResponse(event: HttpEvent<any>): HttpEvent<any> {
        if (event instanceof HttpResponse) {
            let token=undefined
            if((event.url.includes('admin_role/confirm_page_access_invitation') || event.url.includes('auth/login') || event.url.includes('auth/signup') ||  event.url.includes('auth/update_new_password')) && ( event.body != undefined && event.body != '' && ( event.body.success != undefined &&  event.body.success == true))){
                token =  event.body.data.token != undefined &&  event.body.data.token != ''? event.body.data.token:undefined
                if( event.body.data.UserData != undefined){
                    this.setDataStore( event.body,'inter-cepter')
                    this.eventService.publishFormRefresh(event.body.data.token.token)
                }
            }
            if((event.url.includes('auth/logout'))&& event.body.success){
                this.eventService.publishFormRefresh(undefined)
                if(this.PLATFORMID){
                    this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
                }
            }
        }
        return event;
      } 
      public handleError(error: HttpErrorResponse): Observable<never> {
        switch (error.status) {
            case 401:
                this.openAlertToken(error.status, error.error.message);
                break;
            case 400:
            case 404:
                this.handleClientError(error);
                break;
            case 0:
                return throwError(new HttpErrorResponse({
                    status: 0,
                    error: {
                        description: 'Check Connectivity!',
                        message: this.altMsg,
                    },
                    statusText: 'Check Connectivity!'
                }));
            case 500:
                this.handleServerError(error);
                break;
            default:
                this.handleUnknownError(error);
        }
        return throwError(error);
    }
    
    private handleClientError(error: HttpErrorResponse): void {
        this.loadingScreenService.stopLoading();
        if (!error.headers.get('isToast')) {
            if (this.PLATFORMID) {
                localStorage.setItem('eventContent', JSON.stringify(error.error));
                this.router.navigateByUrl('/error', { replaceUrl: true });
            }
        }
    }
    
    private handleServerError(error: HttpErrorResponse): void {
        if (this.PLATFORMID) {
            localStorage.setItem('eventContent', JSON.stringify(error != undefined ? { message: error.error } : error));
            this.router.navigateByUrl('/error', { replaceUrl: true });
        }
    }
    
    private handleUnknownError(error: HttpErrorResponse): void {
        if (this.PLATFORMID) {
            localStorage.setItem('eventContent', JSON.stringify(error.error != undefined ? error.error : error));
            this.router.navigateByUrl('/error', { replaceUrl: true });
        }
    }
    private finalizeRequest(): void {
        this.activeRequests--;
        if (this.activeRequests === 0) {
            // Call your loading service to stop loading
            this.loadingScreenService.stopLoading();
        }
    }
    getSeprater(type?) {
        return (this.appType=='admin'?'#': type == undefined || type !='user'?'/':'#')
    }
    setDataStore(response: any, from: string) {
        let res = this.getReponseData(response);
        let time = this.convertLocalDateToUTCDate(new Date(res.data.token.ExpireDate),false); 
        this.PLATFORMID?this.cookieService.set(environment.cookiesKey, JSON.stringify(response),time,'/',environment.cookiesDomain):false;
        this.PLATFORMID?localStorage.setItem('token', res.data.token.token):false;        
        this.setNavigateUrl()
    }
    async openAlertToken(status, message) {
        let vm = this
        if (!vm.alertPresentedToken) {
            vm.alertPresentedToken = true
            const alert = await this.alertController.create({
                message: message ? message : 'This is an alert message.',
                cssClass: 'alertAnimate',
                animated: true,
                buttons: [
                    {
                        text: status == 401 ? 'Log in' : 'Ok',
                        handler: () => {
                            vm.alertPresentedToken = false
                            if (status == 401) {
                                this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
                                this.eventService.publishFormRefresh(undefined)
                                setTimeout(() => {
                                    this.router.navigateByUrl('/auth#login', { replaceUrl: true });
                                }, 200);
                            }
                        }
                    }
                ],
                backdropDismiss: false
            });
            await alert.present();
        }
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
    getReponseData(response: any) {
        // return environment.isDecript ? this.decryptData(response, environment.keyDataOrg) : response
        let data = typeof response === 'string' ? JSON.parse(response) : response;
        return data
    }
}