import { Injectable } from '@angular/core';

import { Router, CanActivate } from '@angular/router';
import { UserService } from "../User/user.service";
import {Observable, of} from "rxjs";
import { map, catchError } from "rxjs/operators"

/**
 *  Cette classe empêche les utilisateurs connectés d'accéder aux routes qu'elle protège
 */
@Injectable({
  providedIn: 'root'
})
export class AuthPreventService implements CanActivate {
  constructor(public userService: UserService, public router: Router) {}

  canActivate():Observable<boolean> {
    return this.userService.getConnectedUser().pipe(
      map((auth) => {
        this.router.navigateByUrl('/scan_ordonnance')
        return false;
      }),
      catchError(err => {return of(true)})
    );
  }
}
