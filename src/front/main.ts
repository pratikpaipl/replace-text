import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'src/environments/environment';
import { AppModule } from './app.module';

if (environment.production) {
  enableProdMode();
}

// if(!environment.production){
//   platformBrowserDynamic().bootstrapModule(AppExUserModule)
//     .catch(err => console.log(err));
// } 
// else{
//   platformBrowserDynamic().bootstrapModule(AppModule)
//     .catch(err => console.log(err));
// } 
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));