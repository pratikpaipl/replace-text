import { Component, EventEmitter, Input, OnInit, HostListener,  Output, Inject, PLATFORM_ID  } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "src/shared/StorageService";
import * as $ from 'jquery';
import { isPlatformBrowser } from "@angular/common";


@Component({
    selector: 'label-right-img',
    templateUrl: './label-right-img.component.html',
    styleUrls: ['./label-right-img.component.scss'],
})

export class LabelRightImgCountComponent implements OnInit {

    @Input()
    Slug: any = ''
    @Input()
    Click: any=true;
    @Input()
    prod: any;
    @Input()
    subtype: any;
    @Input()
    pageFrom: any = '';
    @Input()
    from: any = '';
    @Input()
    openFront: string = '0';
    @Input()
    apiAction: any = '';
    @Input()
    dataType: any = '';

    DynamicWidth = '240px';
    IsFullView = false;
    @Input()
    SdgList:any = [];
    @Input()
    allDisplay:any = false;

    minCount=2
    PLATFORMID:any=false
    @Output()
    change: EventEmitter<Object> = new EventEmitter<Object>();
    constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService,  public router: Router) {
      this.PLATFORMID = isPlatformBrowser(platformId)
    }

    async ngOnInit() {
     
      this.SdgList = await (this.prod.Sdgs != undefined && this.prod.Sdgs != '')?JSON.parse(this.prod.Sdgs):(this.prod.SdgsJson != undefined && this.prod.SdgsJson != '')?JSON.parse(this.prod.SdgsJson):this.SdgList;
      this.minCount = this.allDisplay?this.SdgList.length:2
      if(this.PLATFORMID && !this.allDisplay){
      setTimeout(() =>
      {
        this.setIconCnt();
      },1000)}
    }
    @HostListener('window:resize', ['$event'])
    private onResize(event) {
      if(this.PLATFORMID&& !this.allDisplay)
       this.setIconCnt()
    }
  setIconCnt() {
    let $this = this
        $('.vagen_icons_list').each(function () 
        {
            var eleheight = $(this).find('.vagen_imgboxs').find('.image_main').height();

            if ($(this).height() > eleheight) 
            {
              $(this).parent().addClass('visible')
            }else 
            {
              $(this).parent().removeClass('visible')
            }

            var datawitd2 = $(this).find('.vagen_imgboxs').width();
            var imagesw2 = $(this).find('.vagen_imgboxs .image_main').width();
            var totw = imagesw2+5;
            var total = datawitd2/totw;   
            $this.minCount = Math.trunc(total);
        });  
        
        $(".vagen_icons_list .more_info_img").click(function (e) {
          $(this).parent().parent().addClass('open');
        });

        $(".vagen_icons_list .less_info_img").click(function (e) {
          $(this).parent().parent().parent().removeClass('open');
        });
  }
    brandDetails() {
        this.IsFullView = !this.IsFullView        
    }
    callFilter(entry:any){
      this.change.emit({Filter:true,Type:this.dataType,item:this.prod})
    }
}