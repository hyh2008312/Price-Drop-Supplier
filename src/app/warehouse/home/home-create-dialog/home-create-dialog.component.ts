import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

import { HomeService } from '../home.service';
import { OrderDetailDialogComponent } from '../order-detail-dialog/order-detail-dialog.component';

@Component({
  selector: 'app-warehouse-home-create-dialog',
  templateUrl: './home-create-dialog.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeCreateDialogComponent implements OnInit {

  purchaseForm : FormGroup;

  get attributes() { return this.purchaseForm.get('attributes') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private homeService: HomeService
  ) {

    this.purchaseForm = this.fb.group({
      purchaseId: ['', Validators.required],
      attributes: this.fb.array([])
    });

  }

  ngOnInit() {}

  ngOnDestroy() {}

  publish() {}

  delete(i) {
    this.attributes.removeAt(i);
  }

}
