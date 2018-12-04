import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {HomeService} from '../home.service';

@Component({
  selector: 'app-warehouse-home-order-tracking-dialog',
  templateUrl: './order-tracking-dialog.component.html',
  styleUrls: ['../_home.scss']
})

export class OrderTrackingDialogComponent implements OnInit {

  trackingSteps: any = false;
  logisticsId: any = '';

  constructor(
    public dialogRef: MatDialogRef<OrderTrackingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private homeService: HomeService
  ) {
    this.getTrackingPackage(this.data.item.purchaseId);
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  getTrackingPackage(purchaseId) {
    if(!purchaseId) return;
    this.homeService.getTrackingPackage({
      purchase_id: purchaseId
    }).then((data) => {
      if(data.success) {
        this.logisticsId = data.logisticsTrace[0].logisticsId;
        this.trackingSteps = data.logisticsTrace[0].logisticsSteps;
      }
    });
  }

}
