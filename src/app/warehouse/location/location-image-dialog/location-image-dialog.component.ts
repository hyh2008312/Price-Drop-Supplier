import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-warehouse-location-image-dialog',
  templateUrl: './location-image-dialog.component.html',
  styleUrls: ['../_location.scss']
})

export class LocationImageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LocationImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

}
