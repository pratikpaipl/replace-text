import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'seo-hidden-tag',
  templateUrl: './seo-hidden-tag.component.html',
  styleUrls: ['./seo-hidden-tag.component.scss'],
})
export class SeoHiddenTagComponent implements OnInit {
 
  @Input()
  head: string='';
  @Input()
  description: string='';
 
  constructor(public store:StorageService) {}
  ngOnInit() {
  }
}
