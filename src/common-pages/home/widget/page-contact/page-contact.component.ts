import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'page-contact',
  templateUrl: './page-contact.component.html',
  styleUrls: ['./page-contact.component.scss'],
})
export class PageContactComponent implements OnInit {
  @Input()
  msg:any=''
  @Input()
  btn:any=''
  constructor(public store: StorageService,public router: Router, private menu: MenuController) {}

  ngOnInit() {
  }

  openPage(path){
    this.router.navigateByUrl(path)
  }
}
