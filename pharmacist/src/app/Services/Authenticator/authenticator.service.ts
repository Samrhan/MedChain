import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  authenticate(username: string, password: string): Observable<object> {
    return this.http.post(environment.api_url + '/login', {
      username: username,
      password: password,
      user_type: 0
    }, {
      withCredentials: true
    });
  }

  disconnect(){
    this.http.post(environment.api_url + '/disconnect', null, {withCredentials: true}).subscribe(() => {
      this.router.navigate(['/login']);
    }, () => {
      alert("Une erreur est survenue lors de la déconnexion");
      this.router.navigate(['/login']);
    });
  }

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}
}
