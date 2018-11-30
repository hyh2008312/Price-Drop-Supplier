import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HomeService } from '../home.service';

@Component({
  selector: 'app-warehouse-home-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['../_home.scss']
})

export class OrderDetailDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private homeService: HomeService
  ) {
  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  delete() {}

}
