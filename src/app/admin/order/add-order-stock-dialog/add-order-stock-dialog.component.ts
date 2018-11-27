 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-add-order-stock-dialog',
  templateUrl: './add-order-stock-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class AddOrderStockDialogComponent implements OnInit {

  orderStockForm : FormGroup;
  sourcingSupplierList: any;

  constructor(
    public dialogRef: MatDialogRef<AddOrderStockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.orderStockForm = this.fb.group({
      sourcingSupplier: [''],
      sourcingOrderNumber: ['']
    });

    this.orderStockForm.patchValue({
      sourcingOrderNumber: this.data.order.sourcingOrderNumber
    });

    this.getSourcingSupplierList();

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  getSourcingSupplierList() {
    this.orderService.getSourcingSupplierList().then((data) => {
      this.sourcingSupplierList = [...data];
      this.orderStockForm.patchValue({
        sourcingSupplier: this.sourcingSupplierList[0].sourcingName
      });
    });
  }

  changeOrderStock() {
    if(this.orderStockForm.invalid) {
      return;
    }

    let self = this;
    this.orderService.changeOrderStockInformation(this.orderStockForm.value).then((data) => {
      self.close();
      if(data.id) {
        self.data.isOrderStockEdit = true;
        self.data.order = data;
      }
    });
  }


}
