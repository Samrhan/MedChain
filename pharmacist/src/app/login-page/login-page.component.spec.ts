import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";

import {of, throwError} from 'rxjs'


describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let mockAuthenticatorService = jasmine.createSpyObj(['authenticate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPageComponent ],
      providers: [
        { provide: AuthenticatorService, useValue: mockAuthenticatorService},
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Username
  it('should not display "username needed" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#usernameNeeded")).toBeFalsy();
  })

  it('should display "username needed" when touched', () => {
    component.loginForm.get('username')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#usernameNeeded")).toBeTruthy();
  })

  // Password
  it('should not display "password needed" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#passwordNeeded")).toBeFalsy();
  })

  it('should display "password needed" when touched', () => {
    component.loginForm.get('password')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#passwordNeeded")).toBeTruthy();
  })

  // Incorrect id
  it('should not display "incorrect id" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#wrongCredential")).toBeFalsy();
  })

  it('should display "incorrect id" when getting 401 or 400', () => {
    // Make the component believe it got 401
    mockAuthenticatorService.authenticate.and.returnValue(throwError({status: 401}));
    component.authenticate();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#wrongCredential")).toBeTruthy();
  })

  // Already connected
  it('should not display "already connected" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#alreadyConnected")).toBeFalsy();
  })

  it('should display "already connected" when getting 403', () => {
    // Make the component believe it got 403
    mockAuthenticatorService.authenticate.and.returnValue(throwError({status: 403}));
    component.authenticate();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#alreadyConnected")).toBeTruthy();
  })

  // Connection happens succesfully
  it('should redirect the user after successful connection', () => {
    mockAuthenticatorService.authenticate.and.returnValue(of({status: 200}));
    spyOn(component.router, 'navigate');
    component.authenticate();

    expect(component.router.navigate).toHaveBeenCalledWith(['/scan_ordonnance']);
  });
});
