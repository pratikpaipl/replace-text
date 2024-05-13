import { Component, OnInit, Input } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'tag-line',
  templateUrl: './tag-line.component.html',
  styleUrls: ['./tag-line.component.scss'],
})
export class TagLineComponent implements OnInit {
  @Input()
  isShowLogo: boolean = false;
  @Input()
  extra: boolean = false;
  @Input()
  fLbl: string;
  @Input()
  msg:any;

  constructor(public store: StorageService) {
  }

  ngOnInit() {

  }
}
