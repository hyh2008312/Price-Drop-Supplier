import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { SpecificationService } from '../specification.service';

@Component({
  selector: 'app-specification-add-attribute-value-list-dialog',
  templateUrl: './add-attribute-value-list-dialog.component.html',
  styleUrls: ['../_specification.scss']
})

export class AddAttributeValueListDialogComponent implements OnInit {

  attributeForm : FormGroup;

  selectable = true;
  removable = true;

  attributesValue: any = [];

  constructor(
    public dialogRef: MatDialogRef<AddAttributeValueListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private specificationService: SpecificationService
  ) {

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  create() {
    if(this.attributeForm.invalid) {
      return;
    }

    let self = this;
    this.specificationService.attributeCreate(this.attributeForm.value).then((data) => {
      if(data.id) {
        self.close();
        self.data.isAddAttribute = true;
      }
    });
  }

  add(event): void {
    const index = this.data.attributesValue.findIndex((e) => {
      return e.specificationValueContent == event.name;
    });

    if (index >= 0) {
      return;
    }
    this.specificationService.addAttributeValue({
      specificationId: this.data.id,
      valueId: event.id
    }).then((data) => {
      this.data.attributesValue.push(data);
    });
  }

  remove(params: any): void {
    const index = this.data.attributesValue.findIndex((e) => {
      return e.id == params.id;
    });

    if (index >= 0) {
      this.specificationService.deleteAttributeValue(params).then(() => {
        this.data.attributesValue.splice(index, 1);
      });
    }


  }
}
