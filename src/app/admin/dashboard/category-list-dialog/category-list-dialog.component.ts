 import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-category-list-dialog',
  templateUrl: './category-list-dialog.component.html',
  styleUrls: ['../_dashboard.scss']
})

export class CategoryListDialogComponent implements OnInit {

  list: any;
  constructor(
    public dialogRef: MatDialogRef<CategoryListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardService: DashboardService
  ) {

  }

  ngOnInit():void {
    this.dashboardService.getCategoryMainProductDetailList().then((res) => {
      this.list = [...res];
    });
  }

  close():void {
    this.dialogRef.close();
  }



}
