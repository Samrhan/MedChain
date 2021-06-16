import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Ce service retourne les informations d'un utilisateur connecté
   * @return of(User)
   */
  getConnectedUser(): Observable<object>{
    return this.http.get(environment.api_url + '/me', {withCredentials: true});
  }

  constructor(private http: HttpClient) { }
}
