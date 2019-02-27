import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-warehouse-order-confirm-edit-address-dialog',
  templateUrl: './confirm-edit-address-dialog.component.html',
  styleUrls: ['../_order.scss']
})

export class ConfirmEditAddressDialogComponent implements OnInit {

  orderStockForm : FormGroup;

  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmEditAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {

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

}
