import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {UserService} from "../Services/User/user.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm:FormGroup = this.formBuilder.group({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  validation_messages = {
    email: [
      {type: 'required', message: 'Nom d\'utilisateur requis'},
    ],
    password: [
      {type: 'required', message: 'Mot de passe requis'}
    ]
  };

  loggedIn = false;
  wrong_credentials = false;

  constructor(
    private authenticatorService: AuthenticatorService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  authenticate() {
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.wrong_credentials = false;
    this.authenticatorService.authenticate(email, password).subscribe(response => {
      this.loggedIn = true
      this.wrong_credentials = false
      this.router.navigate(['/dashboard']);
    }, error => {
      switch (error.status){
        case 403:
          // Déjà connecté
          this.loggedIn = true;
          this.wrong_credentials = false;
          this.router.navigate(['/']);
          break;
        case 400:
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
      return control.hasError(validation.type) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

}
