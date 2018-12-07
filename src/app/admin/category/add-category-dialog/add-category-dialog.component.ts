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

  categoryForm : FormGroup;
  error: any = false;
  image: any = false;

  categoryTypeList: any = ['first_Category', 'second_Category', 'third_Category'];

  constructor(
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      index: [1, Validators.required],
      categoryType: ['', Validators.required],
      parentId: [null],
      show: [false]
    });

    this.categoryForm.patchValue({
      categoryType: this.data.categoryType,
      parentId: this.data.parentId
    })

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  create() {
    if(this.categoryForm.invalid) {
      return;
    }

    let self = this;
    this.categoryService.categoryCreate(this.categoryForm.value).then((data) => {
      if(data.id) {
        self.close();
        self.data.isCategoryAdd = true;
      } else {
        self.error = 'Duplicate Category!';
      }
    }).catch(() => {
      self.error = 'Duplicate Category!';
    });
  }
}
