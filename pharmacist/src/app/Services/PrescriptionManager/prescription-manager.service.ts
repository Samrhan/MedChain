import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import { map, catchError } from "rxjs/operators"

@Injectable({
  providedIn: 'root'
})
export class PrescriptionManagerService {

  constructor(
    private httpClient: HttpClient
  ) { }

  cached_prescription: any;
  id: String = "";
  password: String = "";
  social: String = "";

  fetch_prescription(id: String, password: String, social: String): Observable<number>{
    // On met les paramètres en cache
    this.id = id;
    this.password = password;
    this.social = social;
    // Puis on fait la requête
    return this.httpClient.post(environment.api_url + "/get_prescription", {
      // token: id,
      // secu: social,
      // password: password
      id_ordonnance: id,
      num_secu: social,
      password: password
    }, {
      withCredentials: true
    }).pipe(
      map((answer) => {
        // On cache le résultat de la requête
        this.cached_prescription = answer;
        return 200;
      }), catchError(err => {
        return of(err.status);
      })
    );
  }

  clear_cache(): void{
    this.cached_prescription = null;
    this.id = "";
    this.password = "";
    this.social = "";
  }

  get_prescription_cache(): any {
    return this.cached_prescription;
  }
}
