import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { LocationService } from '../location.service';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-warehouse-location-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['../_location.scss']
})

export class AddInventoryDialogComponent implements OnInit {


  warehouseList: any;
  warehouseId: any = 2;
  locationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: LocationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getWarehouseList();
  }

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

  openToast(str) {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: str,
      duration: 1500,
      verticalPosition: 'top'
    });
  }

  productChange(event) {}

  addProduct() {
    if(this.locationForm.invalid) {
      return;
    }
    this.inventoryService.addInventory(this.locationForm.value).then(() => {
      this.data.isEdit = true;
      this.openToast('Successfully Saved!');
      this.close();
    }).catch((res) => {
      this.openToast(res);
    });
  }

  getWarehouseList() {
    this.inventoryService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
    });
  }
}
