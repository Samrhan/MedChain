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
    let prescriptions: Array<any>  = JSON.parse(localStorage.getItem(this.data) || "[]");
    if (prescriptions.findIndex(element => element.token == token) === -1){
      prescriptions.push({
        token: token,
        password: password
      })
      localStorage.setItem(this.data, JSON.stringify(prescriptions));
    }
  }

  removePrescription(token: string): void {
    let prescriptions: Array<any>  = JSON.parse(localStorage.getItem(this.data) || "[]");
    let index = prescriptions.findIndex(element => element.token == token);
    if (index >= 0){
      prescriptions.splice(index, 1);
      localStorage.setItem(this.data, JSON.stringify(prescriptions));
    }
  }

  setSocial(new_social: string): void {
    localStorage.setItem(this.social, new_social);
  }

  clearAll(): void {
    localStorage.removeItem(this.data);
    localStorage.removeItem(this.social);
  }

  getTokenState(token: string, password: string): Observable<any>{
    const social = localStorage.getItem(this.social);
    return this.httpClient.post(environment.api_url + "/token_state", {
      token: token,
      secu: social,
      password: password
    })
  }
}
