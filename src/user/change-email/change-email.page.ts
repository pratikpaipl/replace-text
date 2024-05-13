import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage implements OnInit {

  permissions = []
  loadMsg: any = "";
  dataAction: any = [];
  pageType = 'change-email'
  email: any = "";
  nemail: any = "";
  emailErr: any = "";
  nEmailErr: any = "";
  pageTitle = 'Change email'


  constructor(public store: StorageService, public apiService: ApiService, private route: ActivatedRoute, public router: Router,private cookieService: CookieService, private eventService: EventService,) {
    this.eventService.formRefresh$.subscribe(async (item: any) => {
      this.store.lng = this.store.lng;
      this.setUserData()
    });
  }
  setUserData() {
    this.store.isLogin = this.cookieService.check(environment.cookiesKey)
    if(this.store.isLogin){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      this.store.userData = datas;
      if (datas != undefined && datas.UserData != undefined)
      this.email = datas.UserData.Email
    } 
  }


  async ngOnInit() {
    this.store.titleCntWithPage('Change Email');
    this.setUserData()
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
      this.emailErr = 'Please enter a valid current email.'
    }
    if (this.store.checkMail(this.nemail)) {
      this.nEmailErr = 'Please enter a valid new email.'
    }

    if (this.store.checkMail(this.email) || this.store.checkMail(this.nemail)) {

    }
    else {

      let postData = new FormData();
      postData.append("Email", this.email);
      postData.append("NewEmail", this.nemail);
      this.apiService.changeEmail(postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          this.loadMsg = ''
          this.nemail = ''
          this.store.saveData('altMsg', res, true)
          this.router.navigateByUrl('/message/change-email');
        } else {
          this.loadMsg = res.message.replace(/\+/g, ' ')
          if (res.data.Actions != undefined)
            this.dataAction = res.data.Actions
        }
      });

    }
  }
}
