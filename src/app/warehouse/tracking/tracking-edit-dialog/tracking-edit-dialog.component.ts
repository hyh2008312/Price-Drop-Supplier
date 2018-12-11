import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-warehouse-home-edit-dialog',
  templateUrl: './tracking-edit-dialog.component.html',
  styleUrls: ['../_tracking.scss']
})

export class TrackingEditDialogComponent implements OnInit {

  purchaseForm : FormGroup;
  error: any = false;

  get pickInfo() { return this.purchaseForm.get('pickInfo') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<TrackingEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private homeService: TrackingService
  ) {

    this.purchaseForm = this.fb.group({
      id: ['', Validators.required],
      internationalCarrier: ['GATI', Validators.required],
      pickNumber: ['', Validators.required],
      internationalTrackingNumber: ['', Validators.required],
      pickVariants: this.fb.array([])
    });

    this.purchaseForm.patchValue({
      id: this.data.item.id,
      pickNumber: this.data.item.pickNumber,
      internationalTrackingNumber: this.data.item.internationalTrackingNumber,
    });

    for(let item of this.data.item.pickVariants) {
      this.pickInfo.push(this.fb.group({
        sku: [item.sku, Validators.required],
        pickQuantity: [item.quantity, Validators.required]
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
    this.homeService.purchaseEdit(this.purchaseForm.value).then((data) => {
      if(data && data.id) {
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

  delete(i) {
    this.pickInfo.removeAt(i);
  }

  addPurchaseItem() {
    this.pickInfo.push(this.fb.group({
      sku: ['', Validators.required],
      pickQuantity: ['', Validators.required]
    }));
  }

}
