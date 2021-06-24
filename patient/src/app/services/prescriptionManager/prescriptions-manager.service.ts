import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsManagerService {

  // localStorage keys
  readonly data: string = "prescriptions";
  readonly social: string = "social_security";

  // Mutex lock
  mutex: boolean = true;

  constructor() { }

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
    if (this.mutex){
      this.mutex = false;
      let prescriptions: Array<any>  = JSON.parse(localStorage.getItem(this.data) || "[]");
      prescriptions.push({
        token: token,
        password: password
      })
      localStorage.setItem(this.data, JSON.stringify(prescriptions));
      this.mutex = true;
    } else {
      setTimeout((token: string, password: string) => this.addPrescription(token, password), 100)
    }
  }

  setSocial(new_social: string): void {
    localStorage.setItem(this.social, new_social);
  }

  clearAll() {
    localStorage.setItem(this.data, JSON.stringify([]));
    localStorage.setItem(this.social, "");
  }
}
