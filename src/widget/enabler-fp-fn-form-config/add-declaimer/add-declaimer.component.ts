import { ApiService } from 'src/services/api.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';

@Component({
  selector: 'add-declaimer',
  templateUrl: './add-declaimer.component.html',
  styleUrls: ['./add-declaimer.component.scss'],
})
export class AddDeclaimerComponent implements OnInit {

  loadMsg = '';
  type: any;
  titleTerm: any;
  fromVar: any;
  titleKey: any;
  isDeliveryTermUn = false
  
  constructor(public navParams: NavParams, public alertController: AlertController,public router: Router, public store: StorageService, public eventService: EventService, public modalCtrl: ModalController, public apiService: ApiService) {

  }

  ngOnInit() {
    
    console.log('fromVar ',this.fromVar)
  }  
  async callAction(event: any) {
    this.loadMsg = ''
    this.isDeliveryTermUn = false
    if (event == 1) {
      this.modalCtrl.dismiss({ returnVal: this.fromVar});
    
    } else {
      const alert = await this.alertController.create({
        message: this.store.getVal('unsaved_changes'),
        animated: true,
        cssClass: 'alertCustomCssBtn',
        buttons: [
          {
            text: this.store.getVal('yes'),
            handler: () => {
              this.close();
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

  close() { this.modalCtrl.dismiss(''); }

  
}