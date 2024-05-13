import { ActionSheetController, Platform } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { StorageService } from 'src/shared/StorageService';
import { EventService } from 'src/shared/EventService';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {

  @Input()
  pageFrom: string;
  @Input()
  fromType: string = '';
  @Input()
  address: any;
  @Input()
  displayAddress: any;
  @Input()
  showCurrent: any;
  @Input()
  placeholder: any;
  @Input()
  isClear: any = false;
  @Input()
  region: any = false;
  // @Input()
  // latitude: any;
  // @Input()
  // longitude: any;


  
  accuracy: number;
  options = {
    timeout: 30000,
    enableHighAccuracy: false,
    maximumAge: 0
  };
  
  isCurrent = false;
  isFocus = false;
  isShowLocal = true;
  isSearch = false;
  searchAddress: any = '';
  crAddress: any = '';
  suggestionList = [];
  lastSaved: any = -1;
  savedFilter: any = [];
  DisplayName = ''
  FormattedAddress = ''
  AddressComponents:any = []
  ErrorMsg = '';

  // name = '';
  // PlaceID = '';
  // PlaceName = ''
  // Website = '';
  // crLatitude: number;
  // crLongitude: number;

  // Types = ''
  // BusinessStatus = ''
  // Rating = ''
  // OpeningHours = ''
  // Url = ''
  // CountryCode = ''
  // Lat = ''
  // Long = ''
  // InternationalPhoneNumber = ''
  // photoUrl = ''


  // isOnline = false
  // isPhysical = false;
  // PlaceGroup = [];



  @Output()
  change: EventEmitter<Object> = new EventEmitter<Object>();
  selectedNameAddress: any;
  subscription: any;
  subscriptionPlace: any;
  searchPlaceAddress: any;
  isFocusPlaceAddress: boolean;
  constructor(public platform: Platform, public store: StorageService, public eventService: EventService, public actionSheetController: ActionSheetController, private geolocation: Geolocation, public apiService: ApiService) {

  }
  ngOnInit() {
    
  }
  ngOnChanges() {
    if (this.isClear) {
      this.address = ''
      this.AddressComponents = []
    }
  }

  currentLoc() {
    this.searchPlaceAddress = '';
    this.searchAddress = '';
    this.address = '';
    this.AddressComponents = []
    this.selectedNameAddress = '';
    this.DisplayName = '';
    
    this.FormattedAddress = '';
    
    if (this.crAddress == '') {
      // this.store.getFromIP();
    } else {
      this.isShowLocal = true;
      this.isFocus = false;
      this.searchAddress = this.crAddress
      this.address = this.crAddress
      
      this.isCurrent = true;
      if (this.pageFrom == 'home') {        
        this.store.saveData('crAddress', this.crAddress);
        this.store.saveData('dAddress', this.crAddress);
      }
      this.callAction('api')
    }
  }
  generateAddress(addressObj) {
    return addressObj.subLocality + ' ' + addressObj.subAdministrativeArea + ' ' + addressObj.postalCode + ' ' + addressObj.locality + ',' + addressObj.countryCode + '';
  }
  ionFocus(event) {
    let params = event.target.value;
    this.isFocus = true;
    var data = { isChangeEvent: true, regAddress: params, ErrorMsg: params == '' ? undefined : this.ErrorMsg }
    if (this.ErrorMsg != undefined && this.ErrorMsg)
      this.change.emit(data)
  }

  unCheckFocus(event) {
    let params = event.target.value;
    var data = { isChangeEvent: true, regAddress: params, ErrorMsg: params == '' ? undefined : this.ErrorMsg }
    if (this.ErrorMsg != undefined && this.ErrorMsg)
      this.change.emit(data)
  }

  addressChange(event) {
    // let params = event.target.value;
    this.searchAddress = "";
    this.suggestionList = [];
    this.isShowLocal = true;
    this.isSearch = false;

    var data = { isChangeEvent: false, address: '', selectedNameAddress: '', BusinessStatus: '', FormattedAddress: '', PlaceName: '', DisplayName: '', PlaceID: '', Types: '', Url: '', Rating: '', OpeningHours: '', InternationalPhoneNumber: '', latitude: '', longitude: '', Lat: '', Long: '', CountryCode: '', Website: '', photoUrl: '', PlaceGroup: '', AddressComponents: JSON.stringify(this.AddressComponents) }
    // name: this.name, 
    this.change.emit(data)
  }
  firstInput(event, isSkip?) {
    let params = event.target.value;
    this.isShowLocal = true;
    this.isSearch = true;
    if (params == '') {
      this.suggestionList = [];
      this.isSearch = false;
    }
    if (params != '') {
      if (this.subscription != undefined) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.apiService.suggestions(params, this.region, isSkip).subscribe(response => {
        let res: any = response;
        if (res.success) {
          this.isSearch = false;
          this.suggestionList = res.data.predictions;
          if (this.suggestionList.length > 0) {
            this.isShowLocal = true;
          } else {
            this.isShowLocal = false;
          }
          if (params == '') {
            this.suggestionList = [];
            this.isShowLocal = true;
            this.isSearch = false;
          }
        }
      });
      this.ErrorMsg = undefined
      var data = { isChangeEvent: true, regAddress: params, ErrorMsg: this.ErrorMsg }
      this.change.emit(data)
    } else {
      this.suggestionList = [];
    }

  }

  hideSearch() {

  }
  suggestionClick(item) {
    this.isFocusPlaceAddress = false
    this.isCurrent = false;
    this.selectedNameAddress = '';
    this.DisplayName = '';
    // this.PlaceID = '';
    this.FormattedAddress = '';
    this.AddressComponents = [];
    // this.Website = '';
    // this.Types = '';
    // this.Url = '';
    // this.Rating = '';
    // this.OpeningHours = '';
    // this.InternationalPhoneNumber = '';
    // this.photoUrl = '';
    // this.PlaceGroup = [];
    if (this.subscriptionPlace != undefined) {
      this.subscriptionPlace.unsubscribe();
    }

    this.subscriptionPlace = this.apiService.placeDetails(item.place_id).subscribe(response => {
        let res: any = response;
        if (res.success) {
          var resultData = res.data.result;
          if (resultData != undefined) {
            this.searchAddress = item.description;
            this.address = item.description;
            let latitude = resultData.geometry.location.lat;
            let longitude = resultData.geometry.location.lng;
            let CountryCode = resultData.country_code != undefined ? resultData.country_code : '';
            let name = resultData.name;
            this.selectedNameAddress = resultData.formatted_address;
            this.displayAddress = resultData.formatted_address;
            this.FormattedAddress = resultData.formatted_address
            this.DisplayName = resultData.name
            let res_data = {
              address_components:resultData.address_components,
              url:resultData.url
            }
            this.AddressComponents = (res_data != undefined)?res_data:[]
            if (latitude != undefined && latitude != '' && longitude != undefined && longitude != '' && CountryCode != undefined && CountryCode != '' && item.description != undefined && item.description != '') {
            } else {
              this.suggestionList = [];
              this.isShowLocal = true;
              this.isFocus = false;
            }
            var data = { isChangeEvent: false, address: this.address, name: name, displayAddress:this.displayAddress, selectedNameAddress: this.selectedNameAddress, BusinessStatus: '', FormattedAddress: this.FormattedAddress, PlaceName: name, DisplayName: this.DisplayName, PlaceID: '', Types: '', Url: '', Rating: '', OpeningHours: '', InternationalPhoneNumber: '', latitude: '', longitude: '', CountryCode: '', Lat: '', Long: '', photoUrl: '', regAddress: item.description, Website: '', AddressComponents : JSON.stringify(this.AddressComponents) }

            if (this.selectedNameAddress != '') {
              this.isFocus = false
              this.change.emit(data)
            }
          }
        }
      });
    

  }

  callAction(action: string) {
    // name: this.name, BusinessStatus: this.BusinessStatus, PlaceName: this.PlaceName, PlaceID: this.PlaceID, Types: this.Types, Url: this.Url, Rating: this.Rating, OpeningHours: this.OpeningHours, InternationalPhoneNumber: this.InternationalPhoneNumber, latitude: this.latitude, longitude: this.longitude, CountryCode: this.CountryCode, Lat: this.Lat, Long: this.Long, Website: this.Website, photoUrl: this.photoUrl, PlaceGroup: this.PlaceGroup
    var data = { isChangeEvent: false, address: this.address, name: '',displayAddress:this.displayAddress, selectedNameAddress: this.selectedNameAddress, BusinessStatus: '', FormattedAddress: this.FormattedAddress, PlaceName: '', DisplayName: this.DisplayName, PlaceID: '', Types: '', Url: '', Rating: '', OpeningHours: '', InternationalPhoneNumber: '', latitude: '', longitude: '', CountryCode: '', Lat: '', Long: '', Website: '', photoUrl: '', PlaceGroup: '', AddressComponents : JSON.stringify(this.AddressComponents) }
    if (this.address != '') {
      this.isFocus = false
      this.change.emit(data)
    }
  }
}