import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../shared/EventService';
import { StorageService } from '../../shared/StorageService';
import { NavParams, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/services/api.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'content-text-page',
  templateUrl: './content-text-page.page.html',
  styleUrls: ['./content-text-page.page.scss'],
})
export class ContentTextPage implements OnInit {
  
  loadMsg = '';
  type: any='';
  pageType: any;
  enabler: any;
  titleTerm: any;
  fromVar: any;
  titleKey: any;
  isDeliveryTermUn = false
  breadCrumpData: any;
  enablerData: any;
  isView: any=false;
  public PLATFORMID: any;

  constructor(@Inject(PLATFORM_ID) platformId: any, public alertController: AlertController,public route:ActivatedRoute,public apiService: ApiService, public router: Router, public store: StorageService, public eventService: EventService) {

    this.PLATFORMID = isPlatformBrowser(platformId)
    
    this.pageType = this.route.snapshot.paramMap.get('type') != undefined ? this.route.snapshot.paramMap.get('type') : undefined;
    this.enabler = this.route.snapshot.paramMap.get('enabler') != undefined ? this.route.snapshot.paramMap.get('enabler') : undefined;
    this.type = this.route.snapshot.paramMap.get('action') != undefined ? this.route.snapshot.paramMap.get('action') : 'other';
    if(this.PLATFORMID){
      this.titleKey = localStorage.getItem('titleKey') != undefined? localStorage.getItem('titleKey'):''
      this.titleTerm = localStorage.getItem('titleTerm') != undefined? localStorage.getItem('titleTerm'):undefined
      this.fromVar = localStorage.getItem('fromVar') != undefined? localStorage.getItem('fromVar'):''    
    }
    console.log('enabler ',this.enabler)
    if(this.enabler != undefined){
      this.getData();
    }else{
      this.isView=true
    }

  }

  ngOnInit() {
    
  }  
  getData() {
    this.apiService.getData('enabler', 'enabler', 'EnablerSlug', this.enabler).subscribe(async response => {
      let res: any = response;
      if (res.success && res.data != undefined) {
        this.enablerData =  res.data.detail;
        this.isView=true
        // this.setDatas(res, this.storeRes)
      }else{
        this.store.showToast(res.message,3000,'error')
      }
    });
  }
  async callAction(event: any) {
    this.loadMsg = ''
    this.isDeliveryTermUn = false
    let pagePath = localStorage.getItem('fromUrl') != undefined?localStorage.getItem('fromUrl'):''
    console.log('callAction ',event)
    console.log('pagePath ',pagePath)
    if (event == 1) {
      // this.modalCtrl.dismiss({ returnVal: this.fromVar});
      this.eventService.publishUpdateContentText({ returnVal: this.fromVar,pageType:this.pageType})
      this.router.navigateByUrl(pagePath)
    } else {
      const alert = await this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('yes'),
            handler: () => {
              // this.close();
              this.eventService.publishUpdateContentText({ returnVal: this.fromVar,pageType:this.pageType})
              this.router.navigateByUrl(pagePath)
              // this.router.navigateByUrl(localStorage.getItem('fromUrl'),{replaceUrl:true})
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
}
