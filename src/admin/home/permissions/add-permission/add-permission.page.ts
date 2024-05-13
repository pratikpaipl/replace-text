import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { ApiService } from 'src/services/api.service';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonInfiniteScroll, Platform } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';

import { Location } from '@angular/common';
import { actType } from 'src/shared/app.constants';
declare const uploadFile: any;
declare const pageToTop: any;
declare var $: any;

@Component({
  selector: 'add-permission',
  templateUrl: 'add-permission.page.html',
  styleUrls: ['add-permission.page.scss'],
})
export class AddPermissionPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('content') content: any;

  PageDetail: any;
  from: any = false;
  fromPage: any = '';
  Slug: any = '';
  PageUserID: any = '';
  loadMsg: any = '';
  loadMsgError: any = '';
  dataAction: any = [];
  permissionList: any = [];
  PageUserDetail: any;
  Changeable = true;
  pageTitle = 'Add Label'
  label: any = {};
  isEmail = false;
  Email = ''
  isCheck = false;
  isAdmin = false;
  DataStatus = '0';

  public subscription: any;

  constructor(public alertController: AlertController, private location: Location, public store: StorageService,private zone: NgZone, public activatedRoute: ActivatedRoute, public router: Router, private eventService: EventService, public platform: Platform, public actionSheetController: ActionSheetController, public apiService: ApiService) {
    this.fromPage = this.activatedRoute.snapshot.paramMap.get('from');
    this.Slug = this.activatedRoute.snapshot.paramMap.get('slug');
    let loc = this.location.path();
    this.from = (loc.indexOf('/edit') !== -1);
    this.PageUserID = this.activatedRoute.snapshot.paramMap.get('PageUserID');
    // this.eventService.publishFormShowContact(false);
    const $this = this;
    $(document).on('click', '.actonTg', function () {
      const action = $(this).data('action');
      $this.zone.run(() => {
        if (action == 'change_email_address') {
          $this.Email = ''
          $this.loadMsgError = ''
        } else if (action == 'edit_permissions') {
          if ($this.PageUserDetail != undefined) {
            $this.pageTitle = $this.store.getVal('edit_permission')
          }
          $this.loadMsgError = ''
          $this.isCheck = true;
        }
      });
    });
    this.eventService.updateLabel$.subscribe(async (item: any) => {
      if (this.from) {
        this.pageTitle = this.store.getVal('edit_permission')
      }
      else {
        this.pageTitle = this.store.getVal('add_permission')
      }
    });
    this.DataStatus = this.store.IsSystemAdmin ? '1' : '0'
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    this.pageTitle = this.store.getVal('add_permission')
    if (this.from) {
      this.pageTitle = this.store.getVal('edit_permission')
      this.isCheck = true;
      this.getDetails();
    } else {
      this.getData('add');
    }
    this.setTitle();    
  }
  setTitle() {
      this.store.titleCntWithPage(this.pageTitle)
  }
  getData(type) {
    setTimeout(() => {
      this.subscription = this.apiService.getData(actType.admin_role, type, 'PageSlug', this.Slug, null, null, null, (this.fromPage =='enablers'?'enabler':this.fromPage) + "_permission").subscribe(async response => {
        let res: any = response;
        if (res.success && res.data != undefined) {
          if (res.data.detail != undefined) {
            this.PageDetail = res.data.detail
          }
        }
      });
    }, this.store.isApiCalled);

  }

  getDetails() {
    setTimeout(() => {
      this.apiService.getPageUserDetails(this.Slug, this.PageUserID,(this.fromPage =='enablers'?'enabler':this.fromPage)).subscribe(async response => {
        let res: any = response;
        if (res.success) {
          if (res.data != undefined) {
            this.PageUserDetail = res.data.PageUserDetail;
            this.PageUserDetail.PermissionJsonData = undefined
            this.Changeable = res.data.Changeable
            if (this.PageUserDetail != undefined) {
              this.isAdmin = this.PageUserDetail.IsPageAdmin
              this.Email = this.PageUserDetail.Email
            }
            if (res.data.detail != undefined)
              this.PageDetail = res.data.detail

            for (let i = 0; i < res.data.PagePermissionData.length; i++) {
              let element = res.data.PagePermissionData[i];
              if (element.PermissionJsonData != undefined && element.PermissionJsonData != null) {
                let Permission: any = JSON.parse(element.PermissionJsonData);
                element.item = Permission
                let cnt = 0;
                for (let k = 0; k < element.item.length; k++) {
                  const sub = element.item[k];
                  if (sub.IsSelected) {
                    cnt = cnt + 1
                  }
                }
                element.IsSelected = (cnt == element.item.length) ? 1 : 0
                this.permissionList.push(element)
              }
            }
          }
        }
      });
    }, this.store.isApiCalled);

  }
  async callAction(event, type) {
    if (event == 1 && type == '0') {
      this.checkPageUserRole()
    } else if (event == 1) {
      this.publishLabel()
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
  changeAdminMain(event) {

    if (this.Changeable) {
      for (let i = 0; i < this.permissionList.length; i++) {
        const element = this.permissionList[i];
        element.IsSelected = this.isAdmin
        for (let i = 0; i < element.item.length; i++) {
          element.item[i].IsSelected = this.isAdmin
        }
      }
    }


  }
  changeMain(event, item) {
    let index: number = this.permissionList.indexOf(item);
    this.permissionList[index].IsSelected = event.detail.checked;
    for (let i = 0; i < this.permissionList[index].item.length; i++) {
      this.permissionList[index].item[i].IsSelected = event.detail.checked
    }
  }
  changeSub(event, changeSub, pos) {

  }

  checkPageUserRole() {
    this.loadMsg = '';
    this.loadMsgError = ''
    this.dataAction = []
    this.isEmail = false

    if (this.store.checkMail(this.Email)) {
      this.isEmail = true
      this.loadMsg = this.store.getVal('changes_not_saved_since_required_information_missing');
    }
    else {
      let postData = new FormData();
      postData.append("PageSlug", this.Slug);
      postData.append("Email", this.Email);
      postData.append("PermissionTextKey", 'transfer_ownership,add_page_user,download_page_user');
      postData.append("PageType", this.fromPage + '_permission');
      this.apiService.checkPageUserRole(postData).subscribe(response => {
        let res: any = response;
        this.permissionList = []
        this.PageUserDetail = res.data.PageUserDetail.PageUserID != undefined ? res.data.PageUserDetail : undefined;
        this.Changeable = res.data.Changeable
        if (this.PageUserDetail != undefined) {
          this.isAdmin = this.PageUserDetail.IsPageAdmin
        }
        for (let i = 0; i < res.data.list.length; i++) {
          let element = res.data.list[i];
          if (element.PermissionJsonData != undefined && element.PermissionJsonData != null) {
            let Permission: any = JSON.parse(element.PermissionJsonData);
            element.item = Permission
            this.permissionList.push(element)
          }
        }
        if (res.success) {
          this.isCheck = true;
        } else {
          this.isCheck = false;
          this.dataAction = res.data.Actions
          this.loadMsgError = res.message;
        }
      });
    }
  }
  publishLabel() {
    this.loadMsg = '';
    this.dataAction = []
    this.isEmail = false

    if (this.isEmail) {
      this.loadMsg = this.store.getVal('changes_not_saved_since_required_information_missing');
    }
    else {
      if (this.PageUserDetail == undefined && (!this.isAdmin)) {
          this.loadMsg = this.store.getVal('assign_permission_to_access_page');
      } else {
        let postData = new FormData();
        postData.append("PageSlug", this.Slug);
        postData.append("Email", this.Email);
        let check = []
        postData.append("IsPageAdmin", this.isAdmin ? '1' : '0');
        postData.append("PageRolePermissionIDs", this.isAdmin ? '' : check.join(","));
  
        let type = 'add';
        if (this.PageUserDetail != undefined) {
          type = 'edit'
          postData.append("PageUserID", this.PageUserDetail.PageUserID);
        }
        this.apiService.addPermissionRole(postData, type).subscribe(response => {
          let res: any = response;
          if (res.success) {
            this.eventService.publishUpdateData({ segment: 'permission', reload: true });
            this.clearData();
            this.store.showToast(res.message, 2000);
          } else {
            this.loadMsgError = res.message
            this.store.scrollTo('loadMsgError')
          }
        });
      } 
    }
  }

  clearData() {
    this.Email = ''
    this.store.backPage();
  }
}