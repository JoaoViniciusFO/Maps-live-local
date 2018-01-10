import { MapService } from './../pages/home/service';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Headers, Http, RequestOptions } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private serv: MapService, private cookieService: CookieService) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.serv.setLogged()
    .subscribe(
      res=> this.cookieService.put("accessToken", res.json().access_token),
      err => err
    )
  }
  
}

