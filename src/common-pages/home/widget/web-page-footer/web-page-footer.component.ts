import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'web-page-footer',
  templateUrl: './web-page-footer.component.html',
  styleUrls: ['./web-page-footer.component.scss'],
})
export class WebPageFooterComponent implements OnInit {
  year:any;
  adminPath:any
  constructor(public store: StorageService,public router: Router, private menu: MenuController) {
    var currentTime = new Date()
    this.adminPath = environment.redirectAdmin;
    this.year = currentTime.getFullYear()
  }
  ngOnInit() {
  }

  openPage(path){
    this.router.navigateByUrl(path)
  }
}
