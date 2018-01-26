import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
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

  YesOrNo = [{
    text: "Yes",
    value: true
  }, {
    text: 'No',
    value: false
  }];

  variantList:any[] = [];

  isProductListShow: boolean = false;

  variantAddedList: any[] = [];

  productForm : FormGroup;
  productForm1: FormGroup;

  countries: Object[];

  // Enter, comma
  separatorKeysCodes = [ENTER, 188];

  previewImgFile: any;
  previewImgSrcs: any;

  additionalList: any = [];
  additionalSrcs: any = [];

  colorImageList: any[] = [];

  get product() { return this.productForm.get('variants') as FormArray; }
  get shipping() { return this.productForm.get('shippings') as FormArray; }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminService: AdminService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.productForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: [null, Validators.required],
      variant: this.fb.array([]),
      variants: this.fb.array([]),
      shippings: this.fb.array([]),
      commission: [0, Validators.required],
      brandName: [''],
      description: ['', Validators.required],
      length: [0, Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
      weight: [0, Validators.required],
      customsDeclaredCharge: [0, Validators.required],
      originCountryId: [null, Validators.required],
      isPowder: [false, Validators.required],
      isLiquid: [false, Validators.required],
      isBattery: [false, Validators.required]
    });

    this.addProductList();
    this.addShippingList();

  }

  changeStep(index) {
    this.ngZone.runOutsideAngular(() => {
      this.document.querySelector('html').scrollTop = 0;
    });
    this.step = index;
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


  changeShippingMethod($event, p) {
    this.adminService.getShippingList($event).then((data) => {
      p.shippingMethodList = data;
    });
  }

  changeShippingPrice($event, p) {

    p.patchValue({
      price: 0,
      shippingTime: 0,
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
      if(list.hasColorImage) {
        this.colorImageList.push({
          value: value.trim(),
          image: false
        });
        list.colorImageList.push({
          value: value.trim(),
          image: false
        });
      }
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
      if(list.hasColorImage) {
        list.colorImageList.splice(index, 1);
        let _index = this.colorImageList.findIndex((data) => {
          if(data.value == item) {
            return true;
          }
        });

        if(_index >= 0) {
          this.colorImageList.splice(_index, 1);
        }
      }

      this.addProductList(true);
    }

  }

  deleteVariant(index:any) {
    let item = this.variantAddedList[index];
    if(item.option == 2) {
      if(item.colorImageList) {
        for(let value of item.colorImageList) {
          let _index = this.colorImageList.findIndex((data) => {
            if(data.value == value.value) {
              return true;
            }
          });
          if(_index > -1) {
            this.colorImageList.splice(_index,1);
          }
        }
      }
    }
    this.variantAddedList.splice(index, 1);

    this.addProductList(true);
  }

  deleteVariantObject(i) {
    this.product.removeAt(i);
  }

  addVariantList() {
    let option = {
      option: '',
      isValue: false,
      value: [],
      visible: true,
      selectable: true,
      removable: true,
      addOnBlur: true,
      hasColorImage: false,
      colorImageList: []
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
          let image = '';
          for(let i = 0; i < newArr.length; i++) {
            newArr[i] = {};
            newArr[i].id = parseInt(idArr[i]);
            newArr[i].value = valueArr[i];
            if(newArr[i].id == 2) {
              for(let item of this.colorImageList) {
                if(item.value == newArr[i].value && item.image) {
                  image = item.image;
                  break;
                }
              }
            }
          }

          this.product.push(this.fb.group({
            variant: [item],
            attributes: [newArr],
            mainImage: [image],
            sku: ['', Validators.required],
            stock: [0, Validators.required],
            saleUnitPrice: [0, Validators.required],
            unitPrice: [0]
          }));
        }
      } else {
        this.isProductListShow = false;
        this.product.push(this.fb.group({
          attributes: [[]],
          mainImage: [''],
          sku: ['', Validators.required],
          stock: [0, Validators.required],
          saleUnitPrice: [0, Validators.required],
          unitPrice: [0]
        }));
      }


    } else {
      this.product.push(this.fb.group({
        attributes: [[]],
        mainImage: [''],
        sku: ['', Validators.required],
        stock: [0, Validators.required],
        saleUnitPrice: [0, Validators.required],
        unitPrice: [0]
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
    item.value = [];
    if(item.option == 2) {
      item.hasColorImage = true;
      item.colorImageList = [];
    }
    this.addProductList(true);
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
    this.step = 1;
    this.ngZone.runOutsideAngular(() => {
      this.document.querySelector('html').scrollTop = 0;
    });
  }

  publish() {
    let product = this.productForm.value;
    let self = this;
    this.adminService.productCreate(product).then((data) => {
      self.openPendingProductDialog();
      self.ngZone.runOutsideAngular(() => {
        self.document.querySelector('html').style.top = '0';
      });
      self.router.navigate(['../'], { queryParams: {tab: 'pending'}, replaceUrl: true, relativeTo: this.activatedRoute});
    });
  }

  createDraft() {
    let product = this.productForm.value;
    let self = this;

    let shippings = [];
    for(let item of product.shippings) {
      if(item.countryId != '' && item.shippingId != '') {
        shippings.push(item);
      }
    }

    product.shippings = shippings;

    this.adminService.productDraftCreate(product).then((data) => {
      self.ngZone.runOutsideAngular(() => {
        self.document.querySelector('html').style.top = '0';
      });
      self.router.navigate(['../'], { queryParams: {tab: 'draft'}, replaceUrl: true, relativeTo: this.activatedRoute});
    });
  }

  openPendingProductDialog() {
    let dialogRef = this.dialog.open(PendingProductDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngZone.runOutsideAngular(() => {
        this.document.querySelector('html').style.top = '0';
      });
    });
  }

}
