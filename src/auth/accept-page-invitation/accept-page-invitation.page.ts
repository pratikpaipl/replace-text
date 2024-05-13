import { EventService } from 'src/shared/EventService';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { AuthenticationService } from 'src/services/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-accept-page-invitation',
  templateUrl: './accept-page-invitation.page.html',
  styleUrls: ['./accept-page-invitation.page.scss'],
})
export class AcceptInvitationPage implements OnInit {

  pageTitle = 'Invitation'
  email: any = "";
  page: any = "";
  from: any = "";
  loadMsg: any = '';
  isLoad: any = true;
  nmAr:any
  dataAction = []
  isError=false
  redirectPageTime = 1000
  pageUrl:any
  public PLATFORMID: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService, public apiService: ApiService, private route: ActivatedRoute, private cookieService: CookieService, public router: Router, private eventService: EventService) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.page = this.route.snapshot.paramMap.get('page')
    this.from = this.route.snapshot.paramMap.get('from')
    this.pageUrl=store.navicateUrl;
    // this.eventService.publishFormShowContact(false);
  }

  ngOnInit() {
    this.isLoad=true
    this.store.titleCntWithPage(this.page=='payment-status'?'payment':this.pageTitle);
    if(this.PLATFORMID){
      this.submit();
    }
  }
  submit() {
    let postData = new FormData();
    if(this.page=='update_new_email'){
      postData.append('NewEmailKey', this.from);
    }else if(this.page=='confirm_email'){
      postData.append('EmailActivationKey', this.from);
    }else if(this.page=='payment-status'){
      postData.append('TransactionLogID', this.from);
    }else if(this.page=='accept_page_invitation'){
      postData.append('InvitationKey', this.from);
    }
    else if(this.page=='confirm-investee' || this.page=='confirm-investor'){
      postData.append('ConfirmKey', this.from);
    }
    else{
      postData.append("ConfirmKey", this.from);
    }
      if(this.page =='confirm_email'){
        this.apiService.confirmAuthEmail(postData).subscribe(async response => {
          let res: any = response;
          if (res.success) {
            if (res.data.Url != undefined && res.data.Url != '') {
              this.router.navigateByUrl('/admin'+res.data.Url, { replaceUrl: true })
            } else {
              localStorage.setItem('inviteMsg', res.message)
              localStorage.setItem('lEmail', res.data.Email != undefined?res.data.Email:'')
              localStorage.setItem('IsSignin', '1')
              this.router.navigateByUrl('/auth#login', { replaceUrl: true });
            }
          } else {
            this.dataAction = res.data.Actions
            this.loadMsg = res.message
            this.isError= res.success
            this.isLoad =false
          }
        });
      }else if(this.page=='accept_page_invitation'){
        this.apiService.confirmPageInvitation(postData).subscribe(response => {
          let res: any = response;
          this.isError= res.success
          if (res.success) {
            this.loadMsg = res.message;
            this.store.lng = res.data.UserData !=undefined?res.data.UserData.LanguageCode: res.data.requestLang
            setTimeout(() => {
              if (res.data.Url != undefined && res.data.Url != '') {
                this.router.navigateByUrl(res.data.Url, { replaceUrl: true })
                this.store.showToast(this.loadMsg, 4000);
              } else {
                this.router.navigateByUrl(this.store.navicateUrl, { replaceUrl: true });
              }
            }, this.redirectPageTime); //2000
          } else {
              if (res.data != undefined && ((res.data.IsSignup != undefined && res.data.IsSignup == 1) || (res.data.IsSignin != undefined && res.data.IsSignin == 1))) {
              this.store.saveData('PageID', '');
              this.store.saveData('PageType', res.data.PageTypeKey);
              this.store.saveData('PageEmail', res.data.Email);
              this.store.saveData('PageName', res.data.PageName);
              localStorage.setItem("InvitationKey", this.from);
              localStorage.setItem('PageSlug', res.data.PageSlug);
              localStorage.setItem('IsPageOwner', res.data.IsPageOwner);
              localStorage.setItem('IsPageAdmin', res.data.IsPageAdmin);
              setTimeout(() => {
                if (res.data.Url != undefined){
                  this.store.showToast(res.message,4000)
                  this.router.navigateByUrl(res.data.Url, { replaceUrl: true });
                }
                else{
                  if((res.data.IsSignup != undefined && res.data.IsSignup == 1)){
                    this.store.saveData('IsSignup', res.data.IsSignup );
                    this.router.navigateByUrl('/auth#signup', { replaceUrl: true });
                  }
                  else{
                    this.store.saveData('IsSignin', res.data.IsSignin );
                    this.store.saveData('PageEmail', res.data.Email);
                    this.router.navigateByUrl('/auth#login', { replaceUrl: true });
                  }
                }
              }, this.redirectPageTime);
            } else {
              this.store.removeItem('PageID');
              this.store.removeItem('PageType');
              this.store.removeItem('PageEmail');
              this.store.removeItem("InvitationKey");
              this.store.removeItem('PageSlug');
              this.isLoad=false
              this.loadMsg = res.message
            }
          }
        });
      }else if(this.page=='payment-status'){
        this.apiService.update('stripe','update_payment_status',postData,).subscribe(response => {
          let res: any = response;
          this.isError= res.success
          if (res.success) {
            setTimeout(() => {
              this.store.showToast(res.message,4000)
              if (res.data.Url != undefined && res.data.Url != '') {
                let url = res.data.Url.replace(window.location.origin,'')
                this.pageUrl=url
                this.router.navigateByUrl(url, { replaceUrl: true })
              } else {
                this.pageUrl=this.store.navicateUrl
                this.router.navigateByUrl(this.store.navicateUrl, { replaceUrl: true });
              }
            }, this.redirectPageTime);
          } else {            
              this.isLoad=false
              this.loadMsg = res.message            
          }
        });
      }else if(this.page=='update_new_email'){
        this.apiService.updateNewEmail(postData).subscribe(async response => {
          let res: any = response;
          this.isError= res.success
          if (res.success && this.cookieService.check(environment.cookiesKey)) {
            this.isLoad=false
            this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);
            this.store.isLogin =false
            this.store.name = ''
            this.store.email = ''
            this.store.AdminAccess = false
            this.store.IsSystemAdmin = false;
            this.eventService.publishFormRefresh(undefined);
            if(res.data !=undefined && res.data.Email != undefined){
              localStorage.setItem('inviteMsg', res.message)
              localStorage.setItem('PageEmail', res.data.Email)
              this.router.navigateByUrl(this.store.lng + '/auth#login', { replaceUrl: true });
            }
          } else {
            this.isLoad=false
            this.dataAction = res.data.Actions
            this.loadMsg = res.message.replace(/\+/g, ' ')
          }
        });
      }else if(this.page=='confirm-investee' || this.page=='confirm-investor'){
        const controller = this.page=='confirm-investor' ? 'funding_profile' : 'fundraise';
        const endpoint = this.page=='confirm-investor' ? 'confirm_investor' : 'confirm_investee';
        this.apiService.update(controller,endpoint,postData).subscribe(response => {
          let res: any = response;
          this.isError= res.success
          this.dataAction = res.data.Actions
          this.isLoad=false
          this.loadMsg = res.message
        });
      }else{
        let st = JSON.parse(JSON.stringify({path:this.page})).path;
        this.nmAr = this.page.split('-');
        let endPoint =st.replace(this.nmAr[0]+'-','')
        this.apiService.confirmEmail(endPoint.replace('-','_'), this.nmAr[0], postData).subscribe(response => {
          let res: any = response;
          this.isError= res.success
          this.dataAction = res.data.Actions
          this.isLoad=false
          this.loadMsg = res.message
        });
      }
  }
}