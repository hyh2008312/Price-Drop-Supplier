import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { SpecificationService } from '../specification.service';

@Component({
  selector: 'app-specification-add-category-attribute-dialog',
  templateUrl: './add-category-attribute-dialog.component.html',
  styleUrls: ['../_specification.scss']
})

export class AddCategoryAttributeDialogComponent implements OnInit {

  attributeForm : FormGroup;

  attributeList: any;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryAttributeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private specificationService: SpecificationService
  ) {
    this.attributeForm = this.fb.group({
      categoryId: ['', Validators.required],
      specificationId: ['', Validators.required],
      sort: ['', Validators.required],
      multiSelect: ['', Validators.required]
    });

    this.attributeForm.patchValue({
      categoryId: this.data.id
    });

    this.attributeList = this.data.attributeList;

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
    this.specificationService.categoryAttributeCreate(this.attributeForm.value).then((data) => {
      if(data.id) {
        self.close();
        self.data.isAddAttribute = true;
      }
    });
  }

}
