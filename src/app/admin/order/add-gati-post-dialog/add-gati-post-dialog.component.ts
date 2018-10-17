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
    value: 'battery'
  }, {
    text: 'No',
    value: 'general'
  }];

  currencyRate: any = 74;

  get goods() { return this.trackingForm.get('goods') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<AddGatiPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.trackingForm = this.fb.group({
      depotCode: ['', Validators.required],
      goods: this.fb.array([]),
      notes: [''],
      serviceCode: ['general', Validators.required],
      domesticExp: ['']
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

    let self = this;
    this.orderService.changeGATITrackingInformation(this.trackingForm.value).then((data) => {
      self.close();
      if(data.id) {
        self.data.isShippingNumberEdit = true;
        self.data.order = data;
      }
    });
  }

  addOrderList() {
    this.goods.push(this.fb.group({
      orderNumber: ['', Validators.required],
      declaredValue: ['', Validators.required]
    }));
  }

  deleteOrderTrackingObject(i) {
    this.goods.removeAt(i);
  }

  changeOrder($event, p) {
    this.orderService.getOrderNumberCost({
      order_number: $event
    }).then((data) => {
      if(data.id) {
        p.patchValue({
          declaredValue: (data.lines[0].costPrice / 2 / 74).toFixed(2)
        });
      }
    });
  }


}
