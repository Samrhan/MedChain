import {Component, HostListener} from '@angular/core';
import {Platform} from "@angular/cdk/platform";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  deferredPrompt: any;
  showInstallGuide = false;

  constructor(
    public platform: Platform,
  ) {
    this.shouldDisplayInstallGuide(window.navigator);
  }

  shouldDisplayInstallGuide(navigator: Navigator){
    if(this.platform.IOS && 'standalone' in navigator){
      this.showInstallGuide = true;
    }
    // @ts-ignore
    if(this.platform.IOS && navigator.standalone === true){
      this.showInstallGuide = false;
    }
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: { preventDefault: () => void; }) {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showInstallGuide = true;
  }


  addToHomeScreen() {
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult: { outcome: string; }) => {
        if (choiceResult.outcome === 'accepted') {
          // hide our user interface that shows our A2HS button
          this.showInstallGuide = false;
        }
        this.deferredPrompt = null;
      });
  }
}
