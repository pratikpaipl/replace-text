import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { EventService } from '../shared/EventService';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
// Datepicker module
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/services/api.service';


@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor(public apiService:ApiService) {}
  handleError(error) {
    //  const captureErr = Sentry.captureException(error)
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    console.error(error);
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }else{
      this.apiService.catchError(error);
    }
  }
}

@NgModule({

  entryComponents: [],
  imports: [SharedModule,  BrowserModule.withServerTransition({ appId: 'serverApp' }), FormsModule, ReactiveFormsModule, HttpClientModule, BsDatepickerModule.forRoot(), IonicModule.forRoot({ mode: 'md', scrollAssist: false, rippleEffect: false, animated: false }), AppRoutingModule,BrowserAnimationsModule],
  providers: [Network, EventService, Title, Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ], declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
 }
