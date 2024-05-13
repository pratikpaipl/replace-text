import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { StorageService } from 'src/shared/StorageService';
@Component({
  selector: "app-share",
  templateUrl: "./share.component.html",
  styleUrls: ["./share.component.scss"],
})
export class ShareComponent {
  ShareUrl: any;
  prod: any

  optionsWeb: InAppBrowserOptions = {
    clearcache: 'yes',
    clearsessioncache: 'yes',
    hardwareback: 'yes',
  };
  constructor(public navParams: NavParams, public store: StorageService,public router: Router, public modalCtrl: ModalController, private iab: InAppBrowser) {

  }
  async ngOnInit() {
    this.prod = this.navParams.get('value');
     this.ShareUrl =this.prod.ShareUrl
    //  this.store = this.store
    // this.ShareUrl = new URL(environment.shareUrl+this.store.lng + '/'+this.prod.type + '/' + encodeURIComponent(this.prod.slug))
  }
  onShare(type) {
    let shareUrl: any;
    if (type == 'fb') {
      shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + this.ShareUrl;
    } else if (type == 'ln') {
      shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.ShareUrl
    } else if (type == 'tw') {
      shareUrl = 'https://www.twitter.com/share?url=' + this.ShareUrl;
    }
    const browser = this.iab.create(shareUrl, '_system', this.optionsWeb);
    // browser.on("loadstop").subscribe((event) => {
    // });
    // browser.on("exit").subscribe(
    //   (event) => {
    //   }
    // );
  }
  close() {
    this.modalCtrl.dismiss("");
  }
  public copyToClipboard() {
    var el = document.getElementById('inputId');
    el.setAttribute('contenteditable', 'true');
    el.focus();
    document.execCommand('selectAll');
    document.execCommand('copy');
    el.setAttribute('contenteditable', 'false');
    el.blur();

    this.store.showToast(this.store.getVal('link_copied_to_clipboard'), 2000)
  }
}
