import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ReactiveFormsModule} from "@angular/forms";

import {of, throwError} from 'rxjs';


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

  it('should display "incorrect id" when getting 401', () => {
    // Make the component believe it got 401
    mockAuthenticatorService.authenticate.and.returnValue(throwError({status: 401}));
    component.authenticate();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#wrongCredential")).toBeTruthy();
  })

  it('should display "incorrect id" when getting 400', () => {
    // Make the component believe it got 400
    mockAuthenticatorService.authenticate.and.returnValue(throwError({status: 400}));
    component.authenticate();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#wrongCredential")).toBeTruthy();
  })

  it('should display an alert when getting neither 400, 401, or 403', () => {
    // Make the component believe it got 400
    spyOn(window, "alert");
    mockAuthenticatorService.authenticate.and.returnValue(throwError({status: 0}));
    component.authenticate();
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalled();
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

  // Check if connect button is disabled by default
  it('should not have connect button enabled by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    const button: HTMLButtonElement | null = nativeElement.querySelector("#connectButton");
    expect(button?.disabled).toBeTruthy();
  })

  it('should have connect button enabled when form is complete', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    const button: HTMLButtonElement | null = nativeElement.querySelector("#connectButton");

    component.loginForm.get('username')?.setValue("test")
    fixture.detectChanges();
    expect(button?.disabled).toBeTruthy();

    component.loginForm.get('password')?.setValue("test")
    component.loginForm.get('username')?.setValue("")
    fixture.detectChanges();
    expect(button?.disabled).toBeTruthy();

    component.loginForm.get('password')?.setValue("test")
    component.loginForm.get('username')?.setValue("test")
    fixture.detectChanges();

    expect(button?.disabled).toBeFalsy();
  })

  // Misc
  it('invalid_input should return true if no control is present', () => {
    expect(component.invalid_input("test", "required")).toBeTruthy();
  });
});
