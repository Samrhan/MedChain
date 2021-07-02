import { TestBed } from '@angular/core/testing';

import { PrescriptionsManagerService } from './prescriptions-manager.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {environment} from "../../../../../pharmacist/src/environments/environment";
import {HttpClient, HttpResponse} from "@angular/common/http";

describe('PrescriptionsManagerService', () => {
  let service: PrescriptionsManagerService;

  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    });
    service = TestBed.inject(PrescriptionsManagerService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isStorageEmpty() should return false when storage is fully empty', () => {
    expect(service.isStorageEmpty()).toBeTruthy();
  })

  it('isStorageEmpty() should return false when storage is an empty string', () => {
    localStorage.setItem(service.data, '');
    expect(service.isStorageEmpty()).toBeTruthy();
  })

  it('isStorageEmpty() should return false when storage is an empty list', () => {
    localStorage.setItem(service.data, '[]');
    expect(service.isStorageEmpty()).toBeTruthy();
  })

  it('isStorageEmpty() should return true when storage is a non-empty list', () => {
    localStorage.setItem(service.data, '["foo", "bar"]');
    expect(service.isStorageEmpty()).toBeFalsy();
  })

  it('isSocialEmpty() should return false when storage is fully empty', () => {
    expect(service.isSocialEmpty()).toBeTruthy();
  })

  it('isSocialEmpty() should return false when storage is an empty string', () => {
    localStorage.setItem(service.social, '');
    expect(service.isSocialEmpty()).toBeTruthy();
  })

  it('isSocialEmpty() should return true when storage is a non-empty string', () => {
    localStorage.setItem(service.social, 'foo');
    expect(service.isSocialEmpty()).toBeFalsy();
  })

  it('getAllPrescriptions() should return an empty list when storage is empty', () => {
    expect(service.getAllPrescriptions()).toEqual([])
  })

  it('getAllPrescriptions() should return an empty list when storage is an empty string', () => {
    localStorage.setItem(service.data, '');
    expect(service.getAllPrescriptions()).toEqual([])
  })

  it('getAllPrescriptions() should return the correct value when storage is non-empty', () => {
    localStorage.setItem(service.data, JSON.stringify(["foo", "bar"]));
    expect(service.getAllPrescriptions()).toEqual(["foo", "bar"])
  })

  it('getSocial() should return an empty string when storage is empty', () => {
    expect(service.getSocial()).toEqual("")
  })

  it('getSocial() should return an empty string when storage is an empty string', () => {
    localStorage.setItem(service.social, '');
    expect(service.getSocial()).toEqual("")
  })

  it('getSocial() should return the correct value when storage is non-empty', () => {
    localStorage.setItem(service.social, 'foo');
    expect(service.getSocial()).toEqual("foo")
  })

  it('setSocial() should overwrite the value in localStorage', () => {
    service.setSocial("foo");
    expect(localStorage.getItem(service.social)).toEqual("foo"); // empty to full
    service.setSocial("bar");
    expect(localStorage.getItem(service.social)).toEqual("bar"); // overwrite full
  })

  it('clearAll() should remove everything in localStorage', () => {
    localStorage.setItem(service.social, "foobar");
    localStorage.setItem(service.data, JSON.stringify(["foo", "bar"]));

    service.clearAll();

    expect(localStorage.getItem(service.social)).toBeNull()
    expect(localStorage.getItem(service.data)).toBeNull()
  })

  it('addPrescription() should add the provided data to localStorage', () => {
    let expected = [{
      token: "token",
      password: "password"
    }]
    service.addPrescription(expected[0].token, expected[0].password);

    expect(JSON.parse(localStorage.getItem(service.data))).toEqual(expected)
  })

  it('addPrescription() should not duplicate data', () => {
    let expected = [{
      token: "token",
      password: "password"
    },{
      token: "token2",
      password: "password2"
    }]
    service.addPrescription(expected[0].token, expected[0].password);
    service.addPrescription(expected[0].token, expected[0].password);
    service.addPrescription(expected[0].token, expected[0].password);
    service.addPrescription(expected[1].token, expected[1].password);

    expect(JSON.parse(localStorage.getItem(service.data))).toEqual(expected)
  })

  it('removePrescription() should remove the provided item if it exists', () => {
    let expected = [{
      token: "token",
      password: "password"
    },{
      token: "token2",
      password: "password2"
    }]
    localStorage.setItem(service.data, JSON.stringify(expected));

    const to_remove = expected[1].token;
    expected = [expected[0]]; // On retire le deuxième item

    service.removePrescription(to_remove);
    expect(JSON.parse(localStorage.getItem(service.data))).toEqual(expected)
  })

  it('removePrescription() should do nothing if the item does not exist', () => {
    let expected = [{
      token: "token",
      password: "password"
    },{
      token: "token2",
      password: "password2"
    }]
    localStorage.setItem(service.data, JSON.stringify(expected));

    const to_remove = "foobar";

    service.removePrescription(to_remove);
    expect(JSON.parse(localStorage.getItem(service.data))).toEqual(expected)
  })

  it('removePrescription() should do nothing on empty storage', () => {
    const to_remove = "foobar";
    service.removePrescription(to_remove);
    expect(localStorage.getItem(service.data)).toBeNull()
  })

  it('getTokenState() should have a proper body', () => {
    const token = "test";
    const password = "pass";
    const secu = "1234";
    const expected_body = {
      secu: secu,
      password: password,
      token: token
    }
    const expected_response = {status: 200, body: {content: 'lorem ipsum dolor sit amet'}}
    localStorage.setItem(service.social, secu)

    service.getTokenState(token, password).subscribe(
      data => expect(data).toEqual(expected_response.body),
      fail
    )

    const req = httpMock.expectOne(environment.api_url + '/token_state');
    expect(req.request.method).toEqual("POST");
    expect(req.request.body).toEqual(expected_body);

    req.event(new HttpResponse(expected_response));
  })

  it('getTokenState() should pass HTTP error back in case one occurs', () => {
    const token = "test";
    const password = "pass";
    const secu = "1234";
    const expected_response = new HttpResponse({status: 400, statusText: 'bad request'})
    localStorage.setItem(service.social, secu)

    service.getTokenState(token, password).subscribe(
      fail,
      () => {
        expect(true).toBeTrue()
      }
    )

    const req = httpMock.expectOne(environment.api_url + '/token_state');

    req.flush({message: 'error'}, expected_response);
  })
});
