import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewChildren, QueryList, ElementRef, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit,OnChanges {
  
  filterVal: any=''
  checkAll: any=false

  isAfterFirstOpen = false;
  
  @Input()
  clearable:any=true;
  @Input()
  openPos:any='bottom';
  @Input()
  placeholder:any;
  @Input()
  selectTitle: string;
  @Input()
  sTitle: string;
  @Input()
  limit: any;
  @Input()
  modalName: any;
  @Input()
  bindValue: string;
  @Input()
  bindLabel: any;
  @Input()
  lblPatern: any;
  @Input()
  parentLabel: any;
  @Input()
  labelLogo: any;
  @Input()
  icon: any;

  @Input()
  groupBy: any;
  @Input()
  listName: any;
  @Input()
  modal: any;
  @Input()
  list: any=[];
  @Input()
  linkLabel: any;
  @Input()
  linkNote: any;
  @Input()
  isNote: any=false;
  @Input()
  isError: any=false;
  @Input()
  isValidate: any=true;
  @Input()
  multiple: any=false;
  @Input()
  disabled: any=false;
  @Input()
  isLogo: any=false;
  @Input()
  isNewTag: any=false;
  @Input()
  isCreate: any=false;
  @Input()
  maxlength: any='200';

  openSelect: any=false;
  
  // @ViewChild('select') content: any;
  @ViewChild('content') select: NgSelectComponent;
  @ViewChildren('filterInput') filterInput : QueryList<ElementRef>;
  @ViewChildren('createNew') createNew : QueryList<ElementRef>;

  PLATFORMID:any

  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  

  constructor(@Inject(PLATFORM_ID) platformId: any,public store:StorageService) {
    this.PLATFORMID = isPlatformBrowser(platformId)    
  }
 
  ngOnInit() {
    if(this.PLATFORMID){
      $(document).on({
        mouseenter: function () {
          $(this).removeAttr("title");
        },
        mouseleave: function () {
          $(this).removeAttr("title");
        }
      }, "span.ng-clear-wrapper");
      $(".ng-clear-wrappe").attr('tabindex', -1);
      // $(":input:not(:hidden)").each(function (i) { $(this).attr('tabindex', "-1"); });
    }
    this.checkAll = (this.modal != undefined && this.modal != '' && (this.modal.length == this.list.length))
  }
  ngOnChanges(changes: SimpleChanges): void {  
    if(this.modal !=undefined && this.modal != '' && typeof this.modal =='object'){
      let extra=[]
      for (let i = 0; i < this.modal.length; i++) {
        const element = this.modal[i];       
        var idx = this.list.findIndex(p => p[this.bindValue] == element);              
        if(idx == -1){
          extra.push(element)
        }
      }
      for (let i = 0; i < extra.length; i++) {
        const element = extra[i];        
        const index = this.modal.indexOf(element, 0);
          if (index > -1) {
            this.modal.splice(index, 1);
          }
      }
    }
  }
    
  onOpen(select){
    if(this.filterInput != undefined && this.filterInput.changes !=undefined) {
      this.filterInput.changes.subscribe(res=>{
        if(this.filterInput.first !=undefined){
          this.filterInput.first.nativeElement.focus()
        }
        this.checkAll = (this.modal != undefined && this.modal != '' && (this.modal.length == this.list.length))
      })
    }
  }
  Search(select){
  }
    replaceDisplayObj(url, data) {
    var regex = new RegExp(':(' + Object.keys(data).join('|') + ')', 'g');
    let ret =url.replace(regex, (m, $1) => data[$1] || m); 
    if(this.lblPatern == 'company') {
      return (data.CompanyName != undefined && data.CompanyName != ''?data.CompanyName:'') + (data.CompanyDisplayName != undefined && data.CompanyDisplayName != ''?(' ('+data.CompanyDisplayName+')'):'') + (data.CountryName != undefined && data.CountryName != ''?(' > '+data.CountryName):'')
    }
    return (data[this.bindValue] != undefined && data[this.bindValue] !='')?ret:undefined
}
  displayPatern(item){
    return item !=undefined? this.replaceDisplayObj(this.lblPatern, item):'';
  }
  displayName(item){
    return item != undefined?(item[this.bindLabel]):''
  }
  parentName(item){
    return item != undefined?(item[this.parentLabel]):''
  }
  logoName(item){
    let dt= item != undefined?(item[this.labelLogo]):'';
    return dt
  }
  addNewTags = (term) => ({ [this.bindValue]: term, [this.bindLabel]: term });
  chekTitle(select?) {
    if(this.list.length > 0) {
      if (this.checkAll) {
        return this.store.getVal('unselect_all');
      } else {
        return this.store.getVal('select_all');
      }
    }
  }
  selectNext(){
    if(this.createNew.first !=undefined){
      this.createNew.first.nativeElement.focus()
    }
  }
  async filter(event,select){    
    if(select.isOpen){
      await select.filter(event.target.value)
      this.checkUpdate(select)
    }else{
      select.filter('')
    }
  }
  checkUpdate(select: any) {
    setTimeout(() => {
      let isCheck = select.viewPortItems.length !=0;
      for (let index = 0; index < select.viewPortItems.length; index++) {
        const element = select.viewPortItems[index];
        if(!element.selected){
          isCheck = false;
        }
      }
      this.checkAll = isCheck   
    }, 100);
    
  }
  async toggleCheckAll(select) {
    if(this.modal !=undefined)
   await this.checkUpdate(select)
    if (!this.checkAll) {
      this.selectAllItems(select);
    } else {
      this.unselectAllItems(select);
    }
    if(this.multiple){
      this.change.emit({select:select,modalName:this.modalName,modal:this.modal,isCreate:this.isCreate,isNewTag:this.isNewTag,list:this.list,listName:this.listName})
    }
  }
  isAll(select){
    return (this.multiple && select?.itemsList?._filteredItems.length>0 && this.limit== undefined)
  }

  private selectAllItems(select) {
    
    const newList= this.modal !=undefined && this.modal.length !=0?this.modal:[]
    for (let i = 0; i < select.itemsList._filteredItems.length; i++) {
      const element = select.itemsList._filteredItems[i].value;
      select.itemsList._filteredItems[i].selected=true
      newList.push(element[this.bindValue])
    }
    this.modal = [...new Set(newList)];
  }
  
  private unselectAllItems(select) {
    for (let i = 0; i < select.itemsList._filteredItems.length; i++) {
      select.itemsList._filteredItems[i].selected=false
      const index: number = this.modal.indexOf(select.itemsList._filteredItems[i].value[this.bindValue]);
      if (index !== -1) {
        this.modal.splice(index, 1);
      } 
      for (let k = 0; k < select.itemsList._selectionModel._selected.length; k++) {
        const mo = select.itemsList._selectionModel._selected[k].value;
        if(mo[this.bindValue] == select.itemsList._filteredItems[i].value[this.bindValue]){
          select.itemsList._selectionModel._selected.splice(k, 1)
        }
      }
    }
  }
  onSelectionChange(event,select) {
    this.checkAll = Object.keys(select.viewPortItems).every(function (k:any) {
      return k.selected ==true;
    });
    if(this.multiple && event != undefined && Array.isArray(event)){
      this.checkUpdate(select)
      this.change.emit({select:select,modalName:this.modalName,modal:this.modal,isCreate:this.isCreate,isNewTag:this.isNewTag,list:this.list,listName:this.listName})
    }
    if(!this.multiple  && (event == undefined || event.target == undefined)){
      this.checkUpdate(select)
      this.change.emit({select:select,modalName:this.modalName,modal:this.modal,isCreate:this.isCreate,isNewTag:this.isNewTag,list:this.list,listName:this.listName})
    }
  }
  CreateNew(select){
    this.change.emit({select:select,modalName:this.modalName,modal:undefined,isCreate:this.isCreate,list:this.list,listName:this.listName ,createNew:true})
  }
}
