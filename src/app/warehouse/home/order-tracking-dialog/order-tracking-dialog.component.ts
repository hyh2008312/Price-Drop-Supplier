import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-warehouse-home-order-tracking-dialog',
  templateUrl: './order-tracking-dialog.component.html',
  styleUrls: ['../_home.scss']
})

export class OrderTrackingDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<OrderTrackingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
