import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { CookieService } from "ngx-cookie-service";
import { EventService } from 'src/shared/EventService';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  loadMsg: any = "";
  dataAction: any = [];
  permissions = []
  pageType = 'change-password'

  pageTitle = 'Change Password'
  cpassword = ''
  password = ''
  forgot_password: any = "";
  isCPasswordUn = false
  cPassErr = ''
  isPasswordUn = false
  passErr = ''

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  passwordNType: string = 'password';
  passwordNIcon: string = 'eye-off';

  constructor(public store: StorageService, private cookieService: CookieService, public apiService: ApiService, public router: Router, private eventService: EventService) {}

  hideCShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  hideShowPassword() {
    this.passwordNType = this.passwordNType === 'text' ? 'password' : 'text';
    this.passwordNIcon = this.passwordNIcon === 'eye-off' ? 'eye' : 'eye-off';
  }


  ngOnInit() {
    this.store.titleCntWithPage('Change Password');
  }

  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  async callAction(event) {
    if (event == 1) {
      this.submit()
    } else {
      this.store.backPage();
    }
  }
  ionViewWillEnter() {
    this.cpassword = ''
    this.password = ''
    this.loadMsg = ''
  }
  submit() {
    this.isCPasswordUn = false
    this.isPasswordUn = false
    if (this.cpassword.trim().length < 6) {
      this.isCPasswordUn = true
      this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
    }
    if (this.password.trim().length < 6 || this.store.hasWhiteSpace(this.password)) {
      this.isPasswordUn = true
      this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
    }
    if (this.cpassword.trim().length>1 && (this.cpassword == this.password)) {
      this.isPasswordUn = true
      this.isCPasswordUn = true
      this.loadMsg = this.store.getVal('current_password_and_new_password_cannot_be_same')
    }
    if (this.isCPasswordUn || this.isPasswordUn) {

    }
    else {
      let postData = new FormData();
      postData.append("Email", this.store.userData.UserData.Email);
      postData.append("OldPassword", this.cpassword);
      postData.append("NewPassword", this.password);
        this.apiService.changePassword(postData).subscribe(async response => {
          let res: any = response;         
          if (res.success) {
            this.store.showToast(res.message, 2000);
            this.store.isLogin = false
            // this.store.loginToken = undefined
            this.cookieService.delete(environment.cookiesKey, '/',environment.cookiesDomain);

            this.store.userData = undefined;
            localStorage.clear();
            await this.eventService.publishFormRefresh(undefined);
            this.store.name = ''
            this.store.email = ''
            this.cpassword = ''
            this.password = ''
            this.loadMsg = ''
            this.router.navigateByUrl('/auth#login', { replaceUrl: true });
          } else {
            this.loadMsg = res.message.replace(/\+/g, ' ')
            if (res.data.Actions != undefined)
              this.dataAction = res.data.Actions
          }
        });

    }
  }
}
