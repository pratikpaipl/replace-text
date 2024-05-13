import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, PopoverController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';

@Component({
  selector: 'header-popover-menu',
  templateUrl: './header-popover-menu.component.html',
  styleUrls: ['./header-popover-menu.component.scss'],
})
export class ProductMenuComponent implements OnInit {

  items:any=[]
  constructor(public navParams: NavParams, public eventService: EventService, public alertController: AlertController, public apiService: ApiService, public store: StorageService, public router: Router, public popoverController: PopoverController) {
    var data = this.navParams.get("value");
    this.items = this.navParams.get("items");
  
  }
  ngOnInit(): void {
  }
  async openPage(path){
    this.popoverController.dismiss();
    this.router.navigateByUrl(path)
  }
}
