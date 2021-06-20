import {Component, Input, OnInit} from '@angular/core';
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() display_goBack_button: boolean = false;
  @Input() go_back_route: String = "";

  constructor(
    private authenticatorService: AuthenticatorService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  disconnect(){
    this.authenticatorService.disconnect()
  }

  goBack(){
    this.router.navigate([this.go_back_route]);
  }

}
