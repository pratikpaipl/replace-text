import { Component, OnInit, Input, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'editor-data-view',
  templateUrl: './editor-data-view.component.html',
  styleUrls: ['./editor-data-view.component.scss'],
})
export class EditorDataViewComponent implements OnInit {

  @Input()
  title: string;
  @Input()
  content: string;
  @Input()
  clName: string;

  PLATFORMID:any=false
  constructor(@Inject(PLATFORM_ID) platformId: any,public store: StorageService,public san: DomSanitizer) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }

  ngOnChanges() {
  }
  ngOnInit() {
  }  
}
