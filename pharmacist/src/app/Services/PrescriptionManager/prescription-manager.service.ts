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

  fetch_prescription(id: string, password: string, social: string): Observable<number>{
    // On met les paramètres en cache
    localStorage.setItem('id', id);
    localStorage.setItem('password', password);
    localStorage.setItem('social', social);
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
        localStorage.setItem('cached_prescription', JSON.stringify(answer));
        return 200;
      }), catchError(err => {
        return of(err.status);
      })
    );
  }

  clear_cache(): void{
    localStorage.setItem('cached_prescription', "");
    localStorage.setItem('id', "");
    localStorage.setItem('password', "");
    localStorage.setItem('social', "");
  }

  get_prescription_cache(): any {
    const prescription = localStorage.getItem('cached_prescription');
    if (prescription) {
      return JSON.parse(prescription);
    } else {
      return null;
    }

  }
}
