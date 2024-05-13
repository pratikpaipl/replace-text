import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, CanLoad, Router, UrlTree } from '@angular/router';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/services/authentication.service';
import { StorageService } from './StorageService';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
// declare const callSetIcon;
@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  PLATFORMID:any=false
  constructor( @Inject(PLATFORM_ID) platformId: any,public authenticationService: AuthenticationService,public cookieService: CookieService, private router: Router,public route:ActivatedRoute, public store: StorageService) {
    this.PLATFORMID = isPlatformBrowser(platformId)
  }
  canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
   return true;
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loggedIn()) {
      let redirectPage=undefined
      this.route.queryParams.subscribe(async params => {
        if (this.router.getCurrentNavigation().extras.state) {
          if (this.router.getCurrentNavigation().extras.state != undefined) {
            redirectPage = await this.router.getCurrentNavigation().extras.state.url
          }
        }
      });
      let url = this.PLATFORMID?window.location.href:''
      this.store.navSavePage = url.replace(( this.PLATFORMID?window.location.origin:''),'')
      this.store.navigatePage(['/auth'],'signup',redirectPage != undefined?{url:redirectPage}:undefined,undefined,true)
      return false;
    }
    return true;
  }

  loggedIn() {
    if(this.PLATFORMID){
      return this.cookieService.check(environment.cookiesKey);
    }
  }
}
