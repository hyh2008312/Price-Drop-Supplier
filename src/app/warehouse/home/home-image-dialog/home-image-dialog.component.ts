import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-warehouse-home-image-dialog',
  templateUrl: './home-image-dialog.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeImageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HomeImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

}
