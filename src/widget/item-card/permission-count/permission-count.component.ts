import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "src/shared/StorageService";

@Component({
    selector: 'permission-count',
    templateUrl: './permission-count.component.html',
    styleUrls: ['./permission-count.component.scss'],
})

export class PermissionCountComponent implements OnInit {

    @Input()
    pageFrom: any = '';
    @Input()
    from: any = '';
    @Input()
    prod: any;
    @Input()
    subtype: any;
    @Input()
    apiAction: any='';
    
    @Output()
    change: EventEmitter<Object> = new EventEmitter<Object>();


    constructor(public store: StorageService,  public router: Router) {

    }

    ngOnInit() {
    }

    brandDetails(item, action?) {
        if (action == undefined)
            action = 'overview'
            let mAction =action
        if (this.store.clickEnable) {
            if (this.pageFrom == 'Top'|| this.pageFrom == 'details') {
                this.change.emit({action:action,mAction:mAction/*,pageFrom:this.pageFrom*/})
            } else {
                // if (this.pageFrom == 'admin')
                //     this.router.navigateByUrl('/admin/label/' + item.LabelSlug + '#' + action);
                // else
                //     this.router.navigateByUrl('/label/' + item.LabelSlug + '#' + action);
            }
        }
    }


}