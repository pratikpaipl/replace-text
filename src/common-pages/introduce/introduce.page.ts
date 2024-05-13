import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { EventService } from '../../shared/EventService';
import { ApiService } from 'src/services/api.service';
declare var $: any;
declare const getActionsFromMessage
@Component({
  selector: 'introduce',
  templateUrl: './introduce.page.html',
  styleUrls: ['./introduce.page.scss'],
})
export class IntroducePage implements OnInit {

  attachedFile:any;
  isSizeExclude:any;
  IsDeleteFile:any = false
  fileName: any='';

  title = ''
  from: any;
  detailData: any;
  ename: any;
  eslug: any;
  ptype: any;
  mptype: any;
  pslug: any;
  fslug: any;

  loadData = false;
  reg: any = "";
  regMsg: any = "";
  name = '';
  subjectReadOnly = false;
  headOfConcatForm;
  emailTo = '';
  subject = '';
  imgError = false;
  Email1 = true;

  emails=[]

  noteMsg = '';
  message = '';
  nameErr = '';
  emailErr = '';
  subjectErr = '';
  messageErr = '';
  breadCrumpData: any;
  subLabel:any
  loadMsg: string='';
  private subscription: any;
  isCalled: boolean=false;
  constructor(public store: StorageService, private zone: NgZone, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService,) {

    // this.fname = this.route.snapshot.paramMap.get('fname')
    this.eslug = this.route.snapshot.paramMap.get('eslug')
    this.ptype = this.route.snapshot.paramMap.get('ptype')
    this.mptype = this.route.snapshot.paramMap.get('mptype')
    this.pslug = this.route.snapshot.paramMap.get('pslug')
    this.fslug = this.route.snapshot.paramMap.get('fslug')
    this.from = this.route.snapshot.paramMap.get('from')
    
    const $this = this;
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      $this.zone.run(() => {
        if (action == 'start_exploring') {
          $this.store.backPage();
        }
      });
    });

    $(document).on("change","#upload",function() 
    {
        if (typeof (FileReader) != "undefined") 
        {
            var file_name = $(this).parent().find('ion-label span.file_name');

            $(this).parent().addClass('selected');

            $($(this)[0].files).each(function () 
            {
                var file = $(this);                  
                var reader = new FileReader();
                file_name.text(file[0].name);
            });
        } else 
        {
            alert("This browser does not support HTML5 FileReader.");
        }
    });

    $(document).on("click",".remove_sele",function() 
    {  
        $(this).parent().parent().removeClass('selected');
        $(this).parent().find('span.file_name').text('');
        var delinput = $(this).parent().parent().find('#upload');
        $(delinput).val('');
    });
    $(document).on("click", "#deletePdf", function () {
      $('#upload').val('')
    });

  }

  checkSPChar(): boolean {
    // +''*#%&/|()=?![]$£€{}<>\;,:.-_
    this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>;,:._\-+ \r|\n]+$/;
    // this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>\\;,:._+ \r|\n]+$/;
    return (this.message == '' || !this.regMsg.test(this.message))
  }

  async ngOnInit(): Promise<void> {  
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      // this.title = await this.store.getVal('introduce')+' '+this.pslug+' - '+this.fslug
      if(this.detailData !=undefined)
      this.title = 'Introduce '+ this.detailData.FPReferenceCode+' - '+this.detailData.FNReferenceCode

    });
  }
  ionViewWillEnter() {
    // this.title = 'Introduce '+this.pslug+' - '+this.fslug
    if(this.detailData !=undefined)
    this.title = 'Introduce '+ this.detailData.FPReferenceCode+' - '+this.detailData.FNReferenceCode
    this.getData()
  }  
  getData() {
    this.subscription = this.apiService.getIntroduceInfo(this.eslug,this.pslug,this.fslug,this.mptype).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.detailData=res.data.detail
        this.emails=res.data.users
        this.ename=res.data.detail.EnablerName
        
        // this.emails.
        this.name= (this.ptype =='funding-profile-match-report')?res.data.detail.CompanyName:res.data.detail.ProfileName
        var ld = [];
        let bpage =this.ptype =='funding-profile-match-report'?'fundraise-needs-submitted':'funding-profiles-submitted'
        let PageSlug =this.ptype =='funding-profile-match-report'?this.fslug:this.pslug
        this.pslug
         if(this.from =='top' || this.from =='details'){          
          ld.push({PageName: this.name, PageSlug: PageSlug, PageType: bpage,action:this.ptype =='matched-fundraise-needs'?'fundraise-need-match-report':this.ptype })
          this.breadCrumpData = {list: ld, Page: 'Introduce'}    
        }  
        this.loadData=res.success
        this.title = 'Introduce '+ this.detailData.FPReferenceCode+' - '+this.detailData.FNReferenceCode
        this.setTitle(this.from=='list'?undefined:this.from=='top'?this.name:this.ename);
      }
    });
  }
  
  setTitle(name){
    if(name != undefined)
    this.store.titleCntWithPage(name,this.title);  
    else
    this.store.titleCntWithPage(this.title);  
  }

  callAction(event) {    
     if (event == 1) {
      this.sendMail()
    }
  }
  callEmails(event){
    if(event != undefined && event.emails != undefined)
    this.emails = event.emails;
  }
  changeListener($event): void {
    this.loadMsg = ''
    this.imgError=false
    if ($event.target.files && $event.target.files[0]) {
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;
      if ($event.target.files[0].size > this.store.max_size) {
        this.imgError=true
        // this.loadMsg = this.store.getVal('maximum_size_allowed_is')+' ' + this.store.max_size / 1000000 + this.store.getVal('mb');
      } else {
        this.attachedFile = $event.target.files[0];
        this.fileName =this.attachedFile.name

        let reader = new FileReader();
        reader.onload = (event: any) => {
          // this.img1 = event.target.result;
        }
        reader.readAsDataURL(this.attachedFile);
      }
    }
    let File = $event.target.files[0];
    if (File != undefined) {
        this.attachedFile = File;
        let reader = new FileReader();
        reader.onload = (event: any) => {
          // this.LogoSrc = event.target.result;
        }
        reader.readAsDataURL(this.attachedFile);
    }
  }
  onDeletePdf(){
    this.IsDeleteFile=true
    this.isSizeExclude = false
    this.fileName=''
    this.attachedFile=undefined
  }
  sendMail() {
    if (this.subject == '') {
      this.subjectErr = this.store.getVal('please_enter_subject')
    }
    if (this.message == ''  || this.store.onkeyup(this.message) == 0) {
      this.messageErr = this.store.getVal('please_enter_message')
    }else{
      if (this.checkSPChar()) {
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }if(this.emails.length == 0 && this.Email1){
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }else{
        if (this.name == '' || this.subject == '' || this.checkSPChar() || this.imgError) {
          //this.globle.openAlert(msg);
        } else {
          let postData = new FormData();
          postData.append("EnablerSlug", this.eslug);
          postData.append("PageSlug", this.pslug);
          postData.append("PageType", this.mptype);
          postData.append("FP_EnablerSlug", this.pslug);
          postData.append("FN_EnablerSlug", this.fslug);
          postData.append("Subject", this.subject);
          postData.append("Message",  this.message != undefined ? this.message : '');
          if(this.emails.length>0 && this.Email1){
            // postData.append("Email",  Array.prototype.map.call(this.emails, s => s.UserEmail).toString());
            var result = this.emails.map(function (e) {
              return e.UserEmail;
            }).join(', ');
            postData.append("Email",  result);
          }
          if (this.attachedFile != undefined) {
            postData.append('AttachedFile', this.attachedFile, this.attachedFile.name);
          }
          postData.append("Link", window.location.href);
          if (this.store.isNetwork() && !this.isCalled) {
            this.isCalled=true
            this.apiService.sendMail("support/send_introduce_email",postData).subscribe(response => {
              let res: any = response;
              this.clearError(res.success)
              this.store.showToast(res.message, 2000, res.success?undefined:'error','middle');
            });
          }
        }
      }
    }
  }
  clearError(isClear) {
    if(isClear){
      this.name = '';
      this.subject = '';
      this.message = '';
      this.nameErr = '';
      this.emailErr = '';
      this.subjectErr = '';
      this.messageErr = '';
      this.attachedFile=undefined;
      $('#upload').val('')
      this.eventService.publishApplyFilter({updateTime:new Date().getTime(),pageFrom:(this.store.appType =='front'?'user':this.store.appType)})
      this.store.backPage();
    }
    this.isCalled=false
  }
  ngOnDestroy(): void {
    if(this.subLabel !=undefined)
    this.subLabel.unsubscribe();
    if(this.subscription !=undefined)
    this.subscription.unsubscribe();
  }
}
