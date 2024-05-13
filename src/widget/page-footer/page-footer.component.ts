import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
})
export class PageFooterComponent implements OnInit {
  cnt: any = 0;

  @Input()
  contentID: any
  @Input()
  from: any
  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  AddItemList = [{ Item: 'company', TextKey: 'company' }, { Item: 'product', TextKey: 'products' }, { Item: 'service', TextKey: 'services' }, { Item: 'solution', TextKey: 'solutions' }]
  constructor(public store: StorageService, private menu: MenuController, public router: Router) {

  }

  ngOnInit() {
  }

  openFirst() {
    this.menu.enable(true, "home");
    this.menu.open("home");
  }
  goPage(page) {
    this.change.emit({ page: page })
  }
  openPage(path){

    if(this.store.appType =='admin' && !this.store.isLogin){
      path='auth#login'
      this.store.openPage(path,'0')
    }else if(path=='enablers'&& this.store.appType !='admin'){
      path='/explore/enablers'
      this.store.openPage(path,'0')
    }else if(path=='full-report' && this.store.appType !='admin'){
      path='user#full-report'
      if(this.store.isLogin)
      this.store.openPage(path,'0')
      else
      this.store.openPage('auth#login','0')
    }else if(this.store.appType =='admin'){
      this.router.navigateByUrl(this.store.appType + this.store.getSeprater()+path);
    }
    else{
      this.router.navigateByUrl(path);
    }
  }
}

