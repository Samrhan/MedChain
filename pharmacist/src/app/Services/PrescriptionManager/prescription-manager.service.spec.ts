import { TestBed } from '@angular/core/testing';

import { PrescriptionManagerService } from './prescription-manager.service';

describe('PrescriptionManagerService', () => {
  let service: PrescriptionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
