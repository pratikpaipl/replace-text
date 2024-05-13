import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'tree-view-search',
  templateUrl: './tree-view-search.component.html',
  styleUrls: ['./tree-view-search.component.scss'],
})
export class SearchTreeView implements OnInit ,OnChanges {

  @Input()
  filterText: any = ''
  @Input() items: any = []
  @Input() TreeData: any[];
  @Input() preSelected: any[];
  @Input() from: any;
  @Input() clboeder: any='1px solid #ccc';
  @Input() notFoundText: any='';
  @Input() ComponentKey: any='';
  @Input() page: any;
  @Input() disabled: any = false;
  @Input() isCountry: any = false;
   
   
  usersArrayFiltered: any[];
  @Input() hasCheckbox: boolean = true;
  public PLATFORMID: any;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(@Inject(PLATFORM_ID) platformId: any,public store:StorageService) {
    this.PLATFORMID = isPlatformBrowser(platformId)
    if(this.PLATFORMID){
      
      // $('#filterInput').keydown(function(e)
      // {
      //   console.log('#filterInput ',e.keyCode)
        
      // });


      $(document).on('keydown', function(e) {
        
        if (e.keyCode == 9) {
          if ($(".open div.parent tree-view div.parent:last-child ion-item").hasClass("ion-focused"))
          {
            console.log("last ele parent")
            $(document).find('.customview').removeClass('open');
            $(document).find('.outer_overly').removeClass('open');
          }
          if ($(".open div.parent tree-view div.child:last-child ion-item ").hasClass("ion-focused"))
          {
            console.log("last ele child")
            $(document).find('.customview').removeClass('open');
            $(document).find('.outer_overly').removeClass('open');
          }
        }
      });

    
      $(document).on('keydown','input.hideinputs', function(e) {    
          console.log('hideinputs ',e.keyCode)
          if (e.keyCode == 40) {
            var thisparent= $(this).parent().parent();
            $(thisparent).find('.customview').addClass('open');
            $(thisparent).find('.outer_overly').addClass('open');
            $(this).parent().find('input.native-input').addClass('has-focus');
            $(this).parent().find('input.native-input').focus();    
          }
          // if (e.keyCode == 37) {
          //   // $(".move:focus").prev().focus();
          //   $('customview').toggleClass('open');
          //   // $(this).parent().prev().toggleClass('open');
          // }
        });
      }
    }
    ngOnInit() {
    console.log('-->')
    this.items = [];
    for (let i = 0; i < this.preSelected.length; i++) {
      const element = this.preSelected[i];      
      this.items.push(this.store.findKey(this.TreeData, element));
    }
  }
  getLbl(item){
    return item != undefined && item.Region !=undefined?item.Region:''
  }
 
  removeFromSelect(item){
    const output = this.store.findKey(this.usersArrayFiltered, item.ReferenceKey);
    output.checked = false
    this.returnItem(output)
  }

  search(event) {
    if (!this.filterText) {
      this.usersArrayFiltered = this.TreeData;
    } else {
      if (this.filterText.length > 0) {
        this.usersArrayFiltered = this.filter(this.TreeData, ({ Region }) => Region.toLowerCase().includes(this.filterText.toLowerCase()));
        for (let k = 0; k < this.usersArrayFiltered.length; k++) {
          this.usersArrayFiltered[k].visible =true
          for (let l = 0; l < this.usersArrayFiltered[k].Children.length; l++) {
            this.usersArrayFiltered[k].Children[l].visible =true
            if(this.usersArrayFiltered[k].Children[l].Children !=undefined){
              for (let m = 0; m < this.usersArrayFiltered[k].Children[l].Children.length; m++) {
                this.usersArrayFiltered[k].Children[l].Children[m].visible =true                
              }
            }
          }
        }
      } else {
        this.usersArrayFiltered = this.TreeData;
        for (let k = 0; k < this.usersArrayFiltered.length; k++) {
          this.usersArrayFiltered[k].visible =false
          for (let l = 0; l < this.usersArrayFiltered[k].Children.length; l++) {
            this.usersArrayFiltered[k].Children[l].visible =false
            if(this.usersArrayFiltered[k].Children[l].Children !=undefined){
              for (let m = 0; m < this.usersArrayFiltered[k].Children[l].Children.length; m++) {
                this.usersArrayFiltered[k].Children[l].Children[m].visible =false                
              }
            }
          }
        }
      }      
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.filterText =='' || this.filterText == undefined){
      this.usersArrayFiltered = [...this.TreeData];
      if(this.TreeData.length == 0) {
        if(this.preSelected == undefined || this.preSelected.length == 0) {
          this.items = []
        }
      }
      for (let i = 0; i < this.usersArrayFiltered.length; i++) {
        this.usersArrayFiltered[i].checked == this.dfsChecked(this.usersArrayFiltered[i])
      }      
    }
    if(changes.preSelected.currentValue !=undefined){
      this.nCheckData(changes.preSelected.currentValue)
    }
    this.setSelectedCountry()
  }
  nCheckData(mList) {
    for (let k = 0; k < this.TreeData.length; k++) {
      for (let l = 0; l < this.TreeData[k].Children.length; l++) {
        let sk=0
        for (let m = 0; m < this.TreeData[k].Children[l].Children.length; m++) {
          if(this.TreeData[k].Children[l].Children[m].Children !=undefined){
            let ck=0
            for (let n = 0; n < this.TreeData[k].Children[l].Children[m].Children.length; n++) {
                let check =(mList.includes(this.TreeData[k].Children[l].Children[m].Children[n].ReferenceKey.toString()))
                if(check)
                ck = ck+1
                this.TreeData[k].Children[l].Children[m].Children[n].checked = check
            }
            this.TreeData[k].Children[l].Children[m].checked = (ck == this.TreeData[k].Children[l].Children[m].Children.length)
            let check = ck == this.TreeData[k].Children[l].Children[m].Children.length
            this.TreeData[k].Children[l].Children[m].checked = check
            if(check)
            sk = sk+1
          }else{
            let check =(mList.includes(this.TreeData[k].Children[l].Children[m].ReferenceKey.toString()))          
            this.TreeData[k].Children[l].Children[m].checked = check            
            if(check)
            sk = sk+1
          }
        }
        let check2 = (sk ==this.TreeData[k].Children[l].Children.length)
        this.TreeData[k].Children[l].checked = check2        
      }
      let lk=0
        for (let j = 0; j < this.TreeData[k].Children.length; j++) {
          const element = this.TreeData[k].Children[j];
          if(element.checked){
            lk=lk+1;
          }
        }
        let check = (lk ==this.TreeData[k].Children.length)
        this.TreeData[k].checked=check
    }
  }

  filter(array, fn) {
    let list = array.reduce((r, o) => {
      var Children = this.filter(o.Children || [], fn);
      if (fn(o) || Children.length) {
        r.push(Object.assign({}, o, Children.length && {
          Children
        }))
      };
      return r;
    }, []);
    return list;
  }

  dfsChecked(current) {
     let resd = 0;
    let checked = false;
    if(current.Children != undefined && current.Children.length > 0) {
      current.Children?.forEach(element => {
        element.subchk = 0
        if(element.Children !=undefined && element.Children.length>0){
          element.Children?.forEach(s3 => {
            if(s3.checked){
              element.subchk =  element.subchk+1
            }
          });
          if(element.subchk == element.Children.length) {
            element.checked = true
            resd = resd + 1;
          }
          this.dfsChecked(element);
        }else{
          if(element.checked) {
              resd = resd + 1;
          }
          this.dfsChecked(element);
        }
      });      
      if(resd == current.Children.length) {
        current.checked = true
      }
    }
    return checked
  }

  dfs(current, result) {
    if(current.Children != undefined && current.Children.length > 0) {
      current.Children.forEach(element => {
        result =  this.dfs(element, result);
      }); 
    } else {
      result = result + 1;
    }
    return result;
  }
  onChangeCheck(item) {
    this.returnItem(item)
  }
  returnItem(item: any) {
    let total = 0;
    if(this.ComponentKey == 'CountriesOfDomicileNationality' && item.checked) {
      var result = this.dfs(item,0);
      total = ((this.preSelected != undefined)?this.preSelected.length:0)+result;
      if(total > 3) {
        item.checked = false;
      }
    }
   
    if(total <= 3) {
      if (item.Children != undefined) {
        for (let k = 0; k < item.Children.length; k++) {
          item.Children[k].checked = item.checked;
          if (item.Children[k].Children != undefined) {
            for (let l = 0; l < item.Children[k].Children.length; l++) {
              item.Children[k].Children[l].checked = item.checked;
              if(item.Children[k].Children[l].Children !=undefined){
                for (let m = 0; m < item.Children[k].Children[l].Children.length; m++) {
                  item.Children[k].Children[l].Children[m].checked = item.checked;
                } 
              }
            }
          } else {
            for (let k = 0; k < this.TreeData.length; k++) {
              for (let l = 0; l < this.TreeData[k].Children.length; l++) {
                if(this.TreeData[k].Children[l].Children != undefined){
                  for (let m = 0; m < this.TreeData[k].Children[l].Children.length; m++) {
                    if (item.ReferenceKey.toString() == this.TreeData[k].Children[l].Children[m].ReferenceKey.toString()) {
                      if(this.TreeData[k].Children[l].Children[m].Children !=undefined){
                        for (let n = 0; n < this.TreeData[k].Children[l].Children[m].Children.length; n++) {
                          if (this.preSelected.includes(this.TreeData[k].Children[l].Children[m].Children[n].ReferenceKey))
                          this.TreeData[k].Children[l].Children[m].Children[n].checked = item.checked
                        }
                      }
                      this.TreeData[k].Children[l].Children[m].checked = item.checked
                    }
                  }
                }else{
                  if (item.ReferenceKey.toString() == this.TreeData[k].Children[l].ReferenceKey.toString()) {
                    for (let m = 0; m < this.TreeData[k].Children[l].Children.length; m++) {
                      if(this.TreeData[k].Children[l].Children[m].Children !=undefined){
                        for (let n = 0; n < this.TreeData[k].Children[l].Children[m].Children.length; n++) {
                          if (this.preSelected.includes(this.TreeData[k].Children[l].Children[m].Children[n].ReferenceKey.toString()))
                          this.TreeData[k].Children[l].Children[m].Children[n].checked = item.checked                          
                        }
                      }else{
                        
                        if (this.preSelected.includes(this.TreeData[k].Children[l].Children[m].ReferenceKey.toString()))
                        this.TreeData[k].Children[l].Children[m].checked = item.checked
                      }
                    }
                    this.TreeData[k].Children[l].checked = item.checked
                  }
                }
              }
            }
          }
        }
      } else {
        for (let k = 0; k < this.TreeData.length; k++) {
          for (let l = 0; l < this.TreeData[k].Children.length; l++) {
            for (let m = 0; m < this.TreeData[k].Children[l].Children.length; m++) {
              if(this.TreeData[k].Children[l].Children[m].Children !=undefined){
                for (let n = 0; n < this.TreeData[k].Children[l].Children[m].Children.length; n++) {
                  if (item.ReferenceKey.toString() == this.TreeData[k].Children[l].Children[m].Children[n].ReferenceKey.toString())
                    this.TreeData[k].Children[l].Children[m].Children[n].checked = item.checked
                }
              }else{
                if (item.ReferenceKey.toString() == this.TreeData[k].Children[l].Children[m].ReferenceKey.toString())
                  this.TreeData[k].Children[l].Children[m].checked = item.checked
              }
            }
          }
        }
      }
      this.setSelectedCountry()      
    }
    this.change.emit({ clear: false,item:item })
  }
  setSelectedCountry() {
    this.items = [];
    for (let i = 0; i < this.preSelected.length; i++) {
      const element = this.preSelected[i];      
      this.items.push(this.store.findKey(this.TreeData, element));
    }
  }


  clear() {
    for (let i = 0; i < this.TreeData.length; i++) {
      this.TreeData[i].checked = false;
      this.TreeData[i].visible =false
      for (let j = 0; j < this.TreeData[i].Children.length; j++) {
        this.TreeData[i].Children[j].checked = false;
        this.TreeData[i].Children[j].visible =false
        if (this.TreeData[i].Children[j].Children != undefined) {
          for (let k = 0; k < this.TreeData[i].Children[j].Children.length; k++) {
            this.TreeData[i].Children[j].Children[k].checked = false;
            this.TreeData[i].Children[j].Children[k].visible = false;
            if (this.TreeData[i].Children[j].Children[k].Children != undefined) {
              for (let l = 0; l < this.TreeData[i].Children[j].Children[k].Children.length; l++) {
                this.TreeData[i].Children[j].Children[k].Children[l].checked = false;
                this.TreeData[i].Children[j].Children[k].Children[l].visible = false;
              }
            }
          }
        }
      }
    }
    this.items = []
    this.change.emit({ clear: true })    
  }
}
