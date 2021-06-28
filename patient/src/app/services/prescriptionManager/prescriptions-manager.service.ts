import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsManagerService {

  // localStorage keys
  readonly data: string = "prescriptions";
  readonly social: string = "social_security";

  // Mutex lock
  addMutex: boolean = true;
  remMutex: boolean = true;

  constructor(
    private httpClient: HttpClient
  ) { }

  isStorageEmpty(): boolean {
    return JSON.parse(localStorage.getItem(this.data) || "[]").length === 0;
  }

  isSocialEmpty(): boolean {
    return (localStorage.getItem(this.social) || "") === "";
  }

  getAllPrescriptions(): any {
    return JSON.parse(localStorage.getItem(this.data) || "[]");
  }

  getSocial(): string {
    return localStorage.getItem(this.social) || "";
  }

  addPrescription(token: string, password: string): void {
    // Pour éviter que deux écritures simultanées ne viennent se surcharger l'une l'autre, on bloque l'accès à la méthode le temps que le traitement s'effectue
    if (this.addMutex){
      this.addMutex = false;
      let prescriptions: Array<any>  = JSON.parse(localStorage.getItem(this.data) || "[]");
      if (prescriptions.findIndex(element => element.token == token) === -1){
        prescriptions.push({
          token: token,
          password: password
        })
        localStorage.setItem(this.data, JSON.stringify(prescriptions));
      }
      this.addMutex = true;
    } else {
      setTimeout((token: string, password: string) => this.addPrescription(token, password), 100)
    }
  }

  removePrescription(token: string): void {
    // Pour éviter que deux écritures simultanées ne viennent se surcharger l'une l'autre, on bloque l'accès à la méthode le temps que le traitement s'effectue
    if (this.remMutex){
      this.remMutex = false;
      let prescriptions: Array<any>  = JSON.parse(localStorage.getItem(this.data) || "[]");
      let index = prescriptions.findIndex(element => element.token == token);
      prescriptions.splice(index, 1);
      localStorage.setItem(this.data, JSON.stringify(prescriptions));
      this.remMutex = true;
    } else {
      setTimeout((token: string, password: string) => this.addPrescription(token, password), 100)
    }
  }

  setSocial(new_social: string): void {
    localStorage.setItem(this.social, new_social);
  }

  clearAll(): void {
    localStorage.setItem(this.data, JSON.stringify([]));
    localStorage.setItem(this.social, "");
  }

  getTokenState(token: string, password: string): Observable<any>{
    const social = localStorage.getItem(this.social);
    return this.httpClient.post(environment.api_url + "/token_state", {
      token_id: token,
      secu: social,
      password: password
    })
  }
}
