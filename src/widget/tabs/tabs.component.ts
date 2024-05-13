import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/shared/EventService';
import { StorageService } from 'src/shared/StorageService';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit, OnDestroy {

  selectPage;

  @Input()
  customClass: string = '';
  @Input()
  from: string;
  @Input()
  selectedSegment: string='';
  @Input()
  type: string;
  @Input()
  pageSlug: string;
  @Input()
  showTwoLine: any=false;

  @Input()
  segments: any = [];
  @Input()
  styleD: any = '-webkit-box';
  @Input()
  indHeight: any = '2px';
  isExpand=false
  isScrolled=false
  
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  private subSelectSegment: any;
  PLATFORMID: any;

  constructor(@Inject(PLATFORM_ID) platformId: any,private eventService: EventService,public store:StorageService, public router: Router, private route: ActivatedRoute, private cdref: ChangeDetectorRef) {

    this.PLATFORMID = isPlatformBrowser(platformId)

    this.subSelectSegment = this.eventService.changeSegment$.subscribe(async (item: any) => {
        this.setSegment(item.action);
    });
    
  }
  ngOnDestroy() {
    this.subSelectSegment.unsubscribe();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {this.setSegment(fragment);});
  }
  ngOnChanges() {
    if(this.store.appType =='front'){
      this.setSegment(this.selectedSegment);
    }
    if(this.store.appType =='admin')
    this.moveToSegmentAdmin('change') 
    if(this.store.appType !='admin' && !this.router.url.includes('/user') && this.PLATFORMID)
    this.moveToSegment('init') 
  }

  onClick(event,segment){
    if(segment.key != 'switch-to-marcket-place'){
      if((this.store.appType =='front') && !this.router.url.includes('/user') && this.from != 'auth')
      this.selectedSegment=segment.key
      if((this.store.appType =='front') && !this.router.url.includes('/user') && this.from != 'auth'){
          let path
          if(this.from != 'details' && this.from != 'f-details')
          path='/explore/'+segment.key;
          else if((this.from == 'details' || this.from == 'f-details'))
          path='/'+this.type+'/'+this.pageSlug+'/'+segment.key
            if(this.from != 'details' && this.from != 'f-details')
            this.store.navigatePage([path],undefined,undefined,undefined,true);
            else if((this.from == 'details' || this.from == 'f-details'))
            this.store.navigatePage([path],undefined,undefined,undefined,true);
      }
      if(this.router.url.includes(segment.key)){
        this.eventService.publishApplyTabReload({updateTime:new Date().getTime(),page:segment.key,segment:segment.key,reload:true,pageFrom:this.store.appType=='front'?'user':'admin'})
        this.eventService.publishApplyFilter({updateTime:new Date().getTime(),page:segment.key,segment:segment.key,reload:true,pageFrom:this.store.appType=='front'?'user':'admin'})
      }
    }else{
      window.open(environment.redirectFrontPath, '_blank')
    }
  }
  onClickSegment(event: any): void {
    if (event.detail && typeof event.detail.value === 'string') {
      this.selectPage = event.detail.value;
      this.setSegment(this.selectPage);
      this.change.emit(this.selectPage);
    }
  }
  setSegment(segment: string): void {
    if (typeof segment === 'string') {
      segment = segment.toLowerCase();
      const arrayHas = this.segments.some((candidate) => { return candidate.key === segment; });
      if (arrayHas) {
        this.selectedSegment = segment;
        if((this.store.appType =='front') && !this.router.url.includes('/user') && this.from != 'auth'){
        }else{
          if(this.PLATFORMID){
            window.location.hash = segment
          }
        }
      }
    }
  }
  moveToSegment(type) {
    setTimeout(() => {      
      let idx = this.segments.findIndex(v => v.key == this.selectedSegment)
      if(!this.isScrolled){
      let npo = idx>1?(idx-1)*90:0
      if(npo != undefined){
          this.isScrolled=true
          $('#tab_navs ion-segment').animate({
            scrollLeft: "+="+npo+"px"
          }, "slow");
        }
      }else{
        this.isScrolled=false
      }
    }, 500);
  }
  moveToSegmentAdmin(type) {
    setTimeout(() => {
      var position = $(document).find('#tab_navs ion-segment-button.segment-button-checked').position();
      if(position != undefined && this.from != 'admin'){
        let nums;
        if(position.left>0){
          var num = position.left-80;
          nums = num.toFixed();
        }else{
          let idx = this.segments.findIndex(v => v.key == this.selectedSegment)
          nums = idx>1?(idx-1)*90:0
        }
        $('#tab_navs ion-segment').animate({
          scrollLeft: "+="+nums+"px"
        }, "slow");
       
      }
    }, 500);
  }

}
