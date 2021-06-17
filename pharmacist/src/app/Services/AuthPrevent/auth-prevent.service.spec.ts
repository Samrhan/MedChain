import { TestBed } from '@angular/core/testing';

import { AuthPreventService } from './auth-prevent.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UserService} from "../User/user.service";
import {RouterTestingModule} from "@angular/router/testing";

describe('AuthPreventService', () => {
  let service: AuthPreventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthPreventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
