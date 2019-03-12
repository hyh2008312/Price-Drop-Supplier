import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-warehouse-add-inventory-dialog',
  templateUrl: './add-inventory-dialog.component.html',
  styleUrls: ['../_inventory.scss']
})

export class AddInventoryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

}
