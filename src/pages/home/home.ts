import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MapService } from './service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GoogleMap, GoogleMaps, GoogleMapOptions, GoogleMapsEvent, LatLng, CameraPosition, Marker, MarkerClusterOptions } from '@ionic-native/google-maps';
import { Platform } from 'ionic-angular/platform/platform';
import { Geolocation } from '@ionic-native/geolocation';
import { Device } from '@ionic-native/device';

import { StompService } from 'ng2-stomp-service/dist/stomp.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapService, StompService,Device]
})
export class HomePage {

  map: GoogleMap;
  public lat: number;
  public long: number;
  public config: LatLng
  public allUsers: any[];
  public url: string
  public coords: any

  constructor(
    private stomp: StompService,
    public platform: Platform,
    public navCtrl: NavController,
    private googleMap: GoogleMaps,
    private geolocation: Geolocation,
    private service: MapService,
    private cookieService: CookieService,
    private device: Device
  ) {

    this.url = "http://192.168.1.241:8080/mais-vida/mv-chat";
    this.stomp.configure({
      host: this.url,
      debug: false,
      queue: { 'init': true }
    });


    this.startWS();
  }
  
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.getUserPosition();
    });
  }

  public headers = {
    "Authorization": "Bearer " + this.cookieService.get("accessToken")
  };
  
  public startWS() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      this.stomp.configure({
        host: this.url,
        headers: this.headers,
        debug: false,
        queue: { 'init': true }
      });
      
      this.startSubscribe();
    }, (err) => { console.log("ERRO AO CONNECTAR NO WEBSOCKET SERVER -----", err) });
  }
  
  public startSubscribe() {
    this.stomp.subscribe("/topic/locals",
    resp => {
      this.setUsersLactions(resp);
    }
  )
}

public setUsersLactions(users) {
  if (users) {
    this.allUsers = users;
    this.setPined(users)
  }
}

public getUserPosition() {
  this.geolocation.getCurrentPosition().then((local) => {
    this.config = new LatLng(local.coords.latitude, local.coords.longitude);
    this.updateMyLocale();
  });
}

public loadMap() {
  
  this.map = new GoogleMap('map', {
    controls: {
      'compass': true,
      'myLocationButton': true,
      'indoorPicker': true,
      'zoom': true
    },
      'camera': {
        'target': this.config,
        'tilt': 3,
        'zoom': 15
      }
    });

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
      this.map.setCameraZoom(18);
      this.map.setCameraTarget(this.config);
      this.setPined();
      this.map.refreshLayout();
    });
  }

  public setPined(data?){
    this.map.clear();
    if (data) {
      data.forEach((pin) => {
        if (pin.lat && pin.lng) {
          let position = new LatLng(pin.lat, pin.lng)
          this.map.refreshLayout();
          this.map.addMarker({
            title: "Teste",
            animation: '',
            position: position
          }).then(pin => {
          
          });
        }
      })
    }
  }

  public updateMyLocale() {
    this.loadMap();

    this.geolocation.watchPosition()
      .subscribe((data) => {
        let obj = {
          "idDevice": this.device.uuid,
          "lat": data.coords.latitude,
          "lng": data.coords.longitude
        };
        console.log(obj)
        this.service.setMyPosition(obj)
          .subscribe(
          res => res,
          err => console.log('err', err)
          )
      });
  }

}