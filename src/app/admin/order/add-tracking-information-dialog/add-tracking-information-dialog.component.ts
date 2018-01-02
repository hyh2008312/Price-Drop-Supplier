import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-add-tracking-information-dialog',
  templateUrl: './add-tracking-information-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class AddTrackingInformationDialogComponent implements OnInit {

  trackingForm : FormGroup;
  shippingCarrier = ['DHL','EMS'];

  constructor(
    public dialogRef: MatDialogRef<AddTrackingInformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.trackingForm = this.fb.group({
      carrier: ['', Validators.required],
      trackingName: ['', Validators.required],
      trackingURL: ['', Validators.required]
    });
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
