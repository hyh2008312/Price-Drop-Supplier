import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators , FormArray } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import { ProductService } from '../product.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { ConstantService } from  '../../../shared/services/constant/constant.service';

import { ImageUploadPreviewService } from "../../../shared/components/image-upload-preview/image-upload-preview.service";
import { S3UploaderService } from "../../../shared/services/s3-upload/s3-upload.service";

import { DeleteVariantDialogComponent } from '../delete-variant-dialog/delete-variant-dialog.component';
import { AddVariantDialogComponent } from '../add-variant-dialog/add-variant-dialog.component';
import { DeleteShippingDialogComponent } from '../delete-shipping-dialog/delete-shipping-dialog.component';
import { EditShippingDialogComponent } from '../edit-shipping-dialog/edit-shipping-dialog.component';
import { AddShippingDialogComponent } from '../add-shipping-dialog/add-shipping-dialog.component';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['../product.scss']
})

export class ProductEditComponent implements OnInit {

  step: number = 0;
  status: any = false;

  productId: any;

  categoryList: any = [];
  subCategoryList: any;

  YesOrNo = [{
    text: "Yes",
    value: true
  }, {
    text: 'No',
    value: false
  }];

  variantList:any[] = [];

  attributes:any[];

  productBasicForm: FormGroup;
  productVariantForm: FormGroup;
  productCommissionForm: FormGroup;
  productLogisticForm: FormGroup;

  countries: Object[];

  previewImgFile: any;
  previewImgSrcs: any;

  additionalList: any = [];
  additionalSrcs: any = [];

  productShippingList: any[];

  public editor;
  public editorImageId = 'quillImage';

  get product() { return this.productVariantForm.get('variants') as FormArray; }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private adminService: ProductService,
    private ngZone: NgZone,
    private previewImageService: ImageUploadPreviewService,
    private s3UploaderService: S3UploaderService,
    @Inject(DOCUMENT) private document: Document
  ) {

    this.productBasicForm = this.fb.group({
      title: ['', Validators.required],
      mainCategoryId: [null],
      categoryId: [null, Validators.required],
      brandName: [''],
      description: ['Please add product details and images', Validators.required],
      productCategoryId: ['', Validators.required]
    });

    this.productVariantForm = this.fb.group({
      variants: this.fb.array([]),
    });

    this.productCommissionForm = this.fb.group({
      commissionRate: ['', Validators.required]
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
        mainCategoryId: data.productCategories[0].parentId,
        categoryId: data.productCategories[0].categoryId,
        brandName: data.brandName,
        description: data.description,
        productCategoryId: data.productCategories[0].id
      });

      this.adminService.getCategoryList().then((value) => {
        this.categoryList = [...value];
        this.categoryChange(data.productCategories[0].parentId);
      });

      this.status = data.status;

      this.additionalList = [...data.images];
      this.additionalSrcs = [...data.images];
    });

    this.adminService.getProductVariantList({
      pid: id
    }).then((data) => {
      this.attributes = data.attributes;
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
      this.productShippingList = data.shippingPrices;
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

  onEditorCreated(quill) {
    this.editor = quill;

    let self = this;
    this.editor.getModule('toolbar').addHandler("image", (image) => {
      if(image) {
        var fileInput = document.getElementById(self.editorImageId);
        fileInput.click();
      }
    });
  }

  addPicture(event) {
    if(!event.target.files[0]) {
      return;
    }
    let that = this;
    this.previewImageService.readAsDataUrl(event.target.files[0]).then(function(result) {

      let file = event.target.files[0];

      let image = new Image();
      image.onload = function(){
        let width = image.width;
        let height = image.height;

        that.s3UploaderService.upload({
          type: 'detail',
          fileName: file.name,
          use: 'detail',
          width: width,
          height: height
        }).then((data)=> {
          let imageUrl = `${data.url}/${data.key}`;
          that.s3UploaderService.uploadToS3WithoutLoading(file, data).then((data) => {
            let range = that.editor.getSelection();
            that.editor.insertEmbed(range.index, 'image', imageUrl);
          });
        });
      };
      image.src = window.URL.createObjectURL(file);

    });
  }

  changeStep(index) {
    this.ngZone.runOutsideAngular(() => {
      this.document.querySelector('html').scrollTop = 0;
    });
    this.step = index;
  }

  categoryChange($event) {
    if(this.categoryList.length > 0) {
      let index = this.categoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.categoryList[index] && this.categoryList[index].children) {
        this.subCategoryList = [...this.categoryList[index].children];
      } else {
        this.subCategoryList = false;
      }
    }
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

  deleteShippingObject(i) {
    let id = this.productShippingList[i].id;
    let self = this;
    if(id) {
      let dialogRef = this.dialog.open(DeleteShippingDialogComponent, {
        data: {
          id: id,
          isDelete: false
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(dialogRef.componentInstance.data.isDelete == true) {
          self.productShippingList.splice(i, 1);
        }
      });
    } else {
      self.productShippingList.splice(i, 1);
    }
  }

  openEditShippingDialog(i) {
    let item = this.productShippingList[i];
    let dialogRef = this.dialog.open(EditShippingDialogComponent, {
      data: {
        shipping: item,
        countries: this.countries,
        isShippingEdit: false
      }
    });

    let self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isShippingEdit == true) {
        this.productShippingList[i] = dialogRef.componentInstance.data.shipping;
      }
    });
  }

  openAddShippingDialog(i) {
    let item = this.productShippingList[i];
    let dialogRef = this.dialog.open(AddShippingDialogComponent, {
      data: {
        shipping: {},
        productId: parseInt(this.activatedRoute.snapshot.params["id"]),
        countries: this.countries,
        isShippingAdd: false
      }
    });

    let self = this;
    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isShippingAdd == true) {
        self.productShippingList.push(dialogRef.componentInstance.data.shipping);
      }
    });
  }

  openVariantDialog() {
    let id = parseInt(this.activatedRoute.snapshot.params["id"]);
    let dialogRef = this.dialog.open(AddVariantDialogComponent, {
      data: {
        variant: {},
        attributes: this.attributes,
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
          isEdit: !p.value.isEdit,
          mainImage: data.mainImage
        });
      });
    }
  }

  ngOnInit():void {

    this.adminService.getVariantList().then((data) => {
      this.variantList = data;
    });

    this.adminService.getCountryList().then((data) => {
      this.countries = data;
    });

  }

  openLeaveDialog() {
    this.router.navigate(['/admin/product'], { queryParams: {tab:this.status}});
  }

  changeProductBasic() {
    if(this.productBasicForm.invalid) {
      return;
    }
    let product = this.productBasicForm.value;
    product.id = parseInt(this.activatedRoute.snapshot.params["id"]);
    product.images = this.additionalList;
    this.adminService.changeProductBasic(product).then((data) => {
      console.log(data);
    });
  }

  changeProductCommission() {
    if(this.productCommissionForm.invalid) {
      return;
    }
    let product = this.productCommissionForm.value;
    product.id = parseInt(this.activatedRoute.snapshot.params["id"]);
    this.adminService.changeProductCommission(product).then((data) => {
      console.log(data)
    });
  }

  changeProductLogistic() {
    if(this.productLogisticForm.invalid) {
      return;
    }
    let product = this.productLogisticForm.value;
    product.id = parseInt(this.activatedRoute.snapshot.params["id"]);
    this.adminService.changeLogisticShipping(product).then((data) => {
      console.log(data)
    });
  }
}
