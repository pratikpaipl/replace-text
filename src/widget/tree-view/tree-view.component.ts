import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StorageService } from 'src/shared/StorageService';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class ResourceTreeView implements OnInit {

  allchecked=false;
  @Input() TreeDataOrg: any[];
  @Input() TreeData: any[];
  @Input() preSelected: any[];
  @Input() from: any;
  @Input() hasCheckbox: boolean = true;
  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(public store:StorageService) { }

  toggleChildren(node: any) {
    node.visible = !node.visible;
  }
  ngOnInit() {

    if(this.TreeData != undefined){
      for (let i = 0; i < this.TreeData.length; i++) {
        if(this.TreeData[i].Children != undefined){
          for (let j = 0; j < this.TreeData[i].Children.length; j++) {
            if(this.TreeData[i].Children[j].Children != undefined){
              let mcnt=0;
              for (let k = 0; k < this.TreeData[i].Children[j].Children.length; k++) {             
                if(this.TreeData[i].Children[j].Children[k].Children != undefined){
                  let cnt=0;
                  for (let l = 0; l < this.TreeData[i].Children[j].Children[k].Children.length; l++) {
                    const element = this.TreeData[i].Children[j].Children[k].Children[l];
                    cnt = cnt+1
                    if(element.checked){
                      this.TreeData[i].Children[j].Children[k].Children[l].subchk=1
                    }else{
                      this.TreeData[i].Children[j].Children[k].Children[l].subchk=0
                    }
                  }
                  this.TreeData[i].Children[j].Children[k].cnt = cnt
                  this.TreeData[i].Children[j].Children[k].subchk = this.TreeData[i].Children[j].Children[k].Children.reduce((count, current) => count + current.subchk, 0);
                  this.TreeData[i].Children[j].Children[k].checked = (this.TreeData[i].Children[j].Children[k].subchk  == this.TreeData[i].Children[j].Children[k].cnt)
                }else{
                  mcnt= mcnt+1
                  if(this.TreeData[i].Children[j].Children[k].checked){
                    this.TreeData[i].Children[j].Children[k].subchk=1
                  }else{
                    this.TreeData[i].Children[j].Children[k].subchk=0
                  }
                  this.TreeData[i].Children[j].cnt = mcnt
                }
              }
              this.TreeData[i].Children[j].subchk=this.TreeData[i].Children[j].Children.reduce((count, current) => count + current.subchk, 0);
              if(this.TreeData[i].Children[j].cnt !=undefined)
              this.TreeData[i].Children[j].checked = (this.TreeData[i].Children[j].subchk  == this.TreeData[i].Children[j].cnt)
            }else{
              if(this.TreeData[i].Children[j].checked){
                this.TreeData[i].Children[j].subchk=1
              }else{
                this.TreeData[i].Children[j].subchk=0
              }
            }
          }
          this.TreeData[i].subchk =  this.TreeData[i].Children.reduce((count, current) => count + current.subchk, 0);
          this.TreeData[i].checked = (this.TreeData[i].subchk  == this.TreeData[i].cnt)
        }
      }
    }

    // if (this.TreeData) {
    //   this.TreeData.forEach(node => {
    //     if (node.Children) {
    //       node.Children.forEach(child => {
    //         if (child.Children) {
    //           let childCount = 0;
    //           child.Children.forEach(grandchild => {
    //             if (grandchild.Children) {
    //               grandchild.subchk = grandchild.Children.reduce((count, current) => count + (current.checked ? 1 : 0), 0);
    //               grandchild.checked = grandchild.subchk === grandchild.Children.length;
    //             } else {
    //               grandchild.subchk = grandchild.checked ? 1 : 0;
    //             }
    //             childCount += grandchild.subchk;
    //           });
    //           child.subchk = childCount;
    //           child.checked = child.subchk === child.Children.length;
    //         } else {
    //           child.subchk = child.checked ? 1 : 0;
    //         }
    //       });
    //       node.subchk = node.Children.reduce((count, current) => count + current.subchk, 0);
    //       node.checked = node.subchk === node.Children.length;
    //     }
    //   });
    // }
  }

  isCheck(item,event){
  }
  getCnt(items, isParent) {
    var cnt = 0
    if (isParent == undefined){
      for (let i = 0; i < items.length; i++) {
        if(items[i].Children !=undefined){
          for (let j = 0; j < items[i].Children.length; j++) {
            if(items[i].Children[j].Children !=undefined){
              for (let k = 0; k < items[i].Children[j].Children.length; k++) {
                if(items[i].Children[j].Children[k].Children !=undefined){
                  for (let l = 0; k < items[i].Children[j].Children[k].Children.length; l++) {
                    if(items[i].Children[j].Children[k].Children[l].checked)
                    cnt = cnt+1         
                  }
                }else{
                  if(items[i].Children[j].Children[k].checked)
                  cnt = cnt+1         
                }
              }
            }else{
              if(items[i].Children[j].checked)
              cnt = cnt+1    
            }
          }
        }else{
          if(items[i].checked)
          cnt = cnt+1
        }
      }

      return cnt //items.filter((item) => item.checked).length;
    }
    else {
      for (let k = 0; k < items.length; k++) {
        if (items[k].Children != undefined) {
          for (let l = 0; l < items[k].Children.length; l++) {
            if (items[k].Children[l].Children != undefined) {
              for (let m = 0; m < items[k].Children[l].Children.length; m++) {
                if (items[k].Children[l].Children[m].checked) {
                  cnt = cnt + 1
                }
              }
            }else{
              if (items[k].Children[l].checked) {
                cnt = cnt + 1
              }
            }
          }
        }
      }
      return cnt;
    }
  }
  
  getAllCnt(items, isParent) {
    var cnt = 0
    if (isParent == undefined){
      return items.filter((item) => item.checked).length;
    }
    else {
      for (let k = 0; k < items.length; k++) {
        if (items[k].Children != undefined) {
          for (let l = 0; l < items[k].Children.length; l++) {
            if (items[k].Children[l].Children != undefined) {
              for (let m = 0; m < items[k].Children[l].Children.length; m++) {
                if (items[k].Children[l].Children[m].Children != undefined) {
                  for (let n = 0;n < items[k].Children[l].Children[m].Children.length; n++) {
                    cnt = cnt + 1
                  }
                }else{
                  cnt = cnt + 1
                }
              }
            }else{
              cnt = cnt + 1
            }
          }
        }else{
          cnt = cnt + 1
        }
      }
      return cnt;
    }
  }

  checkboxClick(item) {
    this.change.emit(item);
  }
  onChangeCheck(event) {
    this.change.emit(event)
  }
}
