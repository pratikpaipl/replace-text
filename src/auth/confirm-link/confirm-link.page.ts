import { Component, NgZone,  Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from 'src/shared/StorageService';
@Component({
  selector: 'app-confirm-link',
  templateUrl: './confirm-link.page.html',
  styleUrls: ['./confirm-link.page.scss'],
})
export class ConfirmLinkPage implements OnInit {

  pageTitle = 'Resend confirmation link'
  loadMsg: any = "";
  dataAction: any = [];

  email: any = "";
  from: any = "";
  emailErr: any = "";

  public PLATFORMID: any;
  constructor(@Inject(PLATFORM_ID) platformId: any,public apiService: ApiService, private zone: NgZone, public store: StorageService,  private route: ActivatedRoute, public router: Router) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.from = this.route.snapshot.paramMap.get('from')
    this.email = localStorage.getItem('ResendEmail') != undefined && localStorage.getItem('ResendEmail') != '' ? localStorage.getItem('ResendEmail') : '';
    const $this = this;
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      $this.zone.run(() => {
        if (action == 'log_in') {
          $this.login();
        }
      });
    });
  }
  ngOnInit(): void {
    this.store.titleCntWithPage(this.pageTitle);
  }
  login() {
    this.router.navigateByUrl('/auth#login', { skipLocationChange: true });
  }
  forgotPassword() {
    this.router.navigateByUrl('/forgot-password');
  }
  signup() {
    this.router.navigateByUrl('/auth#signup', { skipLocationChange: true });
  }

  ionViewWillLeave() {
    this.loadMsg = ''
    localStorage.removeItem('ResendEmail');
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
      this.apiService.resendConfirmationEmail(postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          localStorage.removeItem('ResendEmail')
          this.store.saveData('altMsg', res, true)
          this.router.navigateByUrl('/message/confirm-email');
        } else {
          localStorage.setItem('lEmail', this.email);
          this.loadMsg = res.message.replace(/\+/g, ' ')
          if (res.data.Actions != undefined)
            this.dataAction = res.data.Actions
        }
      });
    }
  }

}
