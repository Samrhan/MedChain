import { TestBed } from '@angular/core/testing';

import { CheckSocialService } from './check-social.service';
import {PrescriptionsManagerService} from "../prescriptionManager/prescriptions-manager.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('CheckSocialService', () => {
  let service: CheckSocialService;

  let mockPrescriptionsManager = jasmine.createSpyObj(['isSocialEmpty'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PrescriptionsManagerService, useValue: mockPrescriptionsManager }
      ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(CheckSocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('canActivate() should return true when storage is not empty', () => {
    mockPrescriptionsManager.isSocialEmpty.and.returnValue(false);

    expect(service.canActivate()).toBeTruthy()
  })

  it('canActivate() should return false and redirect when storage is empty', () => {
    mockPrescriptionsManager.isSocialEmpty.and.returnValue(true);
    spyOn(service.router, 'navigate');

    expect(service.canActivate()).toBeFalsy()
    expect(service.router.navigate).toHaveBeenCalledWith(['/num_secu'])
  })
});
