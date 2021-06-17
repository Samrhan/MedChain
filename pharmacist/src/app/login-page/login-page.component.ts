import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm:FormGroup = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  loggedIn = false;
  wrong_credentials = false;

  constructor(
    private authenticatorService: AuthenticatorService,
    private formBuilder: FormBuilder,
    public router: Router,
  ) {}

  authenticate() {
    const email = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    this.wrong_credentials = false;
    this.authenticatorService.authenticate(email, password).subscribe(response => {
      this.loggedIn = true
      this.wrong_credentials = false
      this.router.navigate(['/scan_ordonnance']);
    }, error => {
      switch (error.status){
        case 403:
          // Déjà connecté
          this.loggedIn = true;
          this.wrong_credentials = false;
          this.router.navigate(['/']);
          break;
        case 400:
        case 401:
          // Mot de passe ou e-mail invalide
          this.wrong_credentials = true;
          this.loggedIn = false;
          break;
        default:
          alert("Une erreur est survenue, veuillez rééssayer.")
      }
    })
  }

  ngOnInit(): void {
  }

  invalid_input(name: string, validation: any) {
    let control: AbstractControl | null = this.loginForm.get(name);
    if (control){
      return control.hasError(validation) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

}
