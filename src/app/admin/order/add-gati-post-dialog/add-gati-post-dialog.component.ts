 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-add-gati-post-dialog',
  templateUrl: './add-gati-post-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class AddGatiPostDialogComponent implements OnInit {

  trackingForm : FormGroup;
  depotCode = [{
    name: 'Shanghai',
    code: 'SHA'
  }, {
    name: 'Shenzhen',
    code: 'SZX'
  }];

  YesOrNo = [{
    text: "Yes",
    value: true
  }, {
    text: 'No',
    value: false
  }];

  get trackingOrder() { return this.trackingForm.get('trackingOrder') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<AddGatiPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.trackingForm = this.fb.group({
      depotCode: ['', Validators.required],
      trackingOrder: this.fb.array([]),
      notes: [''],
      isBattery: [false, Validators.required],
      domesticTrackingNumber: ['']
    });

    this.addOrderList();
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  changeTracking() {
    if(this.trackingForm.invalid) {
      return;
    }

    let tracking = {
      depotCode : this.trackingForm.value.depotCode,
      declaredValue: this.trackingForm.value.declaredValue,
      notes: this.trackingForm.value.notes
    };

    let self = this;
    this.orderService.changeGATITrackingInformation(tracking).then((data) => {
      self.close();
      if(data.id) {
        self.data.isShippingNumberEdit = true;
        self.data.order = data;
      }
    });
  }

  addOrderList() {
    this.trackingOrder.push(this.fb.group({
      orderNumber: ['', Validators.required],
      declaredValue: ['', Validators.required]
    }));
  }

  deleteOrderTrackingObject(i) {
    this.trackingOrder.removeAt(i);
  }


}
