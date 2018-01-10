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
        return this.http.post("ENDPOINT_TO_POST", data, options)
    }

    public setLogged(): Observable<any> {

        let headers = new Headers({
            "Authorization": "Basic " + btoa("HEADER_INFO CONNECT")
        });

        let options = new RequestOptions({ headers: headers })

        return this.http.post("URL_CONNECT_OAUTH", {}, options)
           
    }
}