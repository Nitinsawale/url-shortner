import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ApiRequestService {

    private token!: string;
    protected tokenholder = new BehaviorSubject("");
    private refreshTokenHolder = new BehaviorSubject("");
    constructor(private http: HttpClient) { }


    setRefreshToken(token:string) {
        sessionStorage.setItem("refresh_token", token);
        this.refreshTokenHolder.next(token);
    }

    getRefreshToken() {
        return sessionStorage.getItem('refresh_token')
        return this.refreshTokenHolder.getValue();
    }
    setToken(token:string) {

        this.token = token;
        this.tokenholder.next(token);
    }

    getToken() {

        return this.tokenholder.getValue()
    }

    requestOptions = {
        headers: new HttpHeaders({
            'Au': "HELLO"
        })
    };

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getToken()

        })
    };

    httpOptionsFile = {
        headers: new HttpHeaders({
            'timeout': '600000',
            'Authorization': 'Bearer ' + this.getToken()

        })
    };

    AuthorizationHeader = {
        headers: new HttpHeaders({
            "Authorization": "Bearer " + this.getToken(),
        })
    }

    post(url:string, requestData:any): Observable<any> {
        //let headers = new HttpHeaders().set("Authorization", "Bearer " + this.getToken()).append("Content-Type", "application/json");
        //return this.http.post(url, requestData, { headers: headers });
        return this.http.post(url, requestData);
    }

    get(url:string): Observable<any> {
        //let headers = new HttpHeaders().set("Authorization", "Bearer " + this.getToken());
        //return this.http.get(url, { headers: headers });
        return this.http.get(url);

    }


    login(url:string, data:any): Observable<any> {

        return this.http.post(url, data, this.httpOptions);
    }

    refreshToken(): Observable<any> {
        let formdata = new FormData();
        const userid = sessionStorage.getItem('userid') == null ? "" : sessionStorage.getItem('userid');
        formdata.append('userid', "" );
        formdata.append('refresh_token', "");
        formdata.append('old_token', this.getToken());

        // return new Promise((resolve, reject) => {

        //     this.http.post(ConstantsService.ENDPOINT_URL + 'refresh-token', formdata).subscribe(data => {
        //         this.setToken(data['auth_token']);
        //         resolve(true);
        //     }, err => {
        //         reject(true);
        //     });
        // });

        return this.http.post<any>(ConstantsService.ENDPOINT_URL + 'refresh-token', formdata)
            .pipe(map((data) => {
                this.setToken(data['auth_token'])
                return data['auth_token'];
            }));

    }



}
