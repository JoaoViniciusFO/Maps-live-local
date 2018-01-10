import { RequestOptions, Headers, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/services/cookies.service';

@Injectable()
export class MapService {
    constructor(private http: Http, private cookieService: CookieService) { }

    public setMyPosition(data: any): Observable<any> {
        let token = this.cookieService.get("accessToken");

        let headers = new Headers({ 'Authorization': "Bearer " + token });

        let options = new RequestOptions({ headers: headers });
        return this.http.post("http://192.168.1.241:8080/mais-vida/set-location", data, options)
    }

    public setLogged(): Observable<any> {

        let headers = new Headers({
            "Authorization": "Basic " + btoa("tablet" + ':' + "123")
        });

        let options = new RequestOptions({ headers: headers })

        return this.http.post("http://192.168.1.241:8080/mais-vida/oauth/token?grant_type=password&username=medico&password=123", {}, options)
           
    }
}