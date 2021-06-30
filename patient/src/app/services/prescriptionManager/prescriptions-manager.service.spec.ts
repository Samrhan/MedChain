import { TestBed } from '@angular/core/testing';

import { PrescriptionsManagerService } from './prescriptions-manager.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('PrescriptionsManagerService', () => {
  let service: PrescriptionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(PrescriptionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
