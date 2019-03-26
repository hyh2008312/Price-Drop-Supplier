 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-change-order-variant-dialog',
  templateUrl: './change-order-variant-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class ChangeOrderVariantDialogComponent implements OnInit {

  orderVariantForm : FormGroup;
  variantsList: any;
  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<ChangeOrderVariantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.orderVariantForm = this.fb.group({
      id: [''],
      variantId: ['']
    });

    this.orderVariantForm.patchValue({
      id: this.data.order.id,
      variantId: this.data.order.lines[0].variantId
    });

    this.getVariantList();

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  getVariantList() {
    this.orderService.getProductVariantList({
      pid: this.data.order.lines[0].productId
    }).then((data) => {
      this.variantsList = data.variants;

    });
  }

  changeVariant() {
    if(this.orderVariantForm.invalid) {
      return;
    }

    this.orderService.changeVariant(this.orderVariantForm.value).then((data) => {
      this.data.order = data;
      this.data.isVariantEdit = true;
      this.close();
    });
  }

}
