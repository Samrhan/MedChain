import { TestBed } from '@angular/core/testing';

import { PrescriptionsManagerService } from './prescriptions-manager.service';

describe('PrescriptionsManagerService', () => {
  let service: PrescriptionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
