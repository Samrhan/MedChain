import { TestBed } from '@angular/core/testing';

import { AuthPreventService } from './auth-prevent.service';

describe('AuthPreventService', () => {
  let service: AuthPreventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthPreventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
