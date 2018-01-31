import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-deny-request-dialog',
  templateUrl: './deny-request-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class DenyRequestDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DenyRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  denyReturnRequest() {
    let order = {
      id: this.data.order.id
    };
    let self = this;
    self.orderService.denyReturnOrderRequest(order).then((data) => {
      self.close();
      self.data.isRequestDeny = true;
      self.data.order = data;
    });
  }
}
