import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-order-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class CancelOrderDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
