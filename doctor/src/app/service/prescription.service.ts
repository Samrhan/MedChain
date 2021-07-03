import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private http: HttpClient) {
  }

  post_prescription(prescription: any) {
    return this.http.post(environment.api_url + '/add_prescription', prescription, {
      withCredentials: true
    }).pipe(
      map((answer) => {
        return answer;
      }), catchError(err => {
        alert("Une erreur est survenue\n"+err.error.message)
        return of(err.status);
      })
    )
  }
}
