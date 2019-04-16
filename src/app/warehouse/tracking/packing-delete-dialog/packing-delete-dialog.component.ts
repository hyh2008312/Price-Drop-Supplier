import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-warehouse-packing-delete-dialog',
  templateUrl: './packing-delete-dialog.component.html',
  styleUrls: ['../_tracking.scss']
})

export class PackingDeleteDialogComponent implements OnInit {

  purchaseForm : FormGroup;
  error: any = false;

  warehouseList: any;

  get skus() { return this.purchaseForm.get('skus') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<PackingDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private trackingService: TrackingService
  ) {

    this.purchaseForm = this.fb.group({
      id: ['', Validators.required],
      skus: this.fb.array([])
    });

    this.purchaseForm.patchValue({
      id: this.data.item.id
    });

    for(let item of this.data.item.pickVariants) {
      this.skus.push(this.fb.group({
        id: [item.id],
        mainImage: [item.mainImage],
        title: [item.title],
        attribute: [item.attribute],
        sku: [item.sku],
        quantity: [item.quantity],
        unitQuantity: [item.quantity]
      }));
    }

  }

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

  publish() {
    if(this.purchaseForm.invalid) {
      return;
    }
    this.trackingService.packingDelete(this.purchaseForm.value).then((data) => {
      if(data.id) {
        this.error = false;
        this.data.isEdit = true;
        this.data.item = data;
        this.close();
      } else {
        this.error = data.detail;
      }
    }).catch((error) => {
      this.error = error;
    });
  }

}
