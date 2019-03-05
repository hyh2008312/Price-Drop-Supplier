 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-warehouse-order-add-order-dialog',
  templateUrl: './add-order-dialog.component.html',
  styleUrls: ['../_order.scss']
})

export class AddOrderDialogComponent implements OnInit {

  trackingForm : FormGroup;

  channelList: any;
  error: any = false;

  get orderData() { return this.trackingForm.get('orderData') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<AddOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {

    this.getWarehouseList();

    this.trackingForm = this.fb.group({
      thirdOrderNumber: ['', Validators.required],
      orderData: this.fb.array([]),
      thirdPartyId: ['', Validators.required]
    });

    this.addOrderList();
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  createOrder() {
    if(this.trackingForm.invalid) {
      return;
    }

    let self = this;
    this.orderService.createOrders(this.trackingForm.value).then((data) => {

      if(data && data.detail) {
        self.error = data.detail;
      } else {
        self.close();
        self.data.isEdit = true;
        self.error = false;
      }
    });
  }

  addOrderList() {
    this.orderData.push(this.fb.group({
      sku: ['', Validators.required],
      quantity: ['', Validators.required],
      amount: ['', Validators.required]
    }));
  }

  deleteOrderObject(i) {
    this.orderData.removeAt(i);
  }

  getWarehouseList() {
    this.orderService.getChannelList().then((data) => {
      this.channelList = [...data];
      this.trackingForm.patchValue({
        thirdPartyId: this.channelList[0].id
      })
    });
  }

}
