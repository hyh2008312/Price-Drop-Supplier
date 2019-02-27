import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-admin-order-confirm-edit-address-dialog',
  templateUrl: './confirm-edit-address-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class ConfirmEditAddressDialogComponent implements OnInit {

  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<ConfirmEditAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService
  ) {

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  changeOrderAddress() {
    let self = this;
    this.orderService.changeStatus(this.data.order).then((data) => {
      if(data && data.id) {
        self.error = false;
        self.data.isPurchaseStateEdit = true;
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
