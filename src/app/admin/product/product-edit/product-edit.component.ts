import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { ConstantService } from  '../../../shared/services/constant/constant.service';

import { MatChipInputEvent } from '@angular/material';
import { ENTER } from '@angular/cdk/keycodes';

import { SaveProductDialogComponent } from '../save-product-dialog/save-product-dialog.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['../product.scss']
})

export class ProductEditComponent implements OnInit {

  step: number = 0;

  isFirstStepFinished: boolean = false;

  category = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];

  shippingTimeList = ['5 - 10 days','7 - 14 days','10 - 15 days','14 - 21 days','21 - 28 days','other'];

  YesOrNo = ["Yes", 'No'];

  variantList = ['Color','Size', 'Material', 'Other'];

  isProductListShow: boolean = false;

  variantAddedList: any[] = [];

  productForm : FormGroup;

  countries: Object[];

  // Enter, comma
  separatorKeysCodes = [ENTER, 188];

  previewImgFile: any;
  previewImgSrcs: any;

  additionalList: any[] = new Array(5);
  additionalSrcs: any[] = new Array(5);

  get product() { return this.productForm.get('product') as FormArray; }
  get shipping() { return this.productForm.get('shipping') as FormArray; }

  constructor(
    private constantService: ConstantService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.countries = this.constantService.getCountries();

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      variant: this.fb.array([]),
      product: this.fb.array([]),
      shipping: this.fb.array([]),
      commission: ['', Validators.required],
      brand: [''],
      description: ['', Validators.required],
      package: this.fb.group({
        length: ['', Validators.required],
        width: ['', Validators.required],
        height: ['', Validators.required],
        weight: ['', Validators.required],
        declaredValue: ['', Validators.required],
        country: ['', Validators.required],
        powder: ['', Validators.required],
        liquid: ['', Validators.required],
        battery: ['', Validators.required]
      })
    });

    this.addProductList();
    this.addShippingList();

  }

  addShippingList() {

    this.shipping.push(this.fb.group({
      country: ['', Validators.required],
      charge: ['', Validators.required],
      shippingTime: ['', Validators.required],
      minTime: [''],
      maxTime: ['']
    }));
  }

  add(event: MatChipInputEvent, list: any): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      list.value.push(value.trim());
      this.addProductList(true);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(item: any, list: any): void {
    let index = list.value.indexOf(item);

    if (index >= 0) {
      list.value.splice(index, 1);

      this.addProductList(true);
    }

  }

  deleteVariant(index:any) {
    this.variantAddedList.splice(index, 1);

    this.addProductList(true);
  }

  addVariantList() {
    let option = {
      option: '',
      isValue: false,
      value: [],
      visible: true,
      selectable: true,
      removable: true,
      addOnBlur: true
    };

    this.variantAddedList.push(option);
  }

  addProductList(variant?: any) {

    if(variant) {
      if(this.isProductListShow == false) {
        this.product.removeAt(0);
      }
      if(!this.isProductListShow) {
        this.isProductListShow = true;
      }

      let Arr = [];
      for(let item of this.variantAddedList) {
        Arr.push(item.value);
      }

      let newArr = this.formatVariantArray(Arr);

      this.product.controls = [];

      if(newArr.length > 0) {
        for(let item of newArr) {
          this.product.push(this.fb.group({
            variant: [item],
            SKU: ['', Validators.required],
            quantity: ['', Validators.required],
            price: ['', Validators.required],
            MSRP: ['']
          }));
        }
      } else {
        this.isProductListShow = false;
        this.product.push(this.fb.group({
          SKU: ['', Validators.required],
          quantity: ['', Validators.required],
          price: ['', Validators.required],
          MSRP: ['']
        }));
      }


    } else {
      this.product.push(this.fb.group({
        SKU: ['', Validators.required],
        quantity: ['', Validators.required],
        price: ['', Validators.required],
        MSRP: ['']
      }));
    }

  }

  formatVariantArray(doubleArrays) {
    let len = doubleArrays.length;
    if (len >= 2) {
      let len1 = doubleArrays[0].length;
      let len2 = doubleArrays[1].length;
      let newlen = len1 * len2;
      let temp = new Array(newlen);
      let index = 0;
      for (let i = 0; i < len1; i++) {
        for (let j = 0; j < len2; j++) {
          temp[index] = doubleArrays[0][i] + ', ' + doubleArrays[1][j];
          index++;
        }
      }
      let newArray = new Array(len - 1);
      for (let i = 2; i < len; i++) {
        newArray[i - 1] = doubleArrays[i];
      }
      newArray[0] = temp;
      return this.formatVariantArray(newArray);
    }
    else {
      return doubleArrays.length > 0 && doubleArrays[0].length > 0? doubleArrays[0]: [];
    }
  }

  optionChange($event, item) {
    item.option = $event;
    item.isValue = true;
  }

  ngOnInit():void {

  }

  openLeaveDialog() {
    let dialogRef = this.dialog.open(SaveProductDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
