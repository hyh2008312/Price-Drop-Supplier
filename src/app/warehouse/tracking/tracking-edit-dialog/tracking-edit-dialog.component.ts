import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

import { TrackingService } from '../tracking.service';
import {ToolTipsComponent} from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-home-edit-dialog',
  templateUrl: './tracking-edit-dialog.component.html',
  styleUrls: ['../_tracking.scss']
})

export class TrackingEditDialogComponent implements OnInit {

  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<TrackingEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private homeService: TrackingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

  publish() {
    this.homeService.pickEdit({}).then((data) => {
      if(data && data.id) {
        this.error = false;
        this.data.isEdit = true;
        this.data.item = data;
        this.close();
      } else {
        this.error = data.detail;
      }
    }).catch((error) => {
      this.error = error;
    });
  }

  delete(i) {
    this.data.item.pickVariants[i].splice(i, 1);
  }

  copy($event) {
    this.openCopyBar();
  }

  openCopyBar() {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: 'Successfully Copied!',
      duration: 1500,
      verticalPosition: 'top'
    });
  }

}
