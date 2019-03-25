import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-reinitiate-order-dialog',
  templateUrl: './reinitiate-order-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class ReinitiateOrderDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<ReinitiateOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  reinitiate() {
    let order = {
      id: this.data.order.id,
      status: 'Packing'
    };

    let self = this;
    this.orderService.reinitiateOrder(order).then((data) => {
      self.close();
      self.data.isOrderReinitiate = true;
    });
  }

}
