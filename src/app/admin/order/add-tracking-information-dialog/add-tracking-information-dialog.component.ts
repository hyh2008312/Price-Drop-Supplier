import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-add-tracking-information-dialog',
  templateUrl: './add-tracking-information-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class AddTrackingInformationDialogComponent implements OnInit {

  trackingForm : FormGroup;
  shippingCarrier = ['DHL','EMS'];

  isShippingNumberEdit: boolean = false;

  order: any;

  constructor(
    public dialogRef: MatDialogRef<AddTrackingInformationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {
    this.trackingForm = this.fb.group({
      trackingName: ['', Validators.required],
      trackingURL: ['']
    });
    this.order = data.order;
    this.trackingForm.patchValue({
      trackingName: this.order.shippingNumber,
      trackingURL: this.order.shippingPrice.shippingUrl
    });
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  changeTracking() {
    if(this.trackingForm.invalid) {
      return;
    }

    let tracking = {
      id: this.order.id,
      shippingNumber : this.trackingForm.value.trackingName
    };

    let self = this;
    this.orderService.changeTrackingInformation(tracking).then((data) => {
      self.close();
      self.data.isShippingNumberEdit = true;
      self.data.order = data;
    });
  }

}
