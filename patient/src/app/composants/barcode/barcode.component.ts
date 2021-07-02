import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

import * as bwipjs from 'bwip-js';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements AfterViewInit {

  @Input() code: string = '';
  @Input() password: string = '';

  @Input() scale: number = 3

  @ViewChild('barcode') canvas !: ElementRef

  constructor() { }

  ngAfterViewInit(): void {
    this.drawBarcode()
  }

  drawBarcode(): void {
    let canvas: HTMLCanvasElement = this.canvas.nativeElement;
    bwipjs.toCanvas(canvas, {
      bcid: 'datamatrix',       // Barcode type
      text: this.code + "/" + this.password,     // Text to encode
      scale: this.scale,                          // Scaling factor
      textxalign: 'center',                       // Always good to set this
    });
  }
}
