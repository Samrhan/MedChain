import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthenticatorService} from "../service/authenticator.service";
import {Router} from "@angular/router";

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
  badRpps = false;

  constructor(private authenticatorService: AuthenticatorService, public router: Router) {
  }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    const passwd = this.loginForm.controls.password.value;
    const username = this.loginForm.controls.username.value;
    this.missingPasswd = !passwd;
    this.missingId = !username;
    this.badRpps = !username.match(/^[0-9]{11}$/g);
    const validForm = !this.missingPasswd && !this.missingId && !this.badRpps;
    if (validForm) {
      await this.authenticatorService.login(username, passwd).subscribe(response => {
        this.router.navigateByUrl('/form_ordonnance')
      }, error => {
        switch (error.status) {
          case 401:
            this.passwdErr = true
            break;
          default:
            alert("Une erreur est survenue, veuillez rééssayer.")
        }
      });
    }
  }

}
