import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {
  constructor(public http: HttpClient, public router: Router) {
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
  disconnect(){
    this.http.post(environment.api_url + '/disconnect', null, {withCredentials: true}).subscribe(() => {
      this.router.navigate(['/login']);
    }, (err) => {
      alert("Une erreur est survenue lors de la déconnexion");
      this.router.navigate(['/login']);
    });
  }
}
