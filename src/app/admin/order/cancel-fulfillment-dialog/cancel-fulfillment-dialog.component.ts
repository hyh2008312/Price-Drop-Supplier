import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-order-cancel-fulfillment-dialog',
  templateUrl: './cancel-fulfillment-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class CancelFulfillmentDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<CancelFulfillmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
