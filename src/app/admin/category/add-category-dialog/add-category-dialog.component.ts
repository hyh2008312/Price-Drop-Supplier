import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['../_category.scss']
})

export class AddCategoryDialogComponent implements OnInit {

  attributeForm : FormGroup;
  error: any = false;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private specificationService: CategoryService
  ) {
    this.attributeForm = this.fb.group({
      name: ['', Validators.required],
      index: [1, Validators.required],
      image: []
    });

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
      } else {
        self.error = 'Duplicate Attribute!';
      }
    }).catch(() => {
      self.error = 'Duplicate Attribute!';
    });
  }
}
