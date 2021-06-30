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

  it('refresh_prescription() should fail on empty cache', () => {
    expect(function(){service.refresh_prescription()}).toThrow();
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

  it('get_uses_left() should fail on empty cache', () => {
    service.get_uses_left().subscribe((ans) => {
      expect(ans).toEqual(-1);
    }, fail)

    localStorage.setItem('id', "test");
    service.get_uses_left().subscribe((ans) => {
      expect(ans).toEqual(-1);
    }, fail);

    localStorage.setItem('password', "test");
    service.get_uses_left().subscribe((ans) => {
      expect(ans).toEqual(-1);
    }, fail);
  })

  it('get_uses_left() should fail on httpError', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");
    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'})

    service.get_uses_left().subscribe(
      data => expect(data).toEqual(-1),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/token_state');

    req.flush({message: 'error'}, expected_response);
  })

  it('get_uses_left() should return the correct number', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");
    const expected_request_body = {
      token_id: "test",
      secu: "1234",
      password: "pass"
    }
    const response_body = {
      uses_left: 1,
      max_date: "2022-06-11T22:00:00.000Z",
      Date_prescription: "2021-06-11T22:00:00.000Z"
    }
    const expected_response = new HttpResponse({status: 200, body: response_body})

    service.get_uses_left().subscribe(
      data => expect(data).toEqual(response_body.uses_left),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/token_state');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_request_body);

    req.event(expected_response);
  })

  it('post_note() should fail on empty cache', () => {
    expect(function(){service.post_note("foo")}).toThrow();
    localStorage.setItem('id', "test");
    expect(function(){service.post_note("foo")}).toThrow();
    localStorage.setItem('password', "test");
    expect(function(){service.post_note("foo")}).toThrow();
  })

  it('post_note() should cache the note content', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const content = "foobar"

    service.post_note(content);
    expect(localStorage.getItem('note')).toEqual(content);
  })

  it('post_note() should correctly format the request', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const content = "foobar"

    const expected_request_body = {
      token: "test",
      secu: "1234",
      password: "pass",
      content: content
    }
    const expected_response = new HttpResponse({status: 200, body: {message: 'ok'}})

    service.post_note(content).subscribe(
      () => {},
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/note');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_request_body);

    req.event(expected_response);
  })

  it('post_note() should pass the error back in case of httpError', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const content = "foobar"

    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'})

    service.post_note(content).subscribe(
      fail,
      () => {
        expect(true).toBeTrue()
      }
    )

    const req = httpMock.expectOne(environment.api_url + '/note');

    req.flush({message: 'error'}, expected_response);
  })

  it('patch_note() should fail on empty cache', () => {
    expect(function(){service.patch_note("foo")}).toThrow();
    localStorage.setItem('id', "test");
    expect(function(){service.patch_note("foo")}).toThrow();
    localStorage.setItem('password', "test");
    expect(function(){service.patch_note("foo")}).toThrow();
  })

  it('patch_note() should correctly format the request', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const content = "foobar"

    const expected_request_body = {
      token: "test",
      secu: "1234",
      password: "pass",
      content: content
    }
    const expected_response = new HttpResponse({status: 200, body: {message: 'ok'}})

    service.patch_note(content).subscribe(
      () => {},
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/note');
    expect(req.request.method).toEqual("PATCH");
    expect(req.request.body).toEqual(expected_request_body);

    req.event(expected_response);
  })

  it('patch_note() should pass the error back in case of httpError', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const content = "foobar"

    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'})

    service.patch_note(content).subscribe(
      fail,
      () => {
        expect(true).toBeTrue()
      }
    )

    const req = httpMock.expectOne(environment.api_url + '/note');

    req.flush({message: 'error'}, expected_response);
  })

  it('get_note() should return null on empty cache', () => {
    expect(service.get_note()).toBeNull();
  })

  it('get_note() should return the correct value', () => {
    const content = "foobar";

    localStorage.setItem('note', content)

    expect(service.get_note()).toEqual(content);
  })

  it('canActivate() should return false and redirect on empty cache', () => {
    spyOn(service.router, 'navigateByUrl');

    expect(service.canActivate()).toBeFalse();
    expect(service.router.navigateByUrl).toHaveBeenCalledWith('/scan_ordonnance');
  })

  it('canActivate() should return true on full cache', () => {
    const prescription = {content: 'lorem ipsum dolor sit amet'}
    localStorage.setItem('cached_prescription', JSON.stringify(prescription))

    expect(service.canActivate()).toBeTrue();
  })

  it('use_prescription() should fail on empty cache', () => {
    expect(function(){service.use_prescription(true)}).toThrow();
    localStorage.setItem('id', "test");
    expect(function(){service.use_prescription(true)}).toThrow();
    localStorage.setItem('password', "test");
    expect(function(){service.use_prescription(true)}).toThrow();
  })

  it('use_prescription() should correctly format the request', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const fully_used = true;

    const expected_request_body = {
      token: "test",
      secu: "1234",
      password: "pass",
      fully_used: fully_used
    }
    const expected_response = new HttpResponse({status: 200, body: {message: 'ok'}})

    service.use_prescription(fully_used).subscribe(
      () => {},
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/use_prescription');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_request_body);

    req.event(expected_response);
  })

  it('use_prescription() should pass the error back in case of httpError', () => {
    localStorage.setItem('id', "test");
    localStorage.setItem('password', "pass");
    localStorage.setItem('social', "1234");

    const fully_used = true;

    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'})

    service.use_prescription(fully_used).subscribe(
      fail,
      () => {
        expect(true).toBeTrue()
      }
    )

    const req = httpMock.expectOne(environment.api_url + '/use_prescription');

    req.flush({message: 'error'}, expected_response);
  })


});
