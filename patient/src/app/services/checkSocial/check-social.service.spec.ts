import { TestBed } from '@angular/core/testing';

import { CheckSocialService } from './check-social.service';
import {PrescriptionsManagerService} from "../prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('CheckSocialService', () => {
  let service: CheckSocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ PrescriptionsManagerService ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(CheckSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
