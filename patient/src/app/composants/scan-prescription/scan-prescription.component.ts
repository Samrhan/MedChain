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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.code_found = false;
    this.scannerInit();
  }

  scannerInit() {
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
    this.code_found = true;
  }

  addPrescription(){
    this.prescriptionManager.addPrescription(this.token, this.password);
    this.router.navigate(['/']).then(() => window.location.reload());
  }

  onDeviceSelectChange(selected: string) {
    for (const device of this.availableDevices) {
      if (device.deviceId === selected) {
        this.currentDevice = device;
      }
    }
  }

  goBack() {
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
