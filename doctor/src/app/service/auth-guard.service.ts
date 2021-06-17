import {Injectable} from '@angular/core';

import {Router, CanActivate} from '@angular/router';
import {Observable, of} from "rxjs";
import {map, catchError} from "rxjs/operators"
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {
  constructor(public userService: UserService, public router: Router) {
  }

  canActivate(): Observable<boolean> | boolean {
    return this.userService.getConnectedUser().pipe(
      map((auth) => {
        return true;
      }),
      catchError(err => {
        this.router.navigateByUrl('/login')
        throw ''
      })
    );
  }
}
