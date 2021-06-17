import { TestBed } from '@angular/core/testing';

import { AuthPreventService } from './auth-prevent.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserService} from "../User/user.service";
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when no user is connected', () => {
    mockUserService.getConnectedUser.and.returnValue(throwError({status: 401}))

    expect(service.canActivate()).toBeTruthy();
  })

  it('should throw error when a user is connected', () => {
    mockUserService.getConnectedUser.and.returnValue(of({role: "pharmacien"}))

    expect(service.canActivate).toThrowError();
  })
});
