import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

import { ApiService } from '../../services/api.service';

declare var $: any;

@Component({
  selector: 'add-report',
  templateUrl: 'add-report.page.html',
  styleUrls: ['add-report.page.scss'],
})


export class AddReportPage implements OnInit {


  loadMsg: any = ''
  source_list: any[];
  dataAction: any[];

  isProvider = false
  isEmail = false


  selectedEnablers: any;
  AEmail: any = ''

  DataStatus = '0';
  IsEnable = true
  IsActive = false
  IsFeatured = false

  from: any = 'home'
  title: any = 'Report'

  private subLabel: any;
  private subscription: any;
  isView: any = false;
  titl: any = '';
  alertConfirm: any;
  constructor(private route: ActivatedRoute, public eventService: EventService, public store: StorageService, public apiService: ApiService, public alertController: AlertController, public router: Router, private zone: NgZone,) {

    this.subLabel = this.eventService.updateLabel$.subscribe(async (item: any) => {
      this.title = store.getVal('report')//'Submit funding needs'
      this.titl = this.store.getVal('pi2Life_funder') + ' | ' + this.store.getVal('report')
    });

    this.from = this.route.snapshot.paramMap.get('from') != undefined ? this.route.snapshot.paramMap.get('from') : this.from;
    this.title = store.getVal('report')//this.route.snapshot.paramMap.get('title') != undefined ? this.route.snapshot.paramMap.get('title') : this.title;
  }
  
  ngOnInit(): void {
    this.getData('add');
  }
  getData(type) {
    this.subscription = this.apiService.getData('source', type, undefined, undefined).subscribe(async response => {
      let res: any = response;
      // let res = this.store.decryptData(response,atob(environment.keyData))
      if (res.success && res.data != undefined) {
        this.isView = true
        if (res.data.source_list != undefined) {
          this.source_list = res.data.source_list
        }
      } else {
        this.presentAlert('', res.message, this.store.getVal('okay'), false);
      }
    });
  }
  async callAction(event) {
    this.resetVar()
    let isCall = false
    if (event == 1) {
      if (this.selectedEnablers == undefined || this.selectedEnablers == '') {
        this.isProvider = true;
        this.store.scrollTo('source_list');
        isCall = true
      }
      if (this.AEmail == undefined || this.store.checkMail(this.AEmail)) {
        this.isEmail = true;
        if (!isCall)
          this.store.scrollTo('Email');
        isCall = true
      }
      let loadM = this.store.getVal('please_complete_required_field');
      if (isCall) {
        this.loadMsg = loadM;
        this.dataAction = []

      } else {
        let postData = new FormData();
        postData.append("Enablers", this.selectedEnablers);
        postData.append("Email", this.AEmail);

        this.apiService.addData('source', postData, 'add').subscribe(response => {
          let res: any = response;
          // let res = this.store.decryptData(response,atob(environment.keyData))
          if (res.success) {
            this.clearData();
            this.store.showToast(res.message, 1500, res.success ? undefined : 'error');
          } else {
            this.store.scrollTo('topRow');
            this.loadMsg = res.message
            this.dataAction = res.data.Actions != undefined ? res.data.Actions : []
          }
        });
      }
    } else {

      const alert = await this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('yes'),
            handler: () => {
              this.clearData()
              this.store.scrollTo('topRow');
            }
          },
          {
            text: this.store.getVal('no'),
            role: 'cancel',
            handler: () => {

            }
          }
        ], backdropDismiss: true
      });
      return await alert.present();
    }

  }

  resetVar() {
    this.loadMsg = ''
    this.dataAction = []
    this.isProvider = false
    this.isEmail = false
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
            if (isBack) {
              this.loadMsg = ''
              this.dataAction = []
              this.store.scrollTo('topRow');
              this.clearData();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  clearData() {
    this.resetVar();
    this.selectedEnablers = undefined;
    this.AEmail = ''
  }
  ngOnDestroy() {
    this.subLabel.unsubscribe();
    this.subscription.unsubscribe();
  }

}
