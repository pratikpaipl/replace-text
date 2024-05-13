import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ApiService } from 'src/services/api.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { EventService } from '../../../../shared/EventService';
import { StorageService } from '../../../../shared/StorageService';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'add-enabler',
  templateUrl: 'add-enabler.page.html',
  styleUrls: ['add-enabler.page.scss'],
})
export class AddEnablerPage implements OnInit {
  
  isFocused=false;
  private subscription: any;
  private subLabel: any;
  isView = false
  IsAddNewComapny:any = false;
  checkAll: any
  
  RepresentingForEmail:any=''
  RepresentingForFirstName:any=''
  RepresentingForLastName:any=''
  isRepresentingFirstName = false
  isRepresentingForEmail = false


  loadMsg = ''
  MinRaiseError: any  = ''
  MaxRaiseError: any  = ''
  MinTicketError: any  = ''
  MaxTicketError: any  = ''
  dataAction: any = [];
  // loadCompanyErrorMsg = ''
  
  DefaultMinimumAmount = 1;
  DefaultMaximumAmount = 99999999999;
 
  
  LogoFile: any;
  LogoURl:any;
  LogoSrc:any = ""
  IsDeleteLogo:any = false
  IsDeleteCover:any = false
  CoverPhotoFile: any;
  CoverPhotoURl: any;
  CoverPhotoSrc: any = "";
  
  IsCompanyUn = false
  isLogoUn = false
  IsPlanUn = false
  IsEnablerNameUn = false
  IsShortDescriptionUn = false
  IsWebsite = false;
  isCopmanyRegistryRecord = false;
  IsEnablerConfirmation = false
  
  EnablerSlug:any;
  selectedCompany = undefined
  selectedCountry = undefined
  EnablerName:any = ''
  ShortDescription:any = ''
  About: any = ''
  PlanID: any
  Website: any = ''
  EnablerConfirmation = false
  
  CompanyList = []
  PlanList = []

  DataStatus = '1';
  IsEnable = '1'
  IsActive = '1'
  IsFeatured = '0'
  EnablerRights = false;
  
  from: any = 'home'
  type: any = 'add'
  title: any = 'Add Enabler'
  titl: any = '';
  countryList = []
  permissionsList = []
  isNewCompany =false
  isCompanyUn = false;
  isNameUn = false;
  isCountry = false;

  RegistrationNo:any=''
  CompanyNotRegisterd: any=false
  CompanyRegistryRecord:any
  selectCountry:any
  FormattedAddress = '';
  DisplayAddress = '';
  LocationJson:any;
  isEdit=false;

  @ViewChild('CompanySelecter') ngSelectCompany: NgSelectComponent;
  @ViewChild("inputElement") inputElement: ElementRef;

  constructor(private route: ActivatedRoute, private cdref: ChangeDetectorRef, public eventService: EventService,private cookieService: CookieService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router) {
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {

      if(this.EnablerSlug != undefined && this.EnablerSlug != '') {
        this.title = store.getVal('edit_enabler_form')
      } else {
        this.title = store.getVal('enabler_form')
      }
      this.titl = this.store.getVal('pi2Life_funder') + ' | ' + this.store.getVal('enabler_form')
      this.setTitle();
    });
    this.EnablerSlug = this.route.snapshot.paramMap.get('fslug') != undefined ? this.route.snapshot.paramMap.get('fslug') : '';
    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : this.from;
    if(this.EnablerSlug != undefined && this.EnablerSlug != '') {
      this.isEdit=true
      this.title = store.getVal('edit_enabler_form')
    } else {
      this.isEdit=false
      this.title = store.getVal('enabler_form')
    }

    $(document).on("click", "#deleteImg", function () {
      $('#upload').val('')
    });
    $(document).on("click", "#deleteImgCov", function () {
      $('#uploadcocer').val('')
    });

  }
  async ngOnInit(): Promise<void> {
    this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})

    if(this.cookieService.check(environment.cookiesKey)){
      let res= this.store.getReponseData(this.cookieService.get(environment.cookiesKey))
      let datas = res!=undefined?res.data:undefined
      if (datas != undefined && datas.UserData != undefined) {
        this.store.userData = datas
        this.store.IsSystemAdmin = datas.UserData.IsSystemAdmin == 1
        this.store.AdminAccess = datas.UserData.AdminAccess == 1
        this.DataStatus  = this.store.IsSystemAdmin?'1':'1'
      }
    }

    this.RepresentingForEmail= this.store.userData.Email
    this.RepresentingForFirstName= this.store.userData.FirstName
    this.RepresentingForLastName= this.store.userData.LastName
  

    Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  ionViewWillEnter() {
    if(this.EnablerSlug != undefined && this.EnablerSlug != '') {
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
  planScrinPath(){
    return this.store.isLogin?'admin#plans_and_pricing':'plans-and-pricing';
  }
  customSelect(event,isCreate?){
    if(event.modalName !=undefined){
      this['' + event.modalName] = event.modal
      if(event.modalName =='selectedCompany'){
        if(event != undefined && event.select != undefined && event.select.itemsList._selectionModel._selected != undefined && event.select.itemsList._selectionModel._selected.length>0){
          let selData = event.select.itemsList._selectionModel._selected[0].value
          let ix = this.CompanyList.findIndex(p => p.CountryID == selData.CountryID);
          this.selectedCountry = ix!=-1?selData.CountryID:undefined
          if(ix == -1){
            this.isNewCompany = true
            // this.selectedCountry =undefined
          }else{
            this.isNewCompany = false
            // this.selectedCountry = selData.CountryID
          }
              this.selectCountry = selData.CountryID
              this.RegistrationNo = selData.RegistrationNo
              this.CompanyRegistryRecord = selData.CompanyRegistryRecord
              this.CompanyNotRegisterd = selData.CompanyNotRegisterd

        }else{
          this.isNewCompany=false
          this.CompanyNotRegisterd=false
          this.selectCountry = null
          this.RegistrationNo = ''
          this.CompanyRegistryRecord=undefined
        }
      }
      if(event.isCreate && event.modal == undefined && event.createNew){
        this.CreateNew(event.select)
      }else if(event.isCreate && event.modal != undefined){
        this.isNewCompany = false;
      }
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
      } else if(from == 'cover-photo') {
        this.CoverPhotoFile = File;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.CoverPhotoSrc = event.target.result;
        }
        reader.readAsDataURL(this.CoverPhotoFile);
      }
    }
  }
    
  onDeleteFile(from) {
    if(from == 'logo') {
      this.IsDeleteLogo = true
      this.LogoSrc = ""
      this.LogoFile = undefined;
      this.LogoURl = undefined;
    } else if(from == 'cover-photo') {
      this.IsDeleteCover = true
      this.CoverPhotoSrc = ""
      this.CoverPhotoFile = undefined;
      this.CoverPhotoURl = undefined;
    }
  }
  
  getData(type) {
    this.subscription = this.apiService.getData('enabler', type, 'EnablerSlug', this.EnablerSlug).subscribe(async response => {
      let res: any = response;
     // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        this.isView = true        
        if (res.data.company_list != undefined) {
          this.CompanyList = res.data.company_list
        }        
        if (res.data.plan_list != undefined) {
          this.PlanList = res.data.plan_list
        }        
        this.PlanID = res.data.SelectedPlanID != undefined ?res.data.SelectedPlanID:undefined
        let check = this.PlanList.findIndex(c => c.PlanID == this.PlanID)
        if(check == -1){
          this.PlanID= undefined
        }
              
        if (res.data.country_list != undefined) {
          this.countryList = res.data.country_list
        }        
        if(res.data.detail != undefined) {
          this.setEnablerData(res.data.detail)
        }
        this.setTitle()
        this.permissionsList = res.data.company_permission_list != undefined ? res.data.company_permission_list : [];
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
    this.RegistrationNo=''
    this.CompanyRegistryRecord=undefined
    this.selectCountry=null
    this.selectedCompany = null
    this.isNewCompany = true;
    this.isCompanyUn = false
    setTimeout(() => {
      if(this.inputElement != undefined && this.inputElement.nativeElement != undefined)
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  setEnablerData(detail: any) {
    let EnablerData = detail;

    this.selectedCompany = EnablerData.CompanyID
    let check = this.CompanyList.findIndex(c => c.CompanyID == this.selectedCompany)
    if(check== -1 ){
      this.selectedCompany = undefined
    }else{
      this.RegistrationNo =this.RegistrationNo ==''? detail.RegistrationNo != undefined ? detail.RegistrationNo : this.RegistrationNo:this.RegistrationNo
      this.CompanyRegistryRecord  = this.CompanyRegistryRecord ==''? detail.CompanyRegistryRecord != undefined ? detail.CompanyRegistryRecord : this.CompanyRegistryRecord: this.CompanyRegistryRecord
      this.selectedCountry = this.selectedCountry ==undefined? detail.CountriesOfIncorporation != undefined ? detail.CountriesOfIncorporation : this.selectedCountry: this.selectedCountry
    }
    this.EnablerName = EnablerData.EnablerName
    this.ShortDescription = EnablerData.ShortDescription != undefined?this.store.nl2br2(EnablerData.ShortDescription) :''

    this.LogoURl = (EnablerData.EnablerLogo != null && EnablerData.EnablerLogo != '') ? EnablerData.EnablerLogo : null;

    this.CoverPhotoURl = (EnablerData.EnablerCoverPhoto != null && EnablerData.EnablerCoverPhoto != '') ? EnablerData.EnablerCoverPhoto : null;
    
 
    this.About = EnablerData.About != undefined ?this.store.nl2br2(EnablerData.About):''
    this.Website = EnablerData.Website != undefined?EnablerData.Website:''
    this.IsFeatured = EnablerData.IsFeatured?'1':'0'
    this.IsActive = EnablerData.IsActive?'1':'0'
    this.IsEnable = EnablerData.IsEnable?'1':'0'
    this.DataStatus = EnablerData.DataStatus.toString()
    this.EnablerConfirmation = EnablerData.IsDisclaimer
    this.DisplayAddress = EnablerData.DisplayAddress != undefined ? EnablerData.DisplayAddress : ''
    this.FormattedAddress = EnablerData.FormattedAddress != undefined ? EnablerData.FormattedAddress : ''
    this.LocationJson = EnablerData.LocationJson != undefined && EnablerData.LocationJson != '' ? JSON.parse(EnablerData.LocationJson) : undefined

    for (let i = 0; i < this.CompanyList.length; i++) {
      const element = this.CompanyList[i];
      if(this.selectedCompany == element.CompanyID){
        this.selectCountry = element.CountryID
        this.RegistrationNo = element.RegistrationNo   
        this.CompanyRegistryRecord = element.CompanyRegistryRecord   
        break;     
      }
      
    }
  }
  
  async callAction(event, type?,ex?) {
    
    if (event == 1) {
      this.resetVar()
      let isCall = false

      if(!this.isEdit && this.PlanID ==undefined){
        this.IsPlanUn = true;
        if (!isCall)
        this.store.scrollTo('PlanList');
        isCall = true
      }

      if (this.selectedCompany == undefined || this.selectedCompany == '') {
        this.IsCompanyUn = true;
        if (!isCall)
        this.store.scrollTo('CompanyID');
        isCall = true
      }
      if(this.isNewCompany){
        if (this.selectCountry == undefined) {
          this.isCountry = true;
          if (!isCall)
            this.store.scrollTo('Country');
          isCall = true;
        }
        if (this.CompanyRegistryRecord != undefined && (this.CompanyRegistryRecord.trim() != '' && this.store.checkWeb(this.CompanyRegistryRecord))) {
          this.isCopmanyRegistryRecord = true
          if (!isCall)
          this.store.scrollTo('CompanyRegistryRecord');
          isCall = true
        }
      }
      if (this.EnablerName == undefined || this.EnablerName.trim() == '') {
        this.IsEnablerNameUn = true;
        if (!isCall)
        this.store.scrollTo('EnablerName');
        isCall = true
      }

      if (this.ShortDescription == undefined || this.ShortDescription.trim() == '') {
        this.IsShortDescriptionUn = true;
        if (!isCall)
        this.store.scrollTo('ShortDescription');
        isCall = true
      }

      if (this.Website != undefined && this.Website.trim() != '') {
        if(this.store.checkWeb(this.Website)) {
          this.IsWebsite = true
          if (!isCall)
          this.store.scrollTo('Website');
          isCall = true
        }
      } 
      
      if (isCall) {
        this.loadMsg = this.store.getVal('please_complete_required_field');
      } else {
        if(event == 1 && this.EnablerSlug != undefined && this.EnablerSlug != '') {
          const alert = await this.alertController.create({
            message: this.store.getVal('enabler_edit_warning'),
            animated: true,
            cssClass: 'alertCustomCssBtn',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  this.openUserConfirmationBox();
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
        } else {
          this.publishFundraise();
        }
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
            this.publishFundraise();
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

  changeIsRegister(event){
    if(this.CompanyNotRegisterd){
      this.CompanyRegistryRecord=''
      this.RegistrationNo=''
    }
  }

  publishFundraise() {
    let postData = new FormData();
    let check = this.CompanyList.findIndex(c => c.CompanyID == this.selectedCompany)
    if(check == -1 ){
      postData.append("CompanyName", this.selectedCompany);
      postData.append("CountriesOfIncorporation", this.selectCountry != undefined ? this.selectCountry : '');
      postData.append("RegistrationNo", this.RegistrationNo!= undefined ?this.RegistrationNo:'');
      postData.append("CompanyNotRegisterd", this.CompanyNotRegisterd?'1':'0');
      postData.append("CompanyRegistryRecord", this.CompanyRegistryRecord!= undefined?this.CompanyRegistryRecord:'');
    }else{
      postData.append("CompanyID", this.CompanyList[check].CompanyID);
    }
    postData.append("EnablerName", (this.EnablerName == undefined)?'':this.EnablerName.trim());
    postData.append("EnablerSlug", (this.EnablerSlug != undefined && this.EnablerSlug != '') ? this.EnablerSlug : '');

    if (this.LogoFile != undefined) {
      postData.append('EnablerLogo', this.LogoFile, this.LogoFile.name);
    }
    postData.append("IsDeleteLogo", this.IsDeleteLogo ? '1' : '0');
    
    if (this.CoverPhotoFile != undefined) {
      postData.append('EnablerCoverPhoto', this.CoverPhotoFile, this.CoverPhotoFile.name);
    }
    postData.append("IsDeleteCover", this.IsDeleteCover ? '1' : '0');
    
    postData.append("ShortDescription", ((this.ShortDescription != undefined && this.ShortDescription.trim() != '')? this.ShortDescription.trim() : ''));

    if(this.PlanID != undefined && !this.isEdit)
    postData.append("PlanID", this.PlanID);
    // About
    postData.append("About", this.About);

    // Contact
    postData.append("Website", (this.Website != undefined && this.Website != ''?this.Website.trim():''));
    postData.append("ConfirmAuthorised", this.EnablerConfirmation ? '1' : '0');

    postData.append("IsActive",this.IsActive != undefined ? this.IsActive : '0');
    postData.append("IsFeatured", this.IsFeatured != undefined ? this.IsFeatured : '0');
    postData.append("IsEnable",  this.IsEnable != undefined ? this.IsEnable : '0');
    postData.append("DataStatus", this.DataStatus != undefined ? this.DataStatus : '');

    postData.append("DisplayAddress", this.DisplayAddress);
    postData.append("FormattedAddress", this.FormattedAddress);
    postData.append("LocationJson", (this.LocationJson != undefined)?JSON.stringify(this.LocationJson):'');
    
    this.apiService.addData('enabler', postData, (this.EnablerSlug != undefined && this.EnablerSlug != '')?'edit':'add').subscribe(async response => {
      let res: any = response;
      // let res = this.store.decryptData(response,atob(environment.keyData))
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
    this.IsCompanyUn = false
    this.isLogoUn = false
    this.IsPlanUn = false
    this.IsEnablerNameUn = false
    this.IsShortDescriptionUn = false
    this.IsWebsite = false;
    this.isCopmanyRegistryRecord = false;
    this.isNameUn = false;
    this.isCountry = false;
    // this.isNewCompany = false;
    this.IsEnablerConfirmation = false
    this.isRepresentingForEmail = false
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

    this.MinRaiseError = ''
    this.MaxRaiseError = ''
    this.MinTicketError = ''
    this.MaxRaiseError = ''
    
    this.selectedCompany = undefined
    this.EnablerName = ''
    this.ShortDescription = ''
    this.About = ''
    this.Website = ''
    this.DisplayAddress = ""
    this.FormattedAddress = ""
    this.LocationJson = undefined
    this.EnablerConfirmation = false
    // this.eventService.publishUpdateData({ segment: 'enablers', reload: true });
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
    if (event.DataStatus != undefined) {
      this.DataStatus = event.DataStatus
    }
    if (event.IsActive != undefined) {
      this.IsActive = event.IsActive
    }
    if (event.IsEnable != undefined) {
      this.IsEnable = event.IsEnable
    }
    if (event.IsFeatured != undefined) {
      this.IsFeatured = event.IsFeatured
    }
  }
  selectSort(event) {
    this.DataStatus = event
  }
  
  addNewTags = (term) => ({ ReferenceKey: term, ReferenceName: term });

  addressChange(event) {
    if (event.isChangeEvent != undefined && event.isChangeEvent) {
      if (event.displayAddress != undefined && event.displayAddress != '' && event.regAddress != undefined && event.regAddress != '') {
        
        if(!event.displayAddress.includes(event.PlaceName)){
          this.FormattedAddress = event.PlaceName+', '+ event.displayAddress
        }else{
          this.FormattedAddress = event.displayAddress;
        }
        if(!event.regAddress.includes(event.PlaceName)){
          this.DisplayAddress = event.PlaceName+', '+ event.regAddress
        }else{
          this.DisplayAddress = event.regAddress;
        }
        // this.FormattedAddress = event.displayAddress;
        // this.DisplayAddress = event.regAddress;
       
        this.LocationJson = (event.AddressComponents != undefined)?JSON.parse(event.AddressComponents):undefined;

      } else {
        this.FormattedAddress = '';
        this.DisplayAddress = '';
        this.LocationJson = undefined;
      }
    } else {
      this.loadMsg = ''
      if (event != undefined && event.displayAddress != undefined && event.displayAddress != '' && event.address != undefined && event.address != '') {
        if(!event.displayAddress.includes(event.PlaceName)){
          this.FormattedAddress = event.PlaceName+', '+ event.displayAddress
        }else{
          this.FormattedAddress = event.displayAddress;
        }
        if(!event.regAddress.includes(event.PlaceName)){
          this.DisplayAddress = event.PlaceName+', '+ event.regAddress
        }else{
          this.DisplayAddress = event.regAddress;
        }
        // this.FormattedAddress = event.displayAddress;
        // this.DisplayAddress = event.address;
        this.LocationJson = (event.AddressComponents != undefined && event.AddressComponents != '')?JSON.parse(event.AddressComponents):[];
      } else {
        this.FormattedAddress = '';
        this.DisplayAddress = '';
        this.LocationJson = undefined;
      }
    }
  }

}