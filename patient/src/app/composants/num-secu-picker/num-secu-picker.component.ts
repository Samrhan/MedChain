import { Component, OnInit, TemplateRef } from '@angular/core';

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-num-secu-picker',
  templateUrl: './num-secu-picker.component.html',
  styleUrls: ['./num-secu-picker.component.css']
})
export class NumSecuPickerComponent implements OnInit {

  faQuestionCircle = faQuestionCircle

  modalRef: BsModalRef | undefined;

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
