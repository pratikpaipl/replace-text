import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { actType, appApi } from 'src/shared/app.constants';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'btn-title',
  templateUrl: './btn-title.component.html',
  styleUrls: ['./btn-title.component.scss'],
})
export class BtnTitleComponent implements OnInit {

  @Input()
  pageLbl: string;

  @Input()
  pageType: string;

  @Input()
  permissions: any = [];

  @Input()
  from: any = ''

  @Input()
  allTotal: any = 0

  @Input()
  sort: any = 'recent'


  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService, public router: Router, public eventService: EventService, public apiService: ApiService) {

  }

  ngOnInit() {
  }
  ngOnChanges() {
  }
  actionCall(type) {
    this.change.emit(type);
  }
  onImport() {
    this.router.navigateByUrl('admin/import-location');
  }
  onAction() {
    if (this.pageType == 'users')
    this.router.navigateByUrl('admin/user/add');
    else if (this.pageType == 'enablers')
    this.router.navigateByUrl('admin/add-enabler');
    else if (this.pageType == 'import_files')
    this.router.navigateByUrl('admin/add-import-files');
    else if (this.pageType == 'funding-profiles')
    this.router.navigateByUrl('user/master/investor/add_fp');
    else if (this.pageType == 'fundraise')
    this.router.navigateByUrl('user/master/investee/add_fn');
  }

  download() {
    let keyword = this.store.getFilterFromUrl('keyword', '')
    let sort = this.store.getFilterFromUrl('sort', 'recent')
    let countryOfEnabler = this.pageType == 'enablers'? this.store.getFilterFromUrl('countryOfEnabler',[]):'';
    let ImpactThemesAndAreasKey = this.store.getFilterFromUrl('ImpactThemesAndAreasKey', []);
    let SdgIDs = this.store.getFilterFromUrl('SdgIDs',[]);
    let EsgKeys = this.store.getFilterFromUrl('EsgKeys',[]);
    
    if(this.from == 'profile' && (this.pageType == 'funding-profile' || this.pageType == 'funding-profiles')) {
      this.apiService.callDownload(appApi.myFPListExcel, '', '', keyword, sort,actType.funding_profile,undefined,undefined,undefined,undefined,undefined,ImpactThemesAndAreasKey,SdgIDs,EsgKeys);
      // this.apiService.callDownload(appApi.myFPListExcel, '', '', '', this.sort,actType.funding_profile,undefined,undefined,undefined,undefined,undefined);
    }
    if(this.from == 'profile' && (this.pageType == 'fundraise' || this.pageType == 'fundraise-need'|| this.pageType == 'fundraise-needs')) {
      this.apiService.callDownload(appApi.myFNListExcel, '', '', keyword, sort,actType.fundraise,undefined,undefined,undefined,undefined,undefined,ImpactThemesAndAreasKey,SdgIDs,EsgKeys);
    }
    
  }
}

