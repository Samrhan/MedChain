import { TestBed } from '@angular/core/testing';

import { CheckSocialService } from './check-social.service';

describe('CheckSocialService', () => {
  let service: CheckSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
