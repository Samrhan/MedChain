import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {environment} from "../../../environments/environment";
import { map, catchError } from "rxjs/operators"
import {CanActivate, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionManagerService implements CanActivate {

  shouldBeRefreshed: boolean = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router
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
        // On met en cache le résultat de la requête
        localStorage.setItem('cached_prescription', JSON.stringify(answer));
        return 200;
      }), catchError(err => {
        return of(err.status);
      })
    );
  }

  refresh_prescription(){
    this.shouldBeRefreshed = false;
    // On charge le cache
    let id: string = localStorage.getItem('id') || "";
    let password: string = localStorage.getItem('password') || "";
    let social: string = localStorage.getItem('social') || "";
    if (!id || !password || !social){
      throw throwError("no data cached");
    }
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
        // On met en cache le résultat de la requête
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

  get_uses_left(): Observable<number> {
    let id: string = localStorage.getItem('id') || "";
    let password: string = localStorage.getItem('password') || "";
    let social: string = localStorage.getItem('social') || "";
    return this.httpClient.post(environment.api_url + "/token_state", {
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
        // @ts-ignore
        return answer.uses_left;
      }), catchError(() => {
        return of(-1);
      })
    );
  }

  post_note(content: string): Observable<any>{
    let id: string = localStorage.getItem('id') || "";
    let password: string = localStorage.getItem('password') || "";
    let social: string = localStorage.getItem('social') || "";
    if (!id || !password || !social){
      throw throwError("no data cached");
    }
    return this.httpClient.post(environment.api_url + "/note", {
      // token: id,
      // secu: social,
      // password: password
      id_ordonnance: id,
      num_secu: social,
      password: password,
      content: content
    }, {
      withCredentials: true
    })
  }

  patch_note(content: string): Observable<any>{
    let id: string = localStorage.getItem('id') || "";
    let password: string = localStorage.getItem('password') || "";
    let social: string = localStorage.getItem('social') || "";
    if (!id || !password || !social){
      throw throwError("no data cached");
    }
    return this.httpClient.patch(environment.api_url + "/note", {
      // token: id,
      // secu: social,
      // password: password
      id_ordonnance: id,
      num_secu: social,
      password: password,
      content: content
    }, {
      withCredentials: true
    })
  }

  /**
   * Permet de restreindre l'accès à certaines routes uniquement si une ordonnance est en cache
   */
  canActivate():boolean {
    if (localStorage.getItem('cached_prescription') !== "") {
      return true;
    } else {
      this.router.navigateByUrl('/scan_ordonnance')
      return false;
    }
  }
}
