import {TestBed} from '@angular/core/testing';

import {PrescriptionService} from './prescription.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthenticatorService} from "./authenticator.service";
import {environment} from "../../environments/environment";

describe('PrescriptionService', () => {
  let service: PrescriptionService
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(PrescriptionService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    spyOn(window, "alert");
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send data correctly', () => {
    const form = {
    };
    const expected_body = {
    }
    const expected_response = new HttpResponse({status: 200, body: {message: 'ok'}})

    service.post_prescription(form).subscribe(
      data => expect(data).toEqual({message: 'ok'}),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/add_prescription');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_body);

    req.event(expected_response);
  })

  it('should send error in case of server error', () => {
    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'});

    service.post_prescription({}).subscribe(
      data => expect(data).toEqual(400),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/add_prescription');

    req.flush({message: 'error'}, expected_response);

    expect(window.alert).toHaveBeenCalled();


  })
});
