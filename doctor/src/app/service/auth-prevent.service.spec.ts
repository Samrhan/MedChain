import { TestBed } from '@angular/core/testing';

import { AuthPreventService } from './auth-prevent.service';
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

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
});
