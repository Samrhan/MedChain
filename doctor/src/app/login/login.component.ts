import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticatorService} from "../service/authenticator.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    rpps: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  badRppsOrPassword = false

  constructor(private authenticatorService: AuthenticatorService, public router: Router) {
  }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    const passwd = this.loginForm.controls.password.value;
    const rpps = this.loginForm.controls.rpps.value;

    const res = await this.authenticatorService.login(rpps, passwd).subscribe(response => {
      this.router.navigate(['/form_ordonnance'])
    }, error => {
      switch (error.status) {
        case 403:
          break;
        case 401:
          this.badRppsOrPassword = true
          break;
        case 400:
          this.badRppsOrPassword = true
          break;
        default:
          alert("Une erreur est survenue, veuillez rééssayer.")
      }
    });

  }

  invalid_input(name: string, validation: any) {
    let control: AbstractControl | null = this.loginForm.get(name);
    if (control) {
      return control.hasError(validation) && (control.dirty || control.touched)
    } else {
      return true;
    }
  }

}
