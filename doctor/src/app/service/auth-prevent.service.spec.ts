import { TestBed } from '@angular/core/testing';

import { AuthPreventService } from './auth-prevent.service';
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {of, throwError} from "rxjs";

describe('AuthPreventService', () => {
  let service: AuthPreventService;
  let mockUserService = jasmine.createSpyObj(['getConnectedUser']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: UserService, useValue: mockUserService}],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthPreventService);
    spyOn(service.router, 'navigateByUrl');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when no user is connected', (done: DoneFn) => {
    mockUserService.getConnectedUser.and.returnValue(throwError({status: 401}));

    service.canActivate().subscribe(value => {
      expect(value).toBeTruthy();
      done();
    }, fail);
  })

  it('should return false and redirect when a user is connected', (done: DoneFn) => {
    mockUserService.getConnectedUser.and.returnValue(of({username: "enzo.filangi", nom_pharmacien: "Filangi", prenom_pharmacien: "Enzo", role: "pharmacien"}))

    service.canActivate().subscribe(value => {
      expect(value).toBeFalsy()
      expect(service.router.navigateByUrl).toHaveBeenCalledWith('/prescription');
      done();
    }, fail);

  })
});
