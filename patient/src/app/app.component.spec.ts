import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {Platform} from "@angular/cdk/platform";
import createSpyObj = jasmine.createSpyObj;

describe('AppComponent', () => {
  let fixture;
  let app;

  let mockPlatform = createSpyObj([], ['IOS'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers : [
        {provide: Platform, useValue: mockPlatform},
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should display the install guide if platform is IOS and PWA is not installed', () => {
    app.showInstallGuide = false;
    spyPropertyGetter(mockPlatform, 'IOS').and.returnValue(true);
    let navigator = {standalone: false}

    app.shouldDisplayInstallGuide(navigator);
    expect(app.showInstallGuide).toBeTruthy()
  })

  it('should not display the install guide if platform is IOS and PWA is already installed', () => {
    app.showInstallGuide = true;
    spyPropertyGetter(mockPlatform, 'IOS').and.returnValue(true);
    let navigator = {standalone: true}

    app.shouldDisplayInstallGuide(navigator);
    expect(app.showInstallGuide).toBeFalsy()
  })

  it('onbeforeinstallprompt() should store the prompt and call preventDefault', () => {
    let expected = {foo: 'bar', preventDefault: () => {}}
    spyOn(expected, 'preventDefault');

    app.onbeforeinstallprompt(expected);
    expect(app.deferredPrompt).toEqual(expected);
    expect(expected.preventDefault).toHaveBeenCalled();
    expect(app.showInstallGuide).toBeTruthy();
  })

  it('addToHomeScreen() should prompt the event and act on the user\'s choice (case user accepts)', fakeAsync(() => {
    app.showInstallGuide = true;
    let expected = {
      foo: 'bar',
      prompt: () => {},
      userChoice: new Promise((resolve) => {resolve({ outcome: 'accepted' })})
    }
    spyOn(expected, 'prompt');

    app.deferredPrompt = expected;
    app.addToHomeScreen();
    tick(50);

    expect(expected.prompt).toHaveBeenCalled()
    expect(app.deferredPrompt).toBeNull()
    expect(app.showInstallGuide).toBeFalsy()
  }))

  it('addToHomeScreen() should prompt the event and act on the user\'s choice (case user refuses)', fakeAsync(() => {
    app.showInstallGuide = true;
    let expected = {
      foo: 'bar',
      prompt: () => {},
      userChoice: new Promise((resolve) => {resolve({ outcome: 'refused' })})
    }
    spyOn(expected, 'prompt');

    app.deferredPrompt = expected;
    app.addToHomeScreen();
    tick(50);

    expect(expected.prompt).toHaveBeenCalled()
    expect(app.deferredPrompt).toBeNull()
    expect(app.showInstallGuide).toBeTruthy()
  }))
});

function spyPropertyGetter<T, K extends keyof T>(
  spyObj: jasmine.SpyObj<T>,
  propName: K
): jasmine.Spy<() => T[K]> {
  return Object.getOwnPropertyDescriptor(spyObj, propName)?.get as jasmine.Spy<() => T[K]>;
}
