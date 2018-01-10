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
import { PendingProductDialogComponent } from '../pending-product-dialog/pending-product-dialog.component';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['../product.scss']
})

export class ProductCreateComponent implements OnInit {

  step: number = 0;

  productId: any;

  isFirstStepFinished: boolean = false;

  categoryList:any;

  shippingMethodList = ['EMS','DHL'];

  shippingTimeList = [{
    value: [5, 10],
    text: '5 - 10 days'
  }, {
    value: [7, 14],
    text: '7 - 14 days'
  }, {
    value: [10, 15],
    text: '10 - 15 days'
  }, {
    value: [14, 21],
    text:'14 - 21 days'
  },{
    value: [21, 28],
    text: '21 - 28 days'
  },{
    value: [0, 0],
    text: 'other'
  }];

  YesOrNo = ["Yes", 'No'];

  variantList = ['Color','Size', 'Material', 'Other'];

  isProductListShow: boolean = false;

  variantAddedList: any[] = [];

  productForm : FormGroup;
  productForm1: FormGroup;

  countries: Object[];

  // Enter, comma
  separatorKeysCodes = [ENTER, 188];

  previewImgFile: any;
  previewImgSrcs: any;

  additionalList: any[] = new Array(5);
  additionalSrcs: any[] = new Array(5);

  get product() { return this.productForm.get('variants') as FormArray; }
  get shipping() { return this.productForm.get('shipping') as FormArray; }
  get categories() { return this.productForm.get('categories') as FormArray; }

  constructor(
    private constantService: ConstantService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminService: AdminService
  ) {
    this.countries = this.constantService.getCountries();

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      categories: this.fb.array([]),
      variant: this.fb.array([]),
      variants: this.fb.array([]),
      shipping: this.fb.array([]),
      commission: ['', Validators.required],
    });

    this.productForm1 = this.fb.group({
      brandName: [''],
      description: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      customsDeclaredCharge: ['', Validators.required],
      originCountryId: ['', Validators.required],
      isPowder: ['', Validators.required],
      isLiquid: ['', Validators.required],
      isBattery: ['', Validators.required]
    });

    this.addProductList();
    this.addShippingList();
    this.addCategory();
  }

  addShippingList() {

    this.shipping.push(this.fb.group({
      countryId: ['', Validators.required],
      id: ['', Validators.required],
      price: [0, Validators.required],
      checked: [false, Validators.required],
      shippingTime: ['', Validators.required],
      min: [0, Validators.required],
      max: [0, Validators.required]
    }));
  }

  addCategory() {
    this.categories.push(this.fb.group({
      id: ['', Validators.required]
    }));
  }

  changeShippingMethod($event, p) {
    this.adminService.getShippingList($event).then((data) => {
      p.shippingMethodList = data;
    });
  }

  changeShippingPrice($event, p) {

    p.patchValue({
      price: 0,
      shippingTime: '',
      checked: false,
      min: 0,
      max: 0
    });
  }

  add(event: MatChipInputEvent, list: any): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      list.value.push({
        id: list.option,
        value: value.trim()
      });
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

  deleteVariantObject(i) {
    this.product.removeAt(i)
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
          let idArr = item.id.toString().split(',');
          let valueArr = item.value.toString().split(',');
          let newArr = new Array(idArr.length);
          for(let i = 0; i < newArr.length; i++) {
            newArr[i] = {};
            newArr[i].id = parseInt(idArr[i]);
            newArr[i].value = valueArr[i];
          }

          this.product.push(this.fb.group({
            variant: [item],
            attributes: [newArr],
            sku: ['', Validators.required],
            stock: ['', Validators.required],
            saleUnitPrice: ['', Validators.required],
            unitPrice: ['']
          }));
        }
      } else {
        this.isProductListShow = false;
        this.product.push(this.fb.group({
          sku: ['', Validators.required],
          stock: ['', Validators.required],
          saleUnitPrice: ['', Validators.required],
          unitPrice: ['']
        }));
      }


    } else {
      this.product.push(this.fb.group({
        sku: ['', Validators.required],
        stock: ['', Validators.required],
        saleUnitPrice: ['', Validators.required],
        unitPrice: ['']
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
          temp[index] = {};
          temp[index].id = doubleArrays[0][i].id + ',' + doubleArrays[1][j].id;
          temp[index].value = doubleArrays[0][i].value + ', ' + doubleArrays[1][j].value;
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

  changeShippingTime($event, item, index) {
    let shippingTime = item.value.shippingTime;
    shippingTime[index] = $event;
    item.patchValue({
      shipTime: shippingTime
    });
  }

  showMinAndMaxTime($event, index, item) {
    if(index == 5) {
      item.patchValue({
        checked: true
      });
    } else {
      item.patchValue({
        checked: false
      });
    }
  }

  ngOnInit():void {
    this.adminService.getCategoryList().then((data) => {
      this.categoryList = data;
    });

    this.adminService.getVariantList().then((data) => {
      this.variantList = data;
    });

    this.adminService.getCountryList().then((data) => {
      this.countries = data;
    });

  }

  openLeaveDialog() {
    let dialogRef = this.dialog.open(SaveProductDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  continue() {
    let product = this.productForm.value;
    this.adminService.productCreate(product).then((data) => {
      this.productId = data.id;
      this.step = 1;
    });
  }

  publish() {
    let product = this.productForm1.value;
    product.id = this.productId;
    this.adminService.addProduct(product).then((data) => {
      this.openPendingProductDialog();
      console.log(data);
    });
  }

  openPendingProductDialog() {
    let dialogRef = this.dialog.open(PendingProductDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
