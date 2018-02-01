import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-add-variant-dialog',
  templateUrl: './add-variant-dialog.component.html',
  styleUrls: ['../product.scss']
})

export class AddVariantDialogComponent implements OnInit {

  variantForm: FormGroup;
  get attributes() { return this.variantForm.get('attributes') as FormArray; }

  attributeList = [{
    id: 1,
    name: 'color'
  }, {
    id: 2,
    name: 'size'
  }];

  constructor(
    public dialogRef: MatDialogRef<AddVariantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,
    private fb: FormBuilder
  ) {

    this.variantForm = this.fb.group({
      sku: ['', Validators.required],
      saleUnitPrice: ['', Validators.required],
      unitPrice: ['', Validators.required],
      productId: ['', Validators.required],
      stock: ['', Validators.required],
      attributes: this.fb.array([])
    });

    for(let item of this.attributeList) {
      this.attributes.push(this.fb.group({
        id: [item.id, Validators.required],
        name: [item.name, Validators.required],
        value: ['', Validators.required],
      }));
    }

  }

  ngOnInit():void {

  }

  close():void {
    this.dialogRef.close();
  }

  add() {
    let product = {
      id: this.data.id
    };

    let self = this;
    this.productService.addNewVariant(product).then((data) => {
      self.data.isDelete = true;
    });
  }

}
