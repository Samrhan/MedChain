import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  authenticate(username: string, password: string): Observable<object> {
    return this.http.post(environment.api_url + '/login', {
      username: username,
      password: password
    }, {
      withCredentials: true
    });
  }

  disconnect(){
    return this.http.post(environment.api_url + '/disconnect', null, {withCredentials: true});
  }

  constructor(private http: HttpClient) {}
}
