import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  loadMsg: any = "";
  dataAction: any = [];
  isError = false;
  from: any = "";
  email: any = "";
  passErr = ''
  isPasswordUn = false
  password: any = "";
  isRemember = true;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor( public store: StorageService, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private menu: MenuController, private eventService: EventService) {
    this.from = this.route.snapshot.paramMap.get('from')
  }


  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  ngOnInit() {
    this.store.titleCntWithPage('Reset Password');
    setTimeout(() => {
      this.load();
    }, this.store.isApiCalled);
  }
  load() {
    let postData = new FormData();
    postData.append("PasswordResetKey", this.from);
    this.apiService.resetPassword(postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.email = res.data.detail.Email;
        this.from = res.data.detail.NewPasswordKey;
      } else {
        this.loadMsg = res.message.replace(/\+/g, ' ')
        this.isError = true;
      }
    });

  }
  async callAction(event) {
    if (event == 1) {
      this.login()
    } else {
      this.store.backPage();
    }
  }
  login() {
    this.isPasswordUn = false
    if (this.password.trim() == '') {
      this.isPasswordUn = true
      this.passErr = this.store.getVal('please_enter_password')
    }
    if (this.password.trim().length < 6 || this.store.hasWhiteSpace(this.password)) {
      this.isPasswordUn = true
      this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
    }
    if (this.store.checkMail(this.email) || this.isPasswordUn) {

    }
    else {
      let postData = new FormData();
      postData.append("NewPassword", this.password);
      postData.append("PasswordResetKey", this.from);
      postData.append("RememberMe", this.isRemember ? '1' : '0');
        this.apiService.updateNewPassword(postData).subscribe(async response => {
           let res: any = response;
          if (res.success) {
            this.email = ''
            this.password = ''
            this.store.setDataStore(response,'re-set-pass')
            this.eventService.publishFormRefresh(res.data.token.token);
            this.store.saveData('altMsg', res, true)
              this.router.navigateByUrl('/message/reset-password');
            // });
          } else {
            this.loadMsg = res.message.replace(/\+/g, ' ')
            if (res.data.Actions != undefined)
              this.dataAction = res.data.Actions
          }
        });
    }

  }
  resendConfirmLink() {
    this.router.navigateByUrl('/confirm-link');
  }
  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  signUp() {
    this.menu.close();
    this.router.navigateByUrl('/auth#signup', { skipLocationChange: true });
  }
}
