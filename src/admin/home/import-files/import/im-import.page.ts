import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/services/api.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonInfiniteScroll } from '@ionic/angular';
import { StorageService } from 'src/shared/StorageService';
import * as XLSX from 'xlsx';
@Component({
  selector: 'im-import',
  templateUrl: 'im-import.page.html',
  styleUrls: ['im-import.page.scss'],
})
export class AddFilesPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  temptUrl = ''

  isShopTypeUn = false;
  pageTitle = 'Add'
  BrandSlug: any;
  shopType = 'physical'
  file: File;
  fileName: any = '';
  filesPath: any = '';
  fTotal: any;
  brandData: any;
  fileList: any = [];
  permissions: any = [{TextKey:'add'}];
  public subscription: any;
  fields=[]
  exceltoJson = {};
  headerJson = {};
  constructor(public actionSheetController: ActionSheetController, public activatedRoute: ActivatedRoute, public store: StorageService, public router: Router, public apiService: ApiService) {
    this.BrandSlug = this.activatedRoute.snapshot.paramMap.get('from');
    // this.eventService.formReload$.subscribe((item: any) => {
    //   this.fileList = [];
    //   this.viewList(true, "");
    // });

    $(document).on("click", "#deleteImg", function () {
      $('#upload').val('')
    });
    this.brandData=undefined;
    this.onDeleteFile()
  }
  ngOnDestroy() {
    this.brandData = undefined
    this.onDeleteFile();
  }
  async ngOnInit(): Promise<void> {
    this.pageTitle = 'Add'
    this.getData('add');
  }

  getData(type) {
  }
  doInfiniteList(event) {
    this.viewList(true, event);
  }
  changeListener($event): void {
    this.file = $event.target.files[0];
    
    const target: DataTransfer = <DataTransfer>($event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      // /* create workbook */
      // const binarystr: string = e.target.result;
      // const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      // /* selected the first sheet */
      // const wsname: string = wb.SheetNames[0];
      // const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // /* save data */
      // const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      this.exceltoJson = {};
      this.headerJson = {};;
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        // const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        // exceltoJson[`sheet${i + 1}`] = data;
        const headers:any = this.get_header_row(ws);
        this.headerJson[`header${i + 1}`] = headers;
        for (let k = 0; k < headers.length; k++) {
          const element = headers[k];
          this.fields.push({id:element,label:element,data:this.fields})
        }
        // this.fields = headers;
      }
      this.exceltoJson['headers'] = this.headerJson;
    };
  }
  onChange(event,item){
    let indsa= this.fields.findIndex(v => v.selField == item.selField)
    let ind= this.fields[indsa].data.findIndex(v => v.id == item.selField)
  }
  get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; /* start in the first row */
    /* walk every column in the range */
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* find the cell in the first row */
      var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
      if (cell && cell.t) {
        hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
    }
    return headers;
  }
  onDeleteFile() {
    this.file = undefined;
    this.fileName = '';
  }
  async callAction(event) {
    if (event == 1) {
      this.onImportFile()
    }
  }
  onImportFile() {
    if (this.file != undefined) {
      let postData = new FormData();
      if (this.brandData != undefined && this.brandData.BrandID != undefined)
        postData.append('BrandID', this.brandData.BrandID);
      if (this.brandData != undefined && this.brandData.BrandSlug != undefined)
        postData.append('BrandSlug', this.brandData.BrandSlug);

      postData.append('ExcelFile', this.file, this.file.name);


    } else {
      this.store.showToast(this.store.getVal('please_select_excel_file'), 2000);
    }
  }
  onExtract(id) {
    if (this.file != undefined) {

    } else {
      this.store.showToast(this.store.getVal('please_select_excel_file'), 2000);
    }
  }

  downloadTemplate() {
    window.open(this.temptUrl, "_self");
  }

  viewList(isFirstLoad, event) {


  }

  onViewFile(item) {
    if (item.PendingRecords > 0) {
      if (this.store.isNetwork()) {
        this.router.navigateByUrl('/explore/file/view-data/' + item.StockistLocationImportSummaryID);
      }
    } else {
      this.store.showToast(this.store.getVal('all_records_uploaded'), 2000);
    }
  }
  
}
