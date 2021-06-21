import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthenticatorService} from "../service/authenticator.service";
import {ReactiveFormsModule} from "@angular/forms";
import {of, throwError} from "rxjs";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthenticatorService = jasmine.createSpyObj(['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        {provide: AuthenticatorService, useValue: mockAuthenticatorService},
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
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display "rpps needed" by default', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#rppsNeeded')).toBeFalsy();
  })

  it('should display "rpps needed" when touched', () => {
    component.loginForm.get('rpps')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#rppsNeeded")).toBeTruthy();
  })

  it('should not display "password needed by default"', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#passwordNeeded')).toBeFalsy();
  })

  it('should display "password needed" when touched', () => {
    component.loginForm.get('password')?.markAsTouched();
    fixture.detectChanges();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#passwordNeeded")).toBeTruthy();
  })

  it('should not display "password or rpps error by default"', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('#badRppsOrPassword')).toBeFalsy();
  })

  it('should display "incorrect id" when getting 401', async () => {
    // Make the component believe it got 401
    mockAuthenticatorService.login.and.returnValue(throwError({status: 401}));
    await component.login();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#badRppsOrPassword")).toBeTruthy();
  })

  it('should display "incorrect id" when getting 401', async () => {
    // Make the component believe it got 401
    mockAuthenticatorService.login.and.returnValue(throwError({status: 400}));
    await component.login();
    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector("#badRppsOrPassword")).toBeTruthy();
  })

  it('should redirect when getting 200', () => {
    mockAuthenticatorService.login.and.returnValue(of({status: 200}));
    spyOn(component.router, 'navigate');
    component.login();

    expect(component.router.navigate).toHaveBeenCalledWith(['/form_ordonnance']);
  })


});
