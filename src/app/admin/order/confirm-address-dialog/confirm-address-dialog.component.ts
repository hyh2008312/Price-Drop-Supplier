 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-admin-order-confirm-address-dialog',
  templateUrl: './confirm-address-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class ConfirmAddressDialogComponent implements OnInit {

  orderStockForm : FormGroup;

  state: any;

  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {

    this.getAddress();
    this.orderStockForm = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      postcode: ['', Validators.required],
      line1: ['', Validators.required],
      line2: ['', Validators.required],
      line3: [''],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });

    this.orderStockForm.patchValue({
      id: this.data.order.id,
      username: this.data.order.username,
      phoneNumber: this.data.order.phoneNumber,
      postcode: this.data.order.postcode,
      line1: this.data.order.line1,
      line2: this.data.order.line2,
      line3: this.data.order.line3,
      city: this.data.order.city,
      state: this.data.order.state
    });

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  changeOrderAddress() {
    if(this.orderStockForm.invalid) {
      return;
    }

    let self = this;
    this.orderService.editAddress(this.orderStockForm.value).then((data) => {
      if(data && data.id) {
        self.error = false;
        self.data.isOrderAddressEdit = true;
        self.data.order = data;
        self.close();
      } else {
        this.error =  data.detail;
      }
    }).catch((data) => {
      this.error = data;
    });
  }

  getAddress() {
    this.orderService.getIndiaStateList().then((res) => {
      this.state = [...res];
    });
  }

}
