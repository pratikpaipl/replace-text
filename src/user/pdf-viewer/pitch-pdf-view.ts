import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'pitch-pdf',
  templateUrl: './pitch-pdf-view.page.html',
})
export class PitchPdfPage implements OnInit {
  pdfBase:any
  displayName:any
  isLoad=false
  breadCrumpData:any;
  notfound:any;
  ptype:any;
  pSlug:any;
  fSlug:any;
  fileName:any
  PLATFORMID:any
  constructor(@Inject(PLATFORM_ID)  platformId: any,private apiService: ApiService,protected _sanitizer: DomSanitizer,public activatedRoute: ActivatedRoute, public router: Router, public store: StorageService) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    this.pSlug= this.activatedRoute.snapshot.paramMap.get('pSlug')
    this.fSlug= this.activatedRoute.snapshot.paramMap.get('fSlug')
    this.ptype= this.activatedRoute.snapshot.paramMap.get('ptype')
   
  }

  ngOnInit(){
    
    let apiEnd = 'fundraise/view_pitch'
    let type = 'view'
    let postData = new FormData();
    postData.append("FN_EnablerSlug", this.fSlug);
    postData.append("FP_EnablerSlug", this.pSlug);
    postData.append("RequestStatus", 'approved');
    this.apiService.pitchCall(type, apiEnd, postData).subscribe(response => {
      let res: any = response;
      this.notfound=res.message
      this.isLoad= !res.success 
      if (res.success) {
        // this.pdfSource=atob(res.data.detail.PitchFile)+'#toolbar=0'; 
        // this.pdfSource=res.data.detail.PitchFile !=undefined? atob(res.data.detail.PitchFile):undefined; 
        // console.log('pdfSource ', this.pdfSource)
        this.pdfBase = res.data.detail.PitchFileData != undefined?res.data.detail.PitchFileData:undefined; 
        this.displayName = res.data.detail.FNReferenceCode +' '+ this.store.getVal('view_pitch')

        let  extraPath = 'funding-profile/match-report'
        var ld = []//res.data.bread_crump_data;
        ld.push({ PageName: res.data.detail.FPReferenceCode, PageSlug: this.pSlug, PageType: 'funding-profile-match-report',action:'profile-form',extraPath,extraType:'fundraise-need-match-report'})
        this.breadCrumpData = { list: ld, Page: 'fundraise-need-match-report' }
        }
        // console.log('this.breadCrumpData ',this.breadCrumpData)
      });
  }

  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}
  

}
