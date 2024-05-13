import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';
import { Location } from '@angular/common'
import { EventService } from 'src/shared/EventService';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  permissions = []
  pageType = 'my-profile'
  email: any = "";
  password: any = '********';
  loadMsg: any = ''
  languageList = []
  genderList = []
  dataAction = []

  isRemember = true;
  isShowUp = false;
  isEditFn = false;
  isEditLn = false;
  isEditGen = false;
  isEditLg = false;
  fname: any = "";
  lname: any = "";
  Gender: any = "male";

  isLnameUn = false
  isFnameUn = false
  isLngUn = false
  isGenUn = false
  isPasswordUn = false
  passErr = ''
  emailErr = ''
  fnameErr = ''
  lnameErr = ''


  userData: any = {}
  langSelect: any = "";
  langGender: any = "";
  LanguageID: any = "";
  OldLanguageID: any = "";
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  public selectedSegment: string = '';
  public selectedSegmentLbl: string = '';


  constructor( private location: Location, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService,) {
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  callPullRefresh(event){
    if (event != undefined && event.reload) {
      this.getProfile();
    }
  }
  ngOnInit(): void {
    this.getProfile();
  }
  getProfile() {
    let postData = new FormData();
    setTimeout(() => {
      this.apiService.getProfile(postData).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.userData = res.data.UserData;
          this.email = this.userData.Email;
          this.fname = this.userData.FirstName;
          this.lname = this.userData.LastName;
          this.Gender = this.userData.Gender != undefined ? this.userData.Gender : 'prefer_not_to_say';
          this.OldLanguageID = this.userData.OldLanguageID;
          this.LanguageID = this.userData.LanguageID;
          this.callLangualge();
          this.callGender();

        }
      });
    }, this.store.isApiCalled);
  }
  languageChange(event) {

  }

  edit(type) {
    if (type == 'FirstName' && this.isEditFn) {
      this.isEditFn = false
    } else if (type == 'LastName' && this.isEditLn) {
      this.isEditLn = false
    } else if (type == 'LanguageID' && this.isEditLg) {
      this.isEditLg = false
    } else if (!this.isEditFn || !this.isEditLn || !this.isEditLg) {
      this.save(type)
    }
  }

  save(type) {
    this.isFnameUn = false
    this.isLnameUn = false
    this.isGenUn = false
    this.isLngUn = false
    this.loadMsg = ''
    if (this.store.checkMail(this.email)) {
      this.emailErr = this.store.getVal('please_enter_valid_email')
    }
    if (this.fname.trim() == '') {

      this.isFnameUn = true
      this.fnameErr = this.store.getVal('first_name_must_be_require_minimum_one_character')
    }


    // if (this.Gender == undefined || this.Gender.length == 0) {
    //   this.isGenUn = true;
    //   if (!isCall)
    //     this.store.scrollTo('Gender');
    //   isCall = true;
    // }
    // if (this.langSelect == undefined || this.langSelect.length == 0) {
    //   this.isLngUn = true;
    //   if (!isCall)
    //     this.store.scrollTo('language');
    //   isCall = true;
    // } else {
    //   var obj = this.languageList.filter(data => data.LanguageCode == this.langSelect)
    //   this.LanguageID = obj != undefined ? obj[0].LanguageID : this.languageList[0].LanguageID;

    // }

    if (!this.isFnameUn)// && !this.isLngUn && !this.isGenUn)
      this.callUpdate(type);
    else
      this.loadMsg = this.store.getVal('changes_not_saved_since_required_information_missing');
  }

  async callAction(event) {
    if (event == 1) {
      this.save('')
    } else {
      this.store.backPage();
    }
  }

  callUpdate(type: any) {
    let postData = new FormData();
    postData.append("Email", this.email);
    postData.append("FirstName", this.fname != undefined ? this.fname.trim() : '');
    postData.append("LastName", this.lname != undefined ? this.lname.trim() : '');
    postData.append("LanguageID", this.LanguageID != undefined ? this.LanguageID : '');
    postData.append("Gender", this.Gender);
    this.apiService.updateUserProfile(postData).subscribe(async response => {
      let res: any = response;
      if (res.success) {
        if (type == 'FirstName') {
        } else if (type == 'LastName') {
        } else if (type == 'LanguageID') {
        }
        this.store.setDataStore(response,'profile')
        if (res.data.UserData.LanguageID != this.OldLanguageID) {
          this.changePath(res.data.UserData.LanguageCode)
          this.eventService.publishUpdateLng(res.data.UserData.LanguageCode)
          this.eventService.publishFormRefresh(res.data.token.token);
        }
        this.store.showToast(res.message, 2000);
      } else {
        this.store.showToast(res.message, 2000, 'error');
        this.router.navigateByUrl(this.store.navicateUrl);
      }
    });
  }
  changePath(len) {
    var href = this.router.url;
    this.store.lng = len;
    var oldLng = this.location.path().split('/').splice(this.location.path().split('/').indexOf(this.location.path().split('/')[1]), 1, this.store.lng)[0]
    var newLng = this.store.lng
    var newPath = href //this.store.replaceAll(href, oldLng, newLng);

    this.router.navigateByUrl(newPath, { replaceUrl: true });
  }

  callLangualge() {
    // this.apiService.languageList().subscribe(response => {
    //   let res: any = response;
    //   if (res.success) {
    //     this.languageList = res.data.list;
    //     var obj = this.languageList.filter(data => data.LanguageID == this.LanguageID)
    //     this.langSelect = obj != undefined ? obj[0].LanguageCode : this.languageList[0].LanguageCode;
    //   } else {
    //     this.store.showToast(res.message, 2000, 'error');
    //     this.router.navigateByUrl(this.store.navicateUrl);
    //   }
    // });
  }
  callGender() {
    // this.apiService.referenceList('gender').subscribe(response => {
    //   let res: any = response;
    //   if (res.success) {
    //     this.genderList = res.data.list;
    //     var obj = this.genderList.filter(data => data.ReferenceKey == this.Gender)
    //     this.Gender = obj != undefined ? obj[0].ReferenceKey : this.genderList[0].ReferenceKey;
    //   } else {
    //     this.store.showToast(res.message, 2000, 'error');
    //     // this.router.navigateByUrl(this.store.navicateUrl);
    //   }
    // });
  }
  updateScroll(event) {

  }
}
