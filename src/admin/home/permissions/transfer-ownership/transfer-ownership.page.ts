import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { ApiService } from 'src/services/api.service';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
declare const uploadFile: any;
declare const pageToTop: any;
declare var $: any;

@Component({
  selector: 'transfer-ownership',
  templateUrl: 'transfer-ownership.page.html',
  styleUrls: ['transfer-ownership.page.scss'],
})
export class TransferOwnershipPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('content') content: any;

  from: any = '';
  isDisclaimer = false;
  isDisclaimerUn = false
  Slug: any = '';
  PageUserID: any = '';
  loadMsg: any = '';
  loadMsgError: any = '';
  dataAction: any = [];
  PageOwnerDetail: any;
  pageTitle = 'Transfer Ownership'
  label: any = {};
  isEmail = false;
  Email = ''
  ToEmail = ''
  isCheck = false;
  isAdmin = false;
  public subscription: any;

  constructor(public alertController: AlertController, public store: StorageService,  private zone: NgZone, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService) {
    this.Slug = this.activatedRoute.snapshot.paramMap.get('slug');
    this.from = this.activatedRoute.snapshot.paramMap.get('from');
    // this.eventService.publishFormShowContact(false);
    const $this = this;
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      $this.zone.run(() => {
        if (action == 'change_email_address') {
          $this.Email = ''
          $this.loadMsgError = ''
        } else if (action == 'edit_permissions') {

        }
      });
    });
    this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.pageTitle = this.store.getVal('transfer_ownership')
     this.setTitle();
    });

  }
  async ngOnInit() {
    this.pageTitle = await this.store.getVal('transfer_ownership')
    this.getDetails();
    this.setTitle();
  }
  setTitle() {
    this.store.titleCntWithPage(this.pageTitle)
}
  getDetails() {
    setTimeout(() => {
      this.apiService.getPageOwnerDetails(this.Slug, this.from).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          if (res.data != undefined) {
            this.PageOwnerDetail = res.data.detail;
            this.Email = this.PageOwnerDetail.Email;
          }
        }
      });
    }, this.store.isApiCalled);

  }
  async callAction(event, type) {
    if (event == 1) {
      this.publish()
    }
  }
  updateCount(event) {
    if (event.action != undefined) {
      this.eventService.publishChangeSegment(event);
      this.store.backPage();
    }
  }
  clikCount(event) {

  }

  publish() {
    this.loadMsg = '';
    this.loadMsgError = ''
    let isCall = false
    this.isDisclaimerUn = false
    this.dataAction = []
    this.isEmail = false

    if (!this.isDisclaimer) {
      this.isDisclaimerUn = true;
      if (!isCall)
        this.scrollTo('isDisclaimerUn');
      isCall = true;
    }

    if (this.store.checkMail(this.ToEmail)) {
      this.isEmail = true
      if (!isCall)
        this.scrollTo('email');

    }
    if (!this.isDisclaimer || this.isEmail) {
      this.loadMsg = this.store.getVal('changes_not_saved_since_required_information_missing');
    }
    else {
      let postData = new FormData();
      postData.append("PageSlug", this.Slug);
      postData.append("Email", this.ToEmail);
      postData.append("IsDisclaimer", this.isDisclaimer ? '1' : '0');
      this.apiService.changePageOwnerShip(postData).subscribe(response => {
        let res: any = response;
        if (res.success) {
          this.isCheck = true;
          this.eventService.publishUpdateData({ segment: 'transfer-ownership', reload: true });
          this.clearData();
          this.store.showToast(res.message, 2000);
        } else {
          this.isCheck = false;
          this.dataAction = res.data.Actions
          this.loadMsgError = res.message;
        }
      });
    }
  }
  scrollTo(id) {
    let el = document.getElementById(id);
    el.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  clearData() {
    this.Email = ''
    this.store.backPage();
  }
}