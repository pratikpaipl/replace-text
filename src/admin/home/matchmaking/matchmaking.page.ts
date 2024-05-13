import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import moment from 'moment';
import { ApiService } from 'src/services/api.service';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { SegmentModel } from 'src/shared/segment.model';
import { Page } from 'src/widget/items/model/page.class';
import { ResponseTbl } from 'src/widget/items/model/response-tbl.class';

@Component({
  selector: 'matchmaking',
  templateUrl: './matchmaking.page.html',
  styleUrls: ['./matchmaking.page.scss'],
})
export class MatchmakingPage implements OnInit, OnDestroy {

  public segments: SegmentModel[] = []
  public selectedSegment: string = '';
  public selectedSegmentLbl: string = '';

  pageType = 'matchmaking'
  @ViewChild('content') content: any;

  @Input()
  updateTime:any

  columnsWithSearch: string[] = ['ReferenceName'];
  filteredData = [];
  temp = [];

  currency = "CHF"
  amount = "10"
  loadMsg;
  InvestorsFile;
  InvesteesFile;

  InvestorsFileInValid = false;
  InvesteesFileInValid = false;

  columnsMatchMaking: any = [
    { prop: 'name', name: '',sortable: false, showExp: true, resisable: true, width: 60, color: 'matched' },
    { prop: 'TotalCount', name: 'number_of_records', sortable: false, showExp: true, resisable: true, width: 80, color: 'matched' },
    { prop: 'ValidCount', name: 'suitable_for_matchmaking', sortable: false, showExp: true, resisable: true, width: 120, color: 'matched' },
    { prop: 'DataIssuesCount', name: 'data_issues', sortable: false, showExp: true, resisable: true, width: 80, color: 'matched' },
    { prop: '', name: 'validation_result', sortable: false, showExp: true, resisable: true, width: 200, color: 'matched' }
  ];

  columnsActivityLog: any = [
    { prop: 'SummaryID',frozenLeft:false,  name: 'execution_number', sortable: false, showExp: true, resisable: true, width: 90, color: 'matched' },
    { prop: 'SummaryStatus',frozenLeft:false, name: 'status', sortable: false, showExp: true, resisable: true, width: 100, color: 'matched' },
    { prop: 'NumberOfInvestors',frozenLeft:false, name: 'number_of_investors_included_in_matchmaking_number_of_investors', sortable: false, showExp: true, resisable: true, width: 200, color: 'matched' },
    { prop: 'NumberOfInvestees',frozenLeft:false, name: 'number_of_investees_included_in_matchmaking_number_of_investees', sortable: false, showExp: true, resisable: true, width: 200, color: 'matched' },
    { prop: 'TotalMatched',frozenLeft:false, name: 'matched', sortable: false, showExp: true, resisable: true, width: 100, color: 'matched' },
    { prop: 'CreatedTs',frozenLeft:false, name: 'last_update_utc', sortable: false, showExp: true, resisable: true, width: 180, color: 'matched', isDate: true },
    { prop: 'Paid',frozenLeft:false, name: 'paid', sortable: false, showExp: true, resisable: true, width: 180, color: 'matched' },
  ];

  page = new Page();
  activityPage = new Page();
  activityLogTotal: any;
  SummaryResponse: any;
  isEnabled:any;
  rowsMatchMaking: any = Array<ResponseTbl>();
  rowsMatchMakingMobile: any = Array<ResponseTbl>();
  rowsActivityLog: any = Array<ResponseTbl>() // = [
  // { executionNumber: 5,status:7,NoOfInvestorIncMatchInvestor:10,NoOfInvesteesIncMatchInvestees:3,Matched:4, LastUpdateUtc:'Tuesday, January 9, 2024 at 2:50:16 am',Paid:'CHF150'},
  // ];
  rowsActivityLogMobile: any = Array<ResponseTbl>();
  isLoading = false;
  isShowMsg = false;
  ReferanceTotal = 0;
  isResize = false
  isMobile = false

  summaryTime:any
  formateRules = [
    { icon: 'fa-solid fa-cloud-arrow-down', label: 'funder_csv_data_formats_and_rules', ref: 'https://drive.google.com/drive/folders/1HW6CS7VUHxkGc_-Ykl7WegQc5nHUbR63' },
    { icon: 'fa-solid fa-cloud-arrow-down', label: 'funder_investor_template', ref: 'https://drive.google.com/drive/folders/1HW6CS7VUHxkGc_-Ykl7WegQc5nHUbR63' },
    { icon: 'fa-solid fa-cloud-arrow-down', label: 'funder_investor_sample_data', ref: 'https://drive.google.com/drive/folders/1HW6CS7VUHxkGc_-Ykl7WegQc5nHUbR63' },
    { icon: 'fa-solid fa-cloud-arrow-down', label: 'funder_investee_template', ref: 'https://drive.google.com/drive/folders/1HW6CS7VUHxkGc_-Ykl7WegQc5nHUbR63' },
    { icon: 'fa-solid fa-cloud-arrow-down', label: 'funder_investee_sample_template', ref: 'https://drive.google.com/drive/folders/1HW6CS7VUHxkGc_-Ykl7WegQc5nHUbR63' },
  ]
  constructor(public modalController: ModalController,public alertController: AlertController, private route: ActivatedRoute, public store: StorageService, public apiService: ApiService, public router: Router, private eventService: EventService) {

    this.page.pageNumber = 0;
    this.page.size = 10;
    this.activityPage.pageNumber = 0;
    this.activityPage.size = 10;

    this.segments.push({ key: 'matchmaking', icon: 'fa-solid fa-file-csv', label: this.store.getVal('matchmaking') })
    this.segments.push({
      key: 'activity-log', icon: 'fa-solid fa-chart-line', label: this.store.getVal('activity_log')
    })
    this.segments.push({
      key: 'data-format-rules', icon: 'fa-solid fa-pen-ruler', label: this.store.getVal('data_format_rules')
    })

    this.eventService.updateLabel$.subscribe((item: any) => {
      this.segments[0].label = this.store.getVal('matchmaking')
      this.segments[1].label = this.store.getVal('activity_log')
      this.segments[2].label = this.store.getVal('data_format_rules')
    });
  }
  ngOnInit() {
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.pageType = this.route.snapshot.fragment != null && (this.route.snapshot.fragment == 'matchmaking' || this.route.snapshot.fragment == 'activity-log' || this.route.snapshot.fragment == 'data-format-rules') ? this.route.snapshot.fragment : 'matchmaking';
    if (this.pageType == 'activity-log') {
      this.setPage(false, { offset: 0 })
    } else if (this.pageType == 'matchmaking') {
      this.impactInvestmentInfo()
    }
  }
  onClickSegment(event) {
    this.pageType = event;
    if (this.pageType == 'activity-log') {
      this.setPage(false, { offset: 0 })
    } else if (this.pageType == 'matchmaking') {
      this.impactInvestmentInfo()
    }
  }
  ngOnDestroy() {
  }
  callAction(event, Index) {
    if(event != undefined){
      if(event.FunctionName =='downloadInValidResult'){        
        this['' + event.FunctionName](event.name, event.SummaryID)
      }else{
        this['' + event.FunctionName](event.Item, Index)
      }
    }
  }

  changeListener($event, from): void {
    // Get the selected file from the file input

    var regex = new RegExp("(.*?)\.(csv)$");

    let File = $event.target.files[0];
    // Check if a file is selected
    if (File != undefined) {
      if (!(regex.test(File.name.toLowerCase()))) {
        $('#'+from).val('')
        this[from + 'InValid'] = true
        this['' + from] = undefined;
        this.loadMsg = this.store.getVal('only_csv_format_allowed')
      }else{
        // Check if the file size is within the allowed limit (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (File.size <= maxSize) {
          this[from + 'InValid'] = false
          // Update a property in your component with the selected file
          this['' + from] = File;
        } else {
          // Log an error if the file size exceeds the allowed limit
          console.error('File size exceeds the maximum limit (5MB)');
          this[from + 'InValid'] = true
        }
      }
    }
  }
  validateFiles() {
    let call = false
    if (this.InvestorsFile == undefined) {
      call = true
      this.InvestorsFileInValid = true
    }
    if (this.InvesteesFile == undefined) {
      call = true
      this.InvesteesFileInValid = true
    }
    if (!call) {
      let postData = new FormData();
      postData.append('InvestorsFile', this.InvestorsFile, this.InvestorsFile.name);
      postData.append('InvesteesFile', this.InvesteesFile, this.InvesteesFile.name);
      this.apiService.addData('matchmaking_api', postData, 'add', 'ValidateForImpactInvestmentJSON').subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.SummaryResponse = res.data.SummaryResponse
          this.isEnabled = (this.SummaryResponse !=undefined ?((this.SummaryResponse.RunMatchmaking)?'0':'1'):undefined)
          this.rowsMatchMaking = res.data.ValidationResult != undefined?res.data.ValidationResult:[]
          this.InvestorsFile = undefined
          this.InvesteesFile = undefined
          $('#InvestorsFile').val('')
          $('#InvesteesFile').val('')
          this.getSummarytime();
        } else {
          this.loadMsg = res.message
          setTimeout(() => {
            this.store.scrollTo('topRow');
          }, 500);
        }
      });
    }

  }

  onDeleteFile(from) {
    if(from == 'InvestorsFile') {
      this.InvestorsFile = undefined;
    } else if(from == 'InvesteesFile') {
      this.InvesteesFile = undefined;
    }
    $('#'+from).val('')
  }

  downloadInValidResult(RowType = '', SummaryID = null) {
    let call = false
    if (RowType == undefined && SummaryID > 0) {
      call = true
    }
    if (!call) {
      let postData = new FormData();
      postData.append('RowType', RowType);
      postData.append('SummaryID', SummaryID);
      this.apiService.addData('matchmaking_api', postData, '', 'ImpactInvestmentDownload').subscribe(async response => {
        let res: any = response;
        if (res.success) {
          if(res.data.row_list !=undefined) {
            this.downloadToCSV(RowType, res.data.row_list);
          }
        } else {
          this.loadMsg = res.message
          setTimeout(() => {
            this.store.scrollTo('topRow');
          }, 500);
        }
      });
    }

  }

  downloadToCSV(RowType, row_list) {
    let sampleJson: any = row_list;
    // let sampleJson: any = [
    //   {
    //     "SummaryID": 15,
    //     "InvestorRowNumber": 81,
    //     "InvestorID": "SIP-006-973-27",
    //     "InvestorPercentage": 27.71,
    //     "InvestorMatchmaking": "Yes",
    //     "InvesteeRowNumber": 35,
    //     "InvesteeID": "SIR-006-689-96",
    //     "InvesteesPercentage": 41.17,
    //     "InvesteeMatchmaking": "Yes"
    //   }
    // ]
    let a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    let csvData = this.ConvertToCSV(sampleJson);
    let blob = new Blob([csvData], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.store.getVal(RowType);
    // a.download = 'sample.csv';
    a.click();
  }

  ConvertToCSV(objArray) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = "";
    for (let index in objArray[0]) {
      //Now convert each value to string and comma-separated
      row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in array[i]) {
        if (line != '') line += ',';
        line += array[i][index];
      }
      str += line + '\r\n';
    }
    return str;
  }

  getSummarytime(){
    if(this.SummaryResponse != undefined){
      let tmFormate= this.store.getVal('utc');
      this.summaryTime = ((this.SummaryResponse.ModifiedTs != undefined?((moment.utc(this.SummaryResponse.ModifiedTs).format('DD MMM YYYY hh:mm a')).toUpperCase()+' '+tmFormate):''))
    }
  }

  async onDraft(){
    const alert = await this.alertController.create({
      header: this.store.getVal('delete'),
      message: this.store.getVal('delete_confirmation'),
      animated: true,
      cssClass: 'alertCustomCssBtn',
      buttons: [
        {
          text: this.store.getVal('cancel'),
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: this.store.getVal('delete'),
          handler: () => {
            this.callDeleteApi()
          }
        }
      ], backdropDismiss: true
    });
    return await alert.present();
  }
  callDeleteApi() {
    let postData = new FormData();
    postData.append('SummaryID',this.SummaryResponse.SummaryID)
    this.apiService.deleteData('matchmaking_api/ImpactInvestmentDelete', postData).subscribe(response => {
      let res: any = response;
      if (res.success) {
        this.SummaryResponse=undefined
      }
      this.store.showToast(res.message, 2000,!res.success?'error':undefined);
    });
  }
  runMatchMaking() {
    let call = false
    if (this.SummaryResponse.SummaryID == undefined && this.SummaryResponse.SummaryID > 0) {
      call = true
    }

    if (!call) {
      let postData = new FormData();
      postData.append('SummaryID', this.SummaryResponse.SummaryID);
      this.apiService.addData('matchmaking_api', postData, 'add', 'matchmakingForImpactInvestmentJSON').subscribe(async response => {
        let res: any = response;
        if (res.success) {
          this.rowsMatchMaking = [];
          this.SummaryResponse=undefined
          this.store.showToast(res.message, 2000);
        } else {
          this.loadMsg = res.message
          setTimeout(() => {
            this.store.scrollTo('topRow');
          }, 500);
        }
      });
    }

  }

  impactInvestmentInfo() {
    this.apiService.impactInvestmentInfo().subscribe(async response => {
      let res: any = response;
      if (res.success) {
        this.SummaryResponse = (res.data.SummaryResponse != undefined) ? res.data.SummaryResponse : undefined;
        this.isEnabled = (this.SummaryResponse !=undefined ?((this.SummaryResponse.RunMatchmaking)?'0':'1'):undefined)
        this.rowsMatchMaking = (res.data.ValidationResult != undefined) ? res.data.ValidationResult : [];
        this.getSummarytime();
      } else {
        this.loadMsg = res.message
        setTimeout(() => {
          this.store.scrollTo('topRow');
        }, 500);
      }
    });
  }

  setPage(isFirstLoad, pageInfo, event?) {
    let parms = '?Keyword=&SortBy=recent'
    if(this.pageType == 'activity-log'){
      this.activityPage.pageNumber = pageInfo.offset;
    }else{
      this.page.pageNumber = pageInfo.offset;
    }
    this.isLoading = true
    this.apiService.getResults('matchmaking_api/ImpactInvestmentActivityLog',((this.pageType == 'activity-log')?this.activityPage:this.page), parms).subscribe(pagedData => {
      this.isLoading = false
      this.isResize = false;
      // this.page = pagedData.page;
      if(this.pageType == 'activity-log'){
        this.activityPage = pagedData.page;
      }else{
        this.page = pagedData.page;
      }
      if (pageInfo.offset == 0) {
        this.rowsActivityLog = []
        this.rowsActivityLogMobile = []
      }
      this.rowsActivityLog = pagedData[`results`];
      for (let i = 0; i < this.rowsActivityLog.length; i++) {
        let sele = JSON.parse(JSON.stringify(this.rowsActivityLog[i]));
        const element = this.rowsActivityLog[i];
        element.NumberOfInvestors = sele.TotalInvestorsIncludedInMatchmaking+ ' / ' +sele.NumberOfInvestors  
        element.NumberOfInvestees = sele.TotalInvesteesIncludedInMatchmaking+ ' / ' + sele.NumberOfInvestees 
        this.rowsActivityLogMobile.push(element)
      }
      this.rowsActivityLogMobile = this.rowsActivityLogMobile.reduce((unique, o) => {
        if (!unique.some(obj => obj.SummaryID === o.SummaryID)) {
          unique.push(o);
        }
        return unique;
      }, []);
      this.activityLogTotal = (pagedData.page.totalElements != undefined ? pagedData.page.totalElements : 0)
      // this.PermissionTextKey = pagedData.datas.PermissionTextKey
      // this.change.emit({ count: (pagedData.page.totalElements != undefined?pagedData.page.totalElements:0), permissions: this.PermissionTextKey, pageType: this.apiAction })
      // this.isShowMsg = this.store.msgDisplay(this.rowsActivityLog.length == 0 || this.rowsActivityLogMobile.length == 0);
      if (isFirstLoad) {
        if (event != undefined && event.target != undefined)
          event.target.complete();
      }
      if (this.rowsActivityLogMobile.length == this.activityLogTotal) {
        if (event != undefined && event.target != undefined)
          event.target.disabled = true;
      }
    });
  }
  getRowHeight(row) {
    if (!row.expanded) {
      return 60;
    }
    if (row.expanded) {
      return 'auto';
    }
    return row.height;
  }
}

