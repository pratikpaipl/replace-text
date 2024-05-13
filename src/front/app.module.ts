import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
// Datepicker module
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventService } from 'src/shared/EventService';
import { SharedModule } from 'src/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiService } from 'src/services/api.service';

// Sentry.init({
//   // dsn: "https://3e9fc692f9f811edbdf6966268fae51f@sentry.io/pifunder"
//   dsn: "https://5854b4bdc0ba4b47bd5a359ad2042360@o4505237439840256.ingest.sentry.io/4505237444034560"
// });

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor(public apiService:ApiService) {}
  handleError(error) {
    console.error(error);
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailedMessage.test(error.message)) {
      window.location.reload();
    }else{
      this.apiService.catchError(error);
    }
  }
}
@NgModule({
  entryComponents: [],
  imports: [ BrowserModule.withServerTransition({ appId: 'serverApp' }), FormsModule,CommonModule,ReactiveFormsModule,HttpClientModule, HttpClientModule, BsDatepickerModule.forRoot(),  IonicModule.forRoot({ mode: 'md', scrollAssist: false, rippleEffect: false, animated: false }), AppRoutingModule, BrowserAnimationsModule,SharedModule],
  providers: [ Network, EventService, Title,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: ErrorHandler, useClass: SentryErrorHandler }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}