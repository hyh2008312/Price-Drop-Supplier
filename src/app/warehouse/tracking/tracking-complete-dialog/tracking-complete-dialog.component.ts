import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import { TrackingService } from '../tracking.service';

@Component({
  selector: 'app-warehouse-tracking-complete-dialog',
  templateUrl: './tracking-complete-dialog.component.html',
  styleUrls: ['../_tracking.scss']
})

export class TrackingCompleteDialogComponent implements OnInit {

  purchaseForm : FormGroup;
  error: any = false;
  status: any = [{
    value: 'Completed',
    text: '成功入库'
  }, {
    value: 'Quantity Issue',
    text: '数量问题'
  }, {
    value: 'Quality Issue',
    text: '货物问题'
  }];

  constructor(
    public dialogRef: MatDialogRef<TrackingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private homeService: TrackingService
  ) {

    this.purchaseForm = this.fb.group({
      id: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['']
    });

    this.purchaseForm.patchValue({
      id: this.data.item.id,
      status: this.data.item.deliveryStatus,
      notes: this.data.item.notes,
    })
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
    this.homeService.purchaseComplete(this.purchaseForm.value).then((data) => {
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
