import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsManagerService {

  // localStorage key
  readonly data: string = "prescriptions";

  // Mutex lock
  mutex: boolean = true;

  constructor() { }

  isStorageEmpty(): boolean {
    return localStorage.getItem(this.data) === "";
  }

  getAllPrescriptions() {
    return JSON.parse(localStorage.getItem(this.data) || "[]");
  }

  addPrescription(token: string, password: string) {
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
      setTimeout((token, password) => this.addPrescription(token, password), 100)
    }
  }
}
