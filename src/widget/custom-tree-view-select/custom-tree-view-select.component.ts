import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'custom-tree-view-select',
  templateUrl: './custom-tree-view-select.component.html',
  styleUrls: ['./custom-tree-view-select.component.scss'],
})
export class CustomTreeViewSelectComponent implements OnInit,OnChanges {

  @Input()
  icon: any;
  @Input()
  respObj: any;
  @Input()
  disabled: any=false;
  @Input()
  isCountry: any=false;
  @Input()
  isTreePrepare: any=false;
  @Input()
  showTitle: any=true;
  @Input()
  selectTitle: string;
  @Input()
  type: string;
  @Input()
  from: string;
  @Input()
  firstKey: string;
  @Input()
  secondKey: string;
  @Input()
  thirdKey: string;
  @Input()
  firstLabel: string;
  @Input()
  secondLabel: string;
  @Input()
  thirdLabel: string;

  @Input()
  ComponentKey: string;
  @Input()
  ChildList: string;
  @Input()
  SubChildList: string;
  @Input()
  preSelected: any;
  @Input()
  total: any=0;
  @Input()
  list: any;
  @Input()
  isValidate: any=true;
  @Input()
  isError: any;
  @Input()
  isLimit: any;
  @Input()
  filterText: any;

  nList:any=[]
  selectedImpactTheme: any = []
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();


  constructor(public store:StorageService) {
  }

  ngOnInit() {
    this.selectedImpactTheme = this.preSelected !=undefined?this.preSelected:[];       
    this.setListData()
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes.preSelected !=undefined && changes.preSelected.currentValue !=undefined){
      this.selectedImpactTheme = changes.preSelected.currentValue;
    }else{
      this.selectedImpactTheme = this.store.getTreeList(this.nList,this.respObj[this.ComponentKey]);
    }    
  }

  setListData() {
    this.makeList(false)
    if(this.respObj !=undefined){
      this.selectedImpactTheme= this.store.getTreeList(this.nList,this.respObj[this.ComponentKey]);
      this.change.emit({modalName:this.ComponentKey,modal:this.selectedImpactTheme})
    }
  }
  makeList(isChage) {
    if (this.list != undefined && this.list.length > 0) {
      let mList = [];
      this.total=0
      mList.push({ [this.firstKey]: "select_all", [this.firstLabel]: this.store.getVal("select_all"), isParent: true, [this.ChildList]: this.list })
      let ImpactThemesAreasList = [];
       if(!this.isCountry){
        for (let k = 0; k < mList.length; k++) {
        const element = mList[k];
        let child = element[this.ChildList] != undefined ? element[this.ChildList] : []
        let ChildrenList = []
        for (let l = 0; l < child.length; l++) {
          const chil = child[l];
          let county = chil[this.ChildList] != undefined ? chil[this.ChildList] : []
          let countryList = []
          for (let j = 0; j < county.length; j++) {
            const cntry = county[j];
            countryList.push({
              ReferenceKey: cntry[this.secondKey].toString(),
              Region: cntry[this.secondLabel],
              showFirst: false,
              visible: isChage?cntry.visible:true,
              checked: false
            })
          }
          ChildrenList.push({
            ReferenceKey: chil[this.firstKey].toString(),
            Region: chil[this.firstLabel],
            Children: countryList,
            visible: false,
            showFirst: isChage?chil.visible:true,
            checked: false
          })

        }
        let cnt = ChildrenList.reduce((count, current) => count + current.Children.length, 0)

        ImpactThemesAreasList.push({
          ReferenceKey: element[this.firstKey].toString(),
          Region: element[this.firstLabel],
          Children: ChildrenList,
          isParent: true,
          showFirst: true,
          visible: true,
          cnt: cnt,
          checked: false
        })

        this.nList = ImpactThemesAreasList;
        this.total = this.total + cnt
        }
      }else{
        for (let l1 = 0; l1 < mList.length; l1++) {
          let main = mList[l1][this.ChildList] != undefined ? mList[l1][this.ChildList] : []
          let mainList=[]
          for (let l2 = 0; l2 < main.length; l2++) {
            let child = main[l2][this.ChildList] != undefined ? main[l2][this.ChildList] : []
            let ChildrenList = []
            for (let l3 = 0; l3 < child.length; l3++) {
              let subchild = child[l3][this.SubChildList] != undefined ? child[l3][this.SubChildList] : []
              let countryList = []              
              for (let l4 = 0; l4 < subchild.length; l4++) {
                const cntry = subchild[l4];
                countryList.push({ ReferenceKey: cntry[this.thirdKey].toString(), Region: cntry[this.thirdLabel],checked: false})
              }
              ChildrenList.push({ ReferenceKey: child[l3][this.secondKey].toString(), Region: child[l3][this.secondLabel], Children: countryList, checked: false })
            }
            let mcnt = ChildrenList.reduce((count, current) => count + current.Children.length, 0)
            mainList.push({ ReferenceKey: main[l2][this.firstKey].toString(), Region: main[l2][this.firstLabel], Children: ChildrenList,cnt:mcnt, checked: false })
          }
          let cnt = mainList.reduce((count, current) => count + current.cnt, 0)
          this.nList.push({ ReferenceKey:  mList[l1][this.firstKey].toString(), Region:  mList[l1][this.firstLabel], Children: mainList, isParent: true, showFirst: true, cnt: cnt, checked: false })
          this.total = this.total + cnt
        }
      }      
    }
    this.isTreePrepare=true
  }
  changeData(event) {   
    if(!this.isCountry){
      if (event.item != undefined && !event.clear) {
        if (event.item.Children != undefined) {
          for (let g = 0; g < event.item.Children.length; g++) {
            const element = event.item.Children[g];
            if (element.Children != undefined) {
              for (let k = 0; k < element.Children.length; k++) {
                const conty = element.Children[k];
                if (conty.checked) {
                  this.selectedImpactTheme.push(conty.ReferenceKey.toString())
                } else {
                  var index = this.selectedImpactTheme.indexOf(conty.ReferenceKey.toString());
                  if (index > -1) {
                    this.selectedImpactTheme.splice(index, 1);
                  }
                }
              }
            } else {
              if (element.checked) {
                this.selectedImpactTheme.push(element.ReferenceKey.toString())
              } else {
                var index = this.selectedImpactTheme.indexOf(element.ReferenceKey.toString());
                if (index > -1) {
                  this.selectedImpactTheme.splice(index, 1);
                }
              }
            }
          }
        } else {
          if (event.item.checked) {
            this.selectedImpactTheme.push(event.item.ReferenceKey.toString())
          } else {
            var index = this.selectedImpactTheme.indexOf(event.item.ReferenceKey.toString());
            if (index > -1) {
              this.selectedImpactTheme.splice(index, 1);
            }
          }
        }
        this.selectedImpactTheme = [...new Set(this.selectedImpactTheme)]
      } else {
        if (event.clear != undefined && event.clear) {
          this.selectedImpactTheme = []
        }
      }
      for (let k = 0; k < this.nList.length; k++) {
        let clickF = 0
        if (this.selectedImpactTheme.includes(this.nList[k].ReferenceKey.toString())) {
          this.nList[k].checked = true
        }
        let clickS = 0
        for (let l = 0; l < this.nList[k].Children.length; l++) {
          if (this.selectedImpactTheme.includes(this.nList[k].Children[l].ReferenceKey.toString())) {
            this.nList[k].Children[l].checked = true
            clickS = clickS + 1
          }
          let clickT = 0
          for (let m = 0; m < this.nList[k].Children[l].Children.length; m++) {
            if (this.selectedImpactTheme.includes(this.nList[k].Children[l].Children[m].ReferenceKey.toString())) {
              this.nList[k].Children[l].Children[m].checked = true
              clickT = clickT + 1;
              clickF = clickF + 1
            }
          }
          if (this.nList[k].Children[l].Children.length == clickT) {
            this.nList[k].Children[l].checked = true
          } else {
            this.nList[k].Children[l].checked = false
          }
        }
        
        if (this.nList[k].Children.length == clickS) {
          this.nList[k].Children.checked = true
        } else {
          this.nList[k].Children.checked = false
        }
        if (this.nList[k].cnt == clickF) {
          this.nList[k].checked = true
        } else {
          this.nList[k].checked = false
        }
      }
    }else{
      if (event.item != undefined && !event.clear) {
        if (event.item.Children != undefined) {
          for (let g = 0; g < event.item.Children.length; g++) {
            const element = event.item.Children[g];
            if (element.Children != undefined) {
              for (let k = 0; k < element.Children.length; k++) {
                const conty = element.Children[k];

                if (conty.Children != undefined) {
                  for (let l = 0; l < conty.Children.length; l++) {
                    const levelSub = conty.Children[l];
                    if (levelSub.checked) {
                      this.selectedImpactTheme.push(levelSub.ReferenceKey.toString())
                    } else {
                      var index = this.selectedImpactTheme.indexOf(levelSub.ReferenceKey.toString());
                      if (index > -1) {
                        this.selectedImpactTheme.splice(index, 1);
                      }
                    }
                  }
                }else{
                  if (conty.checked) {
                    this.selectedImpactTheme.push(conty.ReferenceKey.toString())
                  } else {
                    var index = this.selectedImpactTheme.indexOf(conty.ReferenceKey.toString());
                    if (index > -1) {
                      this.selectedImpactTheme.splice(index, 1);
                    }
                  }
                }

              }
            } else {
              if (element.checked) {
                this.selectedImpactTheme.push(element.ReferenceKey.toString())
              } else {
                var index = this.selectedImpactTheme.indexOf(element.ReferenceKey.toString());
                if (index > -1) {
                  this.selectedImpactTheme.splice(index, 1);
                }
              }
            }
          }
        } else {
          if (event.item.checked) {
            this.selectedImpactTheme.push(event.item.ReferenceKey.toString())
          } else {
            var index = this.selectedImpactTheme.indexOf(event.item.ReferenceKey.toString());
            if (index > -1) {
              this.selectedImpactTheme.splice(index, 1);
            }
          }
        }
        this.selectedImpactTheme = [...new Set(this.selectedImpactTheme)]
      } else {
        if (event.clear != undefined && event.clear) {
          this.selectedImpactTheme = []
        }
      }
      for (let k = 0; k < this.nList.length; k++) {
        let clickF = 0
        if (this.selectedImpactTheme.includes(this.nList[k].ReferenceKey.toString())) {
          this.nList[k].checked = true
        }
        let clickS = 0
        for (let l = 0; l < this.nList[k].Children.length; l++) {
          if (this.selectedImpactTheme.includes(this.nList[k].Children[l].ReferenceKey.toString())) {
            this.nList[k].Children[l].checked = true
            clickS = clickS + 1
          }
          let clickT = 0
          for (let m = 0; m < this.nList[k].Children[l].Children.length; m++) {
            if (this.selectedImpactTheme.includes(this.nList[k].Children[l].Children[m].ReferenceKey.toString())) {
              this.nList[k].Children[l].Children[m].checked = true
              clickT = clickT + 1;
            }
            let clickFo = 0
            for (let n = 0; n < this.nList[k].Children[l].Children[m].Children.length; n++) {
              if (this.selectedImpactTheme.includes(this.nList[k].Children[l].Children[m].Children[n].ReferenceKey.toString())) {
                this.nList[k].Children[l].Children[m].Children[n].checked = true
                clickFo = clickFo + 1;
                clickF = clickF + 1                
              }
            }
            if (this.nList[k].Children[l].Children[m].Children.length == clickFo) {
              this.nList[k].Children[l].Children[m].checked = true
            } else {
              this.nList[k].Children[l].Children[m].checked = false
            }
          }
          if (this.nList[k].Children[l].Children.length == clickT) {
            this.nList[k].Children[l].checked = true
          } else {
            this.nList[k].Children[l].checked = false
          }
        }
        if (this.nList[k].Children.length == clickS) {
          this.nList[k].Children.checked = true
        } else {
          this.nList[k].Children.checked = false
        }
        if (this.nList[k].cnt == clickF) {
          this.nList[k].checked = true
        } else {
          this.nList[k].checked = false
        }
       
      }
    }
    this.change.emit({modalName:this.ComponentKey,modal:this.selectedImpactTheme})
  }
}
