import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import { ProductService } from '../product.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { ConstantService } from  '../../../shared/services/constant/constant.service';

import { MatChipInputEvent } from '@angular/material';
import { ENTER } from '@angular/cdk/keycodes';

import { DeleteVariantDialogComponent } from '../delete-variant-dialog/delete-variant-dialog.component';
import { AddVariantDialogComponent } from '../add-variant-dialog/add-variant-dialog.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['../product.scss']
})

export class ProductEditComponent implements OnInit {

  step: number = 0;

  productId: any;

  isFirstStepFinished: boolean = false;

  categoryList:any;

  shippingTypeList = [{
    name: 'Free Shipping',
    type: 'Free'
  }, {
    name: 'Standard Shipping',
    type: 'Standard'
  }, {
    name: 'Expedited Shipping',
    type: 'Expedited'
  }];

  shippingMethodList = ['EMS','DHL'];

  shippingTimeList = [{
    value: '5-10',
    text: '5 - 10 days'
  }, {
    value: '7-14',
    text: '7 - 14 days'
  }, {
    value: '10-15',
    text: '10 - 15 days'
  }, {
    value: '14-21',
    text:'14 - 21 days'
  },{
    value: '21-28',
    text: '21 - 28 days'
  },{
    value: '0',
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

  variantProductList: any;

  productBasicForm: FormGroup;
  productVariantForm: FormGroup;
  productCommissionForm: FormGroup;
  productShippingForm: FormGroup;
  productLogisticForm: FormGroup;

  countries: Object[];

  // Enter, comma
  separatorKeysCodes = [ENTER, 188];

  previewImgFile: any;
  previewImgSrcs: any;

  additionalList: any = [];
  additionalSrcs: any = [];

  colorImageList: any[] = [];

  get product() { return this.productVariantForm.get('variants') as FormArray; }
  get shipping() { return this.productShippingForm.get('shippings') as FormArray; }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminService: ProductService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {


    this.productBasicForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: [null, Validators.required],
      brandName: [''],
      description: ['', Validators.required],
      productCategoryId: ['', Validators.required]
    });

    this.productVariantForm = this.fb.group({
      variants: this.fb.array([]),
    });

    this.productCommissionForm = this.fb.group({
      commissionRate: ['', Validators.required]
    });

    this.productShippingForm = this.fb.group({
      shippings: this.fb.array([]),
    });

    this.productLogisticForm = this.fb.group({
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

    let id = this.activatedRoute.snapshot.params['id'];

    this.adminService.getProductBasic({
      id
    }).then((data) => {
      this.productBasicForm.patchValue({
        title: data.title,
        categoryId: data.productCategories[0].categoryId,
        brandName: data.brandName,
        description: data.description,
        productCategoryId: data.productCategories[0].id
      });
    });

    this.adminService.getProductVariantList({
      pid: id
    }).then((data) => {
      for(let item of data.variants) {
        this.addProductList(item);
      }
    });

    this.adminService.getProductCommission({
      id
    }).then((data) => {
      this.productCommissionForm.patchValue({
        commissionRate: data.commissionRate
      })
    });

    this.adminService.getProductShipping({
      id
    }).then((data) => {
      for(let item of data.shippingPrices) {
        this.editShippingList(item);
      }
    });

    this.adminService.getLogisticShipping({
      id
    }).then((data) => {
      this.productLogisticForm.patchValue({
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
        customsDeclaredCharge: data.customsDeclaredCharge,
        originCountryId: data.originCountry.id,
        isPowder: data.isPowder,
        isLiquid: data.isLiquid,
        isBattery: data.isBattery
      });
    });

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
      type: ['', Validators.required],
      id: [''],
      shippingId: ['', Validators.required],
      price: [0, Validators.required],
      checked: [false, Validators.required],
      shippingTime: ['', Validators.required],
      shippingTimeMin: [0, Validators.required],
      shippingTimeMax: [0, Validators.required],
      shippingMethodList: [[]]
    }));
  }

  editShippingList(data) {

    this.adminService.getShippingList(1).then((res) => {
      let shippingTime = data.shippingTimeMin+ '-' +data.shippingTimeMax;
      let index = this.shippingTimeList.findIndex((data) => {
        if(data.value == shippingTime) {
          return true;
        }
      });
      this.shipping.push(this.fb.group({
        countryId: [data.countryId, Validators.required],
        type: [data.type, Validators.required],
        shippingId: [data.shippingId, Validators.required],
        price: [data.priceItem, Validators.required],
        checked: [false, Validators.required],
        shippingTime: [index > -1? shippingTime: '0', Validators.required],
        shippingTimeMin: [data.shippingTimeMin, Validators.required],
        shippingTimeMax: [data.shippingTimeMax, Validators.required],
        shippingMethodList: [res]
      }));
    });

  }

  changeShippingMethod($event, p) {
    this.adminService.getShippingList($event).then((data) => {
      p.patchValue({
        shippingMethodList : data
      });
    });
  }

  changeShippingPrice($event, p) {

    p.patchValue({
      price: 0,
      shippingTime: 0,
      checked: false,
      shippingTimeMin: 0,
      shippingTimeMax: 0
    });
  }

  deleteVariantObject(i) {
    let id = this.product.controls[i].value.id;
    let dialogRef = this.dialog.open(DeleteVariantDialogComponent, {
      data: {
        id: id,
        isDelete: false
      }
    });

    let self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isDelete == true) {
        self.product.removeAt(i);
      }
    });
  }

  openVariantDialog() {
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    let dialogRef = this.dialog.open(AddVariantDialogComponent, {
      data: {
        variant: {},
        productId: id,
        isVariantAdded: false
      }
    });

    let self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isVariantAdded == true) {
        self.addProductList(dialogRef.componentInstance.data.variant);
      }
    });
  }

  addProductList(variant) {
    let attribute = '';
    let index = 0;
    for(let item of variant.attributeValues) {
      attribute += index != 0?', ' +item.value.trim():item.value.trim();
      index++;
    }
    this.product.push(this.fb.group({
      id: [variant.id],
      isEdit: [false],
      attributes: [attribute],
      mainImage: [variant.mainImage?variant.mainImage: ''],
      sku: [variant.sku, Validators.required],
      stock: [variant.variantStockrecord, Validators.required],
      saleUnitPrice: [variant.saleUnitPrice, Validators.required],
      unitPrice: [variant.unitPrice]
    }));
  }

  editVariant(p) {
    if(!p.value.isEdit) {
      p.patchValue({
        isEdit: !p.value.isEdit
      });
    } else {
      this.adminService.changeVariant(p.value).then((data) => {
        p.patchValue({
          isEdit: !p.value.isEdit
        });
      });
    }
  }


  showMinAndMaxTime($event, index, item) {
    if(index == 5) {
      item.patchValue({
        checked: true
      });
    } else {
      let timeArr = this.shippingTimeList[index].value.split('-');
      item.patchValue({
        checked: false,
        shippingTimeMin: timeArr[0],
        shippingTimeMax: timeArr[1]
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

  }

  changeProductBasic() {
    if(this.productBasicForm.invalid) {
      return;
    }
    let product = this.productBasicForm.value;
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    product.id = id;
    product.images = '';
    this.adminService.changeProductBasic(product).then((data) => {
      console.log(data);
    });
  }

  changeProductCommission() {
    if(this.productCommissionForm.invalid) {
      return;
    }
    let product = this.productCommissionForm.value;
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    product.id = id;
    this.adminService.changeProductCommission(product).then((data) => {
      console.log(data)
    });
  }

  changeProductLogistic() {
    if(this.productLogisticForm.invalid) {
      return;
    }
    let product = this.productLogisticForm.value;
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    product.id = id;
    this.adminService.changeProductCommission(product).then((data) => {
      console.log(data)
    });
  }

  changeProductShipping() {
    if(this.productShippingForm.invalid) {
      return;
    }
    let product = this.productShippingForm.value;
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    product.id = id;
    this.adminService.changeProductShipping(product).then((data) => {
      console.log(data)
    });
  }

}
