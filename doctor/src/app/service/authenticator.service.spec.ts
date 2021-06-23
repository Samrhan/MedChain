import { TestBed } from '@angular/core/testing';
import {environment} from "../../environments/environment";

import { AuthenticatorService } from './authenticator.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthenticatorService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    spyOn(service.router, 'navigate');
    spyOn(window, "alert");
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST login in the right format', () => {
    const username = "test";
    const password = "pass";
    const expected_body = {
      username: "test",
      password: "pass",
      user_type: 1
    }
    const expected_response = new HttpResponse({status: 200, body: {message: 'ok', id: '-1'}})

    service.login(username, password).subscribe(
      data => expect(data).toEqual({message: 'ok', id: '-1'}),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/login');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_body);

    req.event(expected_response);
  })

  it('should POST disconnect in the right format and redirect', () => {
    const expected_response = new HttpResponse({status: 200, statusText: 'OK'});

    service.disconnect();

    const req = httpMock.expectOne(environment.api_url + '/disconnect');
    expect(req.request.method).toEqual("POST");

    req.event(expected_response);

    expect(service.router.navigate).toHaveBeenCalledWith(['/login'])
  })

  it('should POST disconnect in the right format and redirect even in case of error', () => {
    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'});

    service.disconnect();

    const req = httpMock.expectOne(environment.api_url + '/disconnect');
    expect(req.request.method).toEqual("POST");

    req.flush({message: 'error'}, expected_response);

    expect(service.router.navigate).toHaveBeenCalledWith(['/login'])
    expect(window.alert).toHaveBeenCalled();
  })
});
