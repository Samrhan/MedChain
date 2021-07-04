import {Component, OnInit, ViewChild} from '@angular/core';

import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

import {BarcodeFormat} from '@zxing/library';
import {ZXingScannerComponent} from "@zxing/ngx-scanner";
import {PrescriptionsManagerService} from "../../services/prescriptionManager/prescriptions-manager.service";
import {Router} from "@angular/router";

import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-scan-prescription',
  templateUrl: './scan-prescription.component.html',
  styleUrls: ['./scan-prescription.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateY(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class ScanPrescriptionComponent implements OnInit {

  faArrowLeft = faArrowLeft;

  allowedFormats = [ BarcodeFormat.DATA_MATRIX ];

  @ViewChild('scanner', { static: true }) scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasPermission: boolean;
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;

  token: string;
  password: string;
  code_found: boolean

  constructor(
    private prescriptionManager: PrescriptionsManagerService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.code_found = false;
    this.scannerInit();
  }

  // Pas besoin de tester cette fonction car il s'agit de code de la documentation
  scannerInit /* istanbul ignore next */ () {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasDevices = true;
      this.availableDevices = devices;
      this.currentDevice = null;

      this.onDeviceSelectChange(devices[devices.length - 1].deviceId);
    });

    this.scanner.camerasNotFound.subscribe(() => this.hasDevices = false);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
  }

  handleQrCodeResult(resultString: string) {
    [this.token, this.password] = resultString.split('/');
    if (this.validUUID(this.token) && this.validUUID(this.password)) {
      this.code_found = true;
    }
  }

  // Impossible à tester car on ne peut pas mock window.location.reload(), donc la page de test subit un rechargement infini
  /* istanbul ignore next */
  addPrescription() /* istanbul ignore next */{
    this.prescriptionManager.addPrescription(this.token, this.password);
    this.router.navigate(['/']).then(() => window.location.reload());
  }

  // Pas besoin de tester cette fonction car il s'agit de code de la documentation
  /* istanbul ignore next */
  onDeviceSelectChange /* istanbul ignore next */ (selected: string) {
    for (const device of this.availableDevices) {
      if (device.deviceId === selected) {
        this.currentDevice = device;
      }
    }
  }

  // Impossible à tester car on ne peut pas mock window.location.reload(), donc la page de test subit un rechargement infini
  /* istanbul ignore next */
  goBack() /* istanbul ignore next */ {
    this.router.navigate(['/']).then(() => window.location.reload());
  }

  validUUID(text: string): boolean {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(text);
  }
}
