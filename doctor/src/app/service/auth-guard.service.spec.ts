import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {of, throwError} from "rxjs";

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let mockUserService = jasmine.createSpyObj(['getConnectedUser']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: UserService, useValue: mockUserService}],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthGuardService);
    spyOn(service.router, 'navigateByUrl');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should redirect when no user is connected', (done: DoneFn) => {
    mockUserService.getConnectedUser.and.returnValue(throwError({status: 401}));

    service.canActivate().subscribe(fail, () => {
      expect(service.router.navigateByUrl).toHaveBeenCalledWith('/login');
      done();
    });
  })

  it('should return true when a user is connected', (done: DoneFn) => {
    mockUserService.getConnectedUser.and.returnValue(of({username: "enzo.filangi", nom_pharmacien: "Filangi", prenom_pharmacien: "Enzo", role: "pharmacien"}))

    service.canActivate().subscribe(value => {
      expect(value).toBeTruthy();
      done();
    }, fail);
  })
});
