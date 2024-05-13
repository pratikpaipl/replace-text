import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../shared/StorageService';
import { EventService } from '../../shared/EventService';
import { ApiService } from 'src/services/api.service';
import { AuthenticationService } from 'src/services/authentication.service';
declare var $: any;
declare const getActionsFromMessage
@Component({
  selector: 'send-matchmaking-report',
  templateUrl: './send-matchmaking-report.page.html',
  styleUrls: ['./send-matchmaking-report.page.scss'],
})
export class SendMatchmakingReportPage implements OnInit {

  title = ''
  from: any;
  detailData: any;
  fname: any;
  fslug: any;
  ptype: any;
  mptype: any;
  pslug: any;

  loadData = false;
  reg: any = "";
  regMsg: any = "";
  name = '';
  subjectReadOnly = false;
  headOfConcatForm;
  emailTo = '';
  subject = '';
  imgError = false;
  Email1 = false;

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
  constructor(public store: StorageService,private zone: NgZone, public apiService: ApiService, private route: ActivatedRoute, public router: Router, private eventService: EventService,) {

    // this.fname = this.route.snapshot.paramMap.get('fname')
    this.fslug = this.route.snapshot.paramMap.get('fslug')
    this.ptype = this.route.snapshot.paramMap.get('ptype')
    this.mptype = this.route.snapshot.paramMap.get('mptype')
    this.pslug = this.route.snapshot.paramMap.get('pslug')
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

  }
  
  checkSPChar(): boolean {
    this.regMsg = /^[a-zA-Z0-9'*#%&\/()=?![\]$£€{}<>;,:._\-+ \r|\n]+$/;
    return (this.message == '' || !this.regMsg.test(this.message))
  }

  async ngOnInit(): Promise<void> {  
    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.title = this.store.getVal('send_matchmaking_report')      
    });
  }
  ionViewWillEnter() {
    this.title =  this.store.getVal('send_matchmaking_report')
    this.subject=''
    this.message=''
    this.getData()
  }  
  getData() {
    this.subscription = this.apiService.getMatchmakingReportInfo(((this.ptype=='fundraise-need' || this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?'fundraise':'funding_profile'),this.fslug,this.pslug).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.detailData=res.data.detail
        this.emails=res.data.users
        this.subject = this.store.getVal((this.ptype=='fundraise-need' || this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?'send_matchmaking_report_fundraise_title':'send_matchmaking_report_funding_profile_title')
        this.message= this.store.getVal((this.ptype=='fundraise-need' || this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?'send_matchmaking_report_fundraise_message':'send_matchmaking_report_funding_profile_message')
        
        this.fname=res.data.detail.EnablerName
        this.name= (this.ptype=='fundraise-need' ||this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?res.data.detail.CompanyName:res.data.detail.ProfileName
        var ld = [];

        this.subject = this.subject.replace('<<reference_code>>',this.detailData.ReferenceCode)
        this.subject = this.subject.replace('<<enabler_name>>',this.detailData.EnablerName)

        this.message = this.message.replace('<<contact_name>>',this.detailData.FirstName+(this.detailData.LastName != undefined?', '+this.detailData.LastName:''))
        this.message = this.message.replace('<<reference_code>>',this.detailData.ReferenceCode)
        ld.push({PageName: this.name, PageSlug: this.pslug, PageType: this.ptype,action:this.mptype})
        this.breadCrumpData = {list: ld, Page: 'Matchmaking Report'}    
        this.loadData=res.success
        this.setTitle(this.from=='list'?undefined:this.from=='top'?this.name:this.fname);
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
  sendMail() {
    if (this.subject == '') {
      this.subjectErr = this.store.getVal('please_enter_subject')
    }
    if (this.message == ''  || this.store.onkeyup(this.message) == 0) {
      this.messageErr = this.store.getVal('please_enter_message')
    }else{
      if (this.checkSPChar()) {
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }
      if(this.emails.length == 0 && this.Email1){
        this.messageErr = this.store.getVal('please_enter_valid_message')
      }else{
        if (this.name == '' || this.subject == '' || this.checkSPChar() || this.imgError) {
          //this.globle.openAlert(msg);
        } else {
          let postData = new FormData();
          postData.append("EnablerSlug", this.fslug);
          postData.append(((this.ptype=='fundraise-need' || this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?'FN_EnablerSlug':'FP_EnablerSlug'), this.pslug);
          postData.append("Subject", this.subject);
          postData.append("Message",  this.message != undefined ? this.message : '');
          if(this.emails.length>0 && this.Email1){
            // postData.append("Email",  Array.prototype.map.call(this.emails, s => s.UserEmail).toString());    
            var result = this.emails.map(function (e) {
              return e.UserEmail;
            }).join(', ');
            postData.append("Email",  result);    
          }
          postData.append("Link", window.location.href);
          if (this.store.isNetwork() && !this.isCalled) {
            this.isCalled=true
            this.apiService.sendMail(((this.ptype=='fundraise-need' || this.ptype=='fundraise-needs' || this.ptype =='fundraise-needs-submitted')?'fundraise':'funding_profile')+"/send_matchmaking_report",postData).subscribe(response => {
              let res: any = response;
              this.clearError(res.success)
              this.store.showToast(res.message, 2000, res.success?undefined:'error');
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
