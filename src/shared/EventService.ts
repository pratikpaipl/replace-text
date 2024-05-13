import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {

  public updateContactUs = new Subject();
  updateContactUs$ = this.updateContactUs.asObservable();
  publishUpdateContactUs(data) {
    this.updateContactUs.next(data);
  }
  
  public changeSegment = new Subject();
  changeSegment$ = this.changeSegment.asObservable();
  publishChangeSegment(item) {
    this.changeSegment.next(item);
  }

  public applyFilter = new Subject();
  applyFilter$ = this.applyFilter.asObservable();
  publishApplyFilter(event) {
    this.applyFilter.next(event);
  }


  public applyTabReload = new Subject();
  applyTabReload$ = this.applyTabReload.asObservable();
  publishApplyTabReload(event) {
    this.applyTabReload.next(event);
  }

  public applyRefreshData = new Subject();
  applyRefreshData$ = this.applyRefreshData.asObservable();
  publishRefreshData(event) {
    this.applyRefreshData.next(event);
  }

  public updateLabel = new Subject();
  updateLabel$ = this.updateLabel.asObservable();
  publishUpdateLabel(item) {
    this.updateLabel.next(item);
  }

  public formRefresh = new Subject();
  formRefresh$ = this.formRefresh.asObservable();
  publishFormRefresh(isSet) {
    this.formRefresh.next(isSet);
  }
  public removeData = new Subject();
  removeData$ = this.removeData.asObservable();
  publishRemoveData(item) {
    this.removeData.next(item);
  }

  public updateLng = new Subject();
  updateLng$ = this.updateLng.asObservable();
  publishUpdateLng(selLng) {
    this.updateLng.next(selLng);
  }
  public updateData = new Subject();
  updateData$ = this.updateData.asObservable();
  publishUpdateData(isSet) {
    this.updateData.next(isSet);
  }

  public updateContentText = new Subject();
  updateContentText$ = this.updateContentText.asObservable();
  publishUpdateContentText(data) {
    this.updateContentText.next(data);
  }
  public enablerUpdate = new Subject();
  enablerUpdate$ = this.enablerUpdate.asObservable();
  publishEnablerUpdate(isSet) {
    this.enablerUpdate.next(isSet);
  }
  public deleteData = new Subject();
  deleteData$ = this.deleteData.asObservable();
  publishDeleteData(item) {
    this.deleteData.next(item);
  }
  public enablerRel = new Subject();
  enablerRel$ = this.enablerRel.asObservable();
  publishEnablerRel(item) {
    this.enablerRel.next(item);
  }

  public fundingProfileRel = new Subject();
  fundingProfileRel$ = this.fundingProfileRel.asObservable();
  publishFundingProfileRel(item) {
    this.fundingProfileRel.next(item);
  }
}