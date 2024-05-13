import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ApiService } from 'src/services/api.service';
import { EventService } from '../../../../shared/EventService';
import { StorageService } from '../../../../shared/StorageService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'add-user',
  templateUrl: 'add-user.page.html',
  styleUrls: ['add-user.page.scss'],
})
export class AddUserPage implements OnInit {
  
  private subscription: any;
  private subLabel: any;
  isView = false
  isDisabled = false
  
  loadMsg = ''
  dataAction: any = [];
  // loadCompanyErrorMsg = ''
  
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  
  LogoFile: any;
  LogoURl:any;
  LogoSrc:any = ""
  IsDeleteLogo:any = false
  
  isLogoUn = false
  IsFirstNameUn = false
  IsLastNameUn = false
  IsEmailUn = false
  IsEnablerConfirmation = false
  
  UserSlug:any;
  FirstName:any = ''
  LastName:any = ''
  Email:any = ''
  Password:any = ''
  
  // EnablerConfirmation = false
  
  // IsEnable = true
  IsEmailverified = true
  IsPasswordUn
  IsActive = true
  EnablerRights = false;
  emailErr=''
  passErr=''
  from: any = 'home'
  type: any = 'add'
  title: any = 'Add User'
  titl: any = '';
  isEdit=false;
  
  constructor( private route: ActivatedRoute,private cookieService: CookieService, private cdref: ChangeDetectorRef, public eventService: EventService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router) {
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {

      if(this.UserSlug != undefined && this.UserSlug != '') {
        this.title = store.getVal('edit_user_form')
      } else {
        this.title = store.getVal('add_user_form')
      }
      this.titl = this.store.getVal('pi2Life_funder') + ' | ' +  this.title
      this.setTitle();
    });
    this.UserSlug = this.route.snapshot.paramMap.get('uslug') != undefined ? this.route.snapshot.paramMap.get('uslug') : '';
    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : this.from;
    if(this.UserSlug != undefined && this.UserSlug != '') {
      this.isEdit=true
      this.isDisabled=true
      this.title = store.getVal('edit_user_form')
    } else {
      this.isEdit=false
      this.title = store.getVal('add_user_form')
    }
  }
  ngOnInit(){
    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})

    if(this.cookieService.check(environment.cookiesKey)){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.store.userData = datas
        this.store.IsSystemAdmin = datas.UserData.IsSystemAdmin == 1
        this.store.AdminAccess = datas.UserData.AdminAccess == 1
      }
    }
    Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
  ionViewWillEnter() {
    if(this.UserSlug != undefined && this.UserSlug != '') {
      this.getData('edit');
    } else {
      this.getData('add');
    }
  }
  
  customEditor(event){
    if(event !=undefined && event.varnm !=undefined){
      this[event.varnm] = event.val
    }
  }
  customSelect(event,isCreate?){
    if(event.modalName !=undefined){
      this['' + event.modalName] = event.modal
    }
    
}
  
  changeListener($event,from): void {
    let File = $event.target.files[0];
    if (File != undefined) {
      if(from == 'logo') {
        this.LogoFile = File;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.LogoSrc = event.target.result;
        }
        reader.readAsDataURL(this.LogoFile);
      }
    }
  }
    
  onDeleteFile(from) {
    if(from == 'logo') {
      this.IsDeleteLogo = true
      this.LogoSrc = ""
      this.LogoFile = undefined;
      this.LogoURl = undefined;
    }
  }
  
  getData(type) {
    this.subscription = this.apiService.getData('user', type, 'UserSlug', this.UserSlug).subscribe(async response => {
      let res: any = response;
     // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        this.isView = true

        if(res.data.detail != undefined) {
          this.setUserData(res.data.detail)
        }
        this.setTitle()
      }else{
        this.store.showToast(res.message,3000,'error')
      }
    });
  }
  setTitle(){
    this.store.titleCntWithPage(this.title);  
  }

  CreateNew(select: NgSelectComponent) {
    select.close();
  }

  setUserData(detail: any) {
    let UserData = detail;


    this.FirstName = UserData.FirstName
    this.LastName = UserData.LastName
    this.Email = UserData.Email

    // this.LogoURl = (EnablerData.EnablerLogo != null && EnablerData.EnablerLogo != '') ? EnablerData.EnablerLogo : null;
    
    this.IsActive = UserData.IsActive
    // this.IsEnable = UserData.IsEnable
    this.IsEmailverified = UserData.IsEmailverified
    // this.EnablerConfirmation = EnablerData.IsDisclaimer
  }
  
  async callAction(event, type?,ex?) {
    
    if (event == 1) {
      this.resetVar()
      let isCall = false


      if (this.FirstName == undefined || this.FirstName.trim() == '') {
        this.IsFirstNameUn = true;
        if (!isCall)
        this.store.scrollTo('FirstName');
        isCall = true
      }
      // if (this.LastName == undefined || this.LastName.trim() == '') {
      //   this.IsLastNameUn = true;
      //   if (!isCall)
      //   this.store.scrollTo('LastName');
      //   isCall = true
      // }
      if (this.store.checkMail(this.Email)) {
        this.IsEmailUn = true;
        this.emailErr = this.store.getVal('please_enter_valid_email')
        if (!isCall)
        this.store.scrollTo('Email');
        isCall = true
      }
      if(!this.isEdit){
        if (this.Password.trim() == '') {
          this.IsPasswordUn = true
          this.passErr = this.store.getVal('please_enter_password')
          if (!isCall)
          this.store.scrollTo('Password');
          isCall = true
        }
        if (this.Password.trim().length < 6 || this.store.hasWhiteSpace(this.Password)) {
          this.IsPasswordUn = true
          this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
          if (!isCall)
          this.store.scrollTo('Password');
          isCall = true
        }
      }else{
        if ((this.Password.trim().length != 0 && this.Password.trim().length < 6) || this.store.hasWhiteSpace(this.Password)) {
          this.IsPasswordUn = true
          this.passErr = this.store.getVal('password_must_be_require_minimum_five_character')
          if (!isCall)
          this.store.scrollTo('Password');
          isCall = true
        }
      }
      if (isCall) {
        this.loadMsg = this.store.getVal('please_complete_required_field');
      } else {
          this.publishUser();
      }
    } else {
      const alert = await this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.loadMsg = ''
              this.clearData()
              
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => { }
          }
        ], backdropDismiss: true
      });
      return await alert.present();
    }
  }

  async openUserConfirmationBox() {
    const alert = await this.alertController.create({
      message: this.store.getVal('save_changes'),
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.publishUser();
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }

  publishUser() {
    let postData = new FormData();
    
    postData.append("FirstName", (this.FirstName == undefined)?'':this.FirstName.trim());
    postData.append("LastName", (this.LastName == undefined)?'':this.LastName.trim());
    postData.append("Email", (this.Email == undefined)?'':this.Email.trim());
    if(this.UserSlug != undefined && this.UserSlug.trim() != '')
    postData.append("UserSlug",this.UserSlug.trim());
    if(this.Password != undefined && this.Password.trim() != '')
    postData.append("Password", this.Password.trim());

    if (this.LogoFile != undefined) {
      postData.append('UserLogo', this.LogoFile, this.LogoFile.name);
    }
    // postData.append("IsDeleteLogo", this.IsDeleteLogo ? '1' : '0');
    
    // postData.append("ConfirmAuthorised", this.EnablerConfirmation ? '1' : '0');
    postData.append("IsActive", this.IsActive ? '1' : '0');
    postData.append("IsEmailverified", this.IsEmailverified ? '1' : '0');
    // postData.append("IsEnable", this.IsEnable ? '1' : '0');
    // postData.append("DataStatus", this.DataStatus != undefined ? this.DataStatus : '');
    
    this.apiService.addData('user', postData, this.isEdit?'edit':'add').subscribe(async response => {
      let res: any = response;
      if (res.success) {
        this.clearData();
        this.store.showToast(res.message, 2000);
      } else {
        setTimeout(() => {
          this.store.scrollTo('addPage');
        }, 3000);
        this.loadMsg = res.message
      }
    });
  }

  resetVar() {
    this.isLogoUn = false
    this.IsFirstNameUn = false
    this.IsLastNameUn = false
    this.IsEmailUn = false
    this.IsPasswordUn = false
    this.IsEnablerConfirmation = false

    this.emailErr=''
    this.passErr=''
  }
  
  async presentAlert(title, msg, btnOk, isBack?) {
    const alert = await this.alertController.create({
      //header: title,
      message: msg,
      animated: true,
      cssClass: 'alertCustomCssBtn',//alertCustomCss
      backdropDismiss: false,
      buttons: [
        {
          text: btnOk,
          handler: () => {
            this.loadMsg = ''
            // this.loadCompanyErrorMsg = ''
            this.store.scrollTo('topRow');
            this.clearData();
          }
        }
      ]
    });
    await alert.present();
  }
  clearData() {
    this.resetVar();

    this.FirstName = ''
    this.LastName = ''
    this.Email = ''
    this.Password = ''
    this.store.backPage();
  }
  
  ngOnDestroy() {
    $(".tox-toolbar__group").hide();
    this.subLabel.unsubscribe();
    this.subscription.unsubscribe();
  }
  
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  
  statusSwitch(event) {
    if (event.IsActive != undefined) {
      this.IsActive = event.IsActive
    }
    if (event.IsEmailverified != undefined) {
      this.IsEmailverified = event.IsEmailverified
    }
    // if (event.IsEnable != undefined) {
    //   this.IsEnable = event.IsEnable
    // }
  }
  addNewTags = (term) => ({ ReferenceKey: term, ReferenceName: term });
}