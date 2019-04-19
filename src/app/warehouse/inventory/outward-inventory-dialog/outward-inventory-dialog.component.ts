import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-warehouse-outward-inventory-dialog',
  templateUrl: './outward-inventory-dialog.component.html',
  styleUrls: ['../_inventory.scss']
})

export class OutwardInventoryDialogComponent implements OnInit {

  purchaseForm : FormGroup;
  error: any = false;

  get content() { return this.purchaseForm.get('content') as FormArray; }

  constructor(
    public dialogRef: MatDialogRef<OutwardInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private inventoryService: InventoryService
  ) {

    this.purchaseForm = this.fb.group({
      id: ['', Validators.required],
      content: this.fb.array([])
    });

    this.purchaseForm.patchValue({
      id: this.data.id
    });


    this.getInventoryWithBin();

  }

  ngOnInit() {}

  ngOnDestroy() {}

  close() {
    this.dialogRef.close();
  }

  publish() {
    if(this.purchaseForm.invalid) {
      return;
    }
    this.inventoryService.outwardInventory(this.purchaseForm.value).then((data) => {
      if(data.id) {
        this.error = false;
        this.data = data;
        this.data.isEdit = true;
        this.close();
      } else {
        this.error = data.detail;
      }
    }).catch((error) => {
      this.error = error;
    });
  }

  getInventoryWithBin() {
    this.inventoryService.getInventoryWithBin({
      id: this.data.id
    }).then((res) => {
      for(let item of res) {
        this.content.push(this.fb.group({
          id: [item.id],
          binNumber: [item.binNumber],
          rackNumber: [item.rackNumber],
          quantity: [0, [Validators.required, Validators.max(item.skuQuantity)]],
          skuQuantity: [item.skuQuantity]
        }));
      }
    });
  }

}
