import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticatorService} from "../service/authenticator.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl(null),
    password: new FormControl(null)
  });
  passwdErr = false;
  missingPasswd = false;
  missingId = false;

  constructor(private authenticatorService: AuthenticatorService) {
  }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    const passwd = this.loginForm.controls.password.value;
    const username = this.loginForm.controls.username.value;
    this.missingPasswd = !passwd;
    this.missingId = !username;
    const validForm = !this.missingPasswd && !this.missingId;
    if (validForm) {
      const res = await this.authenticatorService.login(username, passwd).subscribe(response => {
        console.log(response)
      }, error => {
        switch (error.status){
          case 403:
            // Déjà connecté
            console.log(403)
            break;
          case 401:
            // Le compte existe mais l'e-mail n'est pas validé
            console.log(401)

            break;
          case 400:
            // Mot de passe ou e-mail invalide
            console.log(400)

            break;
          default:
            alert("Une erreur est survenue, veuillez rééssayer.")
        }
      });
    }
  }

}
