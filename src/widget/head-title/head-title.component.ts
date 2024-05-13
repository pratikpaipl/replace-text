import { Component, OnInit, Input } from '@angular/core';

import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'head-title',
  templateUrl: './head-title.component.html',
  styleUrls: ['./head-title.component.scss'],
})
export class HeadTitleComponent implements OnInit {
  @Input()
  headTitle: string='';

  constructor() {
  }

  ngOnInit() {
  }
}
