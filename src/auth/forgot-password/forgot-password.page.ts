import { Component, NgZone, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  loadMsg: any = "";
  dataAction: any = [];


  pageTitle = 'Forgot Password'
  email: any = "";
  emailErr: any = "";


  constructor(private zone: NgZone, public store: StorageService, public apiService: ApiService, public router: Router, private menu: MenuController, private eventService: EventService,) {

  }

  ionViewWillLeave() {
    this.loadMsg = ''
    this.email = ''
  }

  ngOnInit() {
    this.store.titleCntWithPage(this.pageTitle);
  }
  async callAction(event) {
    if (event == 1) {
      this.submit()
    } else {
      this.store.backPage();
    }
  }
  submit() {

    if (this.store.checkMail(this.email)) {
      this.emailErr = this.store.getVal('please_enter_valid_email')
    }

    if (this.store.checkMail(this.email)) {

    }
    else {
      let postData = new FormData();
      postData.append("Email", this.email);
      this.apiService.forgotPassword(postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          this.store.saveData('altMsg', res, true)
            this.router.navigateByUrl('/message/forgotpassword');
        } else {
          this.loadMsg = res.message.replace(/\+/g, ' ')
          localStorage.setItem('ResendEmail', this.email);
          if (res.data.Actions != undefined)
            this.dataAction = res.data.Actions
        }
      });
    }
  }
  resendConfirmLink() {
    this.router.navigateByUrl('/confirm-link');
  }
  login() {
    this.menu.close();
    this.router.navigateByUrl('/auth#login', { skipLocationChange: true });
  }
  signUp() {
    this.menu.close();
    this.router.navigateByUrl('/auth#signup', { skipLocationChange: true });
  }
}
