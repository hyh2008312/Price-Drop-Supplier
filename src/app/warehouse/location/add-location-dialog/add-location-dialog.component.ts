import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { LocationService } from '../location.service';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-warehouse-location-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['../_location.scss']
})

export class AddLocationDialogComponent implements OnInit {

  locationForm: FormGroup;

  error: any;

  constructor(
    public dialogRef: MatDialogRef<AddLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: LocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

    this.locationForm = this.fb.group({
      warehouseId: ['', Validators.required],
      rackName: ['', Validators.required],
      newLane: [''],
      laneId: [''],
      shelfQuantity: [''],
      binQuantity: ['']
    });

    this.locationForm.patchValue({
      warehouseId: this.data.warehouseId
    });
  }

  ngOnInit() {}

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
    this.inventoryService.addLane(this.locationForm.value).then(() => {
      this.data.isEdit = true;
      this.openToast('Successfully Saved!');
      this.close();
    }).catch((res) => {
      this.openToast(res);
    });
  }

  addLane() {
    this.inventoryService.addLane({
      laneName: this.locationForm.value.newLane,
      warehouseId: this.data.warehouseId
    }).then((res) => {
      this.error = false;
      this.data.laneList = [...res];
      this.data.laneList.unshift({
        id: false,
        allPath: 'PACKAGING.CODLIST.TITLE1'
      });
      this.data.isLaneEdit = true;
    }).catch((res) => {
      this.openToast(res);
    });
  }
}
