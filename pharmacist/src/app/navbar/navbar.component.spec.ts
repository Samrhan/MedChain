import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {AuthenticatorService} from "../Services/Authenticator/authenticator.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  let mockAuthenticatorService = jasmine.createSpyObj(['disconnect']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticatorService, useValue: mockAuthenticatorService}
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ NavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockAuthenticatorService.disconnect.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('disconnect() should call AuthenticatorService methode', () => {
    component.disconnect();

    expect(mockAuthenticatorService.disconnect).toHaveBeenCalled()
  })

  it('goBack() should call router with the provided route', () => {
    spyOn(component.router, 'navigate');

    const route = "/foo"
    component.go_back_route = route;
    component.goBack();

    expect(component.router.navigate).toHaveBeenCalledWith([route]);
  })

  it('should not display the go back button if told not to', (done: DoneFn) => {
    component.display_goBack_button = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#goBackButton')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('#fillerButton')).toBeTruthy();
      done();
    })
  })

  it('should display the go back button if told to', (done: DoneFn) => {
    component.display_goBack_button = true;
    component.go_back_route = "/foo"
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.querySelector('#goBackButton')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('#fillerButton')).toBeFalsy();
      done();
    })
  })


});
