import { Component, OnInit, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { LocationService } from '../location.service';
import { ToolTipsComponent } from '../tool-tips/tool-tips.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-warehouse-location-add-location-dialog',
  templateUrl: './add-location-dialog.component.html',
  styleUrls: ['../_location.scss']
})

export class AddLocationDialogComponent implements OnInit {


  lane: any;
  locationForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddLocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryService: LocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

    this.locationForm = this.fb.group({
      warehouseId: ['', Validators.required],
      name: ['', Validators.required],
      type: ['Rack'],
      newLane: [''],
      lane: [''],
      shelf: [''],
      bin: ['']
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
    this.inventoryService.addInventory(this.locationForm.value).then(() => {
      this.data.isEdit = true;
      this.openToast('Successfully Saved!');
      this.close();
    }).catch((res) => {
      this.openToast(res);
    });
  }

  getLane() {
    this.inventoryService.getLaneList({}).then(() => {

    });
  }

  addLane() {
    this.inventoryService.addLane({
      type: 'Lane',
      name: this.locationForm.value.newLane
    }).then(() => {

    });
  }
}
