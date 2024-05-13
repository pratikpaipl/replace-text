import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'refresher',
  templateUrl: './refresher.component.html',
  styleUrls: ['./refresher.component.scss'],
})
export class RefresherComponent implements OnInit {

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store: StorageService) {

  }

  ngOnInit() {
  }
  getTodos(event){
    setTimeout(() => {      
      if(event){
        event.target.complete();
        this.change.emit({reload:true});
      }
    }, 1200);
  }
}
