import {Component, Input, OnInit} from '@angular/core';

import * as bwipjs from 'bwip-js';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnInit {

  @Input() code: string = '';
  @Input() password: string = '';

  @Input() scale: number = 3

  constructor() { }

  ngOnInit(): void {
    let canvas = bwipjs.toCanvas('barcode-canvas', {
      bcid:        'datamatrix',       // Barcode type
      text:        this.code + "\n" + this.password,    // Text to encode
      scale:       this.scale,                          // Scaling factor
      textxalign:  'center',                            // Always good to set this
    });
  }
}
