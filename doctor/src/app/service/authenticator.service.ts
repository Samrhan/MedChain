import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  constructor(private http: HttpClient) {
  }
  login(username: string, password: string): Observable<object> {
    return this.http.post(environment.api_url + '/login', {
      username: username,
      password: password,
      user_type: 1
    }, {
      withCredentials: true
    });
  }
}
