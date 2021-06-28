import { Component, HostListener } from '@angular/core';
import {Platform} from "@angular/cdk/platform";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  deferredPrompt: any;
  showInstallGuide = false;

  window = window;

  constructor(
    public platform: Platform
  ) {
    if(platform.IOS && 'standalone' in window.navigator){
      this.showInstallGuide = true;
    }
    // @ts-ignore
    if(platform.IOS && window.navigator.standalone === true){
      this.showInstallGuide = false;
    }
  }


  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: { preventDefault: () => void; }) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showInstallGuide = true;
  }


  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showInstallGuide = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult: { outcome: string; }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }
}
