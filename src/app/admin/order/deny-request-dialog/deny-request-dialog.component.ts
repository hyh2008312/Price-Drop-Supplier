import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-order-deny-request-dialog',
  templateUrl: './deny-request-dialog.component.html',
  styleUrls: ['../order.scss']
})

export class DenyRequestDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<DenyRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

}
