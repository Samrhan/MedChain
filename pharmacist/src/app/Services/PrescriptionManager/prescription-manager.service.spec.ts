import { TestBed } from '@angular/core/testing';

import { PrescriptionManagerService } from './prescription-manager.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RouterTestingModule} from "@angular/router/testing";

describe('PrescriptionManagerService', () => {
  let service: PrescriptionManagerService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(PrescriptionManagerService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    localStorage.setItem('cached_prescription', "");
    localStorage.setItem('id', "");
    localStorage.setItem('password', "");
    localStorage.setItem('social', "");
    localStorage.setItem('note', "");
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clear_cache() should reset all cache fields', () => {
    localStorage.setItem('cached_prescription', JSON.stringify({foo: "bar"}));
    localStorage.setItem('id', "foo");
    localStorage.setItem('password', "foo");
    localStorage.setItem('social', "foo");
    localStorage.setItem('note', "foo");

    expect(localStorage.getItem('cached_prescription')).toBeTruthy();
    expect(localStorage.getItem('id')).toBeTruthy();
    expect(localStorage.getItem('password')).toBeTruthy();
    expect(localStorage.getItem('social')).toBeTruthy();
    expect(localStorage.getItem('note')).toBeTruthy();

    service.clear_cache()

    expect(localStorage.getItem('cached_prescription')).toBeFalsy();
    expect(localStorage.getItem('id')).toBeFalsy();
    expect(localStorage.getItem('password')).toBeFalsy();
    expect(localStorage.getItem('social')).toBeFalsy();
    expect(localStorage.getItem('note')).toBeFalsy();
  })

  it('should fetch the prescription in the correct format', () => {
    const username = "test";
    const password = "pass";
    const id = "1234";
    const expected_body = {
      secu: "test",
      password: "pass",
      token: "1234"
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
    const social = "0000";
    const password = "pass";
    const id = "1234";

    const prescription = {content: 'lorem ipsum dolor sit amet'}
    const expected_response = new HttpResponse({status: 200, body: prescription})

    service.fetch_prescription(id, password, social).subscribe(
      () => expect(service.get_prescription_cache()).toEqual(prescription),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/get_prescription');

    req.event(expected_response);
  })

  it('refresh_prescription() should throw error on empty cache', () => {
    expect(service.refresh_prescription).toThrow();
  })

  it('refresh_prescription() should return the HttpError status in case one occurs', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const err_code = 400;
    const expected_response = new HttpResponse({status: err_code, statusText: 'bad request'})

    service.refresh_prescription().subscribe(
      data => expect(data).toEqual(err_code),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/get_prescription');

    req.flush({message: 'error'}, expected_response);
  })

  it('refresh_prescription() should cache the new response', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");
    const expected_body = {
      secu: "1234",
      password: "pass",
      token: "test"
    }

    const answ_body = {content: 'lorem ipsum dolor sit amet'}
    const expected_response = new HttpResponse({status: 200, body: answ_body})

    service.refresh_prescription().subscribe(
      data => expect(data).toEqual(200),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/get_prescription');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_body);

    req.event(expected_response);

    expect(localStorage.getItem('cached_prescription')).toEqual(JSON.stringify(answ_body));
  })


});
