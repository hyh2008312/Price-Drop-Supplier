import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-warehouse-inventory-image-dialog',
  templateUrl: './inventory-image-dialog.component.html',
  styleUrls: ['../_inventory.scss']
})

export class InventoryImageDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InventoryImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

}
