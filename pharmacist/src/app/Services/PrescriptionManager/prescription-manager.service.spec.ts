import { TestBed } from '@angular/core/testing';

import { PrescriptionManagerService } from './prescription-manager.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";

describe('PrescriptionManagerService', () => {
  let service: PrescriptionManagerService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PrescriptionManagerService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clear_cache() should reset all cache fields', () => {
    service.cached_prescription = {foo: "bar"};
    service.id= "foo";
    service.password = "foo";
    service.social = "foo";

    expect(service.cached_prescription).toBeTruthy();
    expect(service.id).toBeTruthy();
    expect(service.password).toBeTruthy();
    expect(service.social).toBeTruthy();

    service.clear_cache()

    expect(service.cached_prescription).toBeFalsy();
    expect(service.id).toBeFalsy();
    expect(service.password).toBeFalsy();
    expect(service.social).toBeFalsy();
  })

  it('should fetch the prescription in the correct format', () => {
    const username = "test";
    const password = "pass";
    const id = "1234";
    const expected_body = {
      num_secu: "test",
      password: "pass",
      id_ordonnance: "1234"
    }
    const expected_response = new HttpResponse({status: 200, body: {content: 'lorem ipsum dolor sit amet'}})

    service.fetch_prescription(id, password, username).subscribe(
      data => expect(data).toEqual(200),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/get_prescription');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_body);

    req.event(expected_response);
  })

  it('fetch_prescription() should return the correct value in case of error', () => {
    const username = "test";
    const password = "pass";
    const id = "1234";
    for(let i of [400, 401, 403]){
      const expected_response = new HttpResponse({status: i, statusText: 'bad request'})

      service.fetch_prescription(id, password, username).subscribe(
        data => expect(data).toEqual(i),
        fail
      )

      const req = httpMock.expectOne(environment.api_url + '/get_prescription');

      req.flush({message: 'error'}, expected_response);
    }
  })

  it('should cache the fetched prescription', () => {
    const username = "test";
    const password = "pass";
    const id = "1234";
    const expected_body = {
      num_secu: "test",
      password: "pass",
      id_ordonnance: "1234"
    }
    const prescription = {content: 'lorem ipsum dolor sit amet'}
    const expected_response = new HttpResponse({status: 200, body: prescription})

    service.fetch_prescription(id, password, username).subscribe(
      () => expect(service.get_prescription_cache()).toEqual(prescription),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/get_prescription');

    req.event(expected_response);
  })
});
