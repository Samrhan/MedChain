import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import {UserService} from "../User/user.service";
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error when no user is connected', () => {
    mockUserService.getConnectedUser.and.returnValue(throwError({status: 401}))

    expect(service.canActivate).toThrowError();
  })

  it('should return true when a user is connected', () => {
    mockUserService.getConnectedUser.and.returnValue(of({role: "pharmacien"}))

    expect(service.canActivate()).toBeTruthy();
  })
});
