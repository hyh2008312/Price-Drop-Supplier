import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { ProductService } from '../product.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { ImageUploadPreviewService } from "../../../shared/components/image-upload-preview/image-upload-preview.service";
import { S3UploaderService } from "../../../shared/services/s3-upload/s3-upload.service";
import { HttpEventType, HttpResponse} from "@angular/common/http";

import { AddUploadDialogComponent } from '../add-upload-dialog/add-upload-dialog.component';
import { ProductTipsComponent } from '../product-tips/product-tips.component';
import { MatDialog, MatSnackBar } from '@angular/material';

import * as jspdf from 'jspdf';
import * as html2canvas from 'html2canvas';
import {read, utils, WorkBook, WorkSheet, write} from 'xlsx';

import { saveAs } from 'file-saver';

import { s } from '../product';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['../product.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})

export class ProductMainComponent implements OnInit {

  categoryList: any = [];
  subCategoryList: any = [];
  thirdCategoryList: any = [];

  sortList: any = [{
    value: false,
    text: 'New Arrivals'
  }, {
    value: 'price_low',
    text: 'Price Low to High'
  }, {
    value: 'price_high',
    text: 'Price High to Low'
  }];

  productPublished: any = false;
  productPublishedIndex = 1;
  catPublished: any = false;
  sortPublished: any = false;
  productPendingApproval: any = false;
  productPendingApprovalIndex = 1;
  catPending: any = false;
  sortPending: any = false;
  productDisapproved: any = false;
  productDisapprovedIndex = 1;
  catDisapproved: any = false;
  sortDisapproved: any = false;
  productDraft: any = false;
  productDraftIndex = 1;
  catDraft: any = false;
  sortDraft: any = false;
  productUnpublished: any = false;
  productUnpublishedIndex = 1;
  catUnpublished: any = false;
  sortUnpublished: any = false;
  productSelected: any = false;
  productSelectedIndex = 1;
  productDrops: any = false;
  productDropsIndex = 1;

  publishedSorted = 'Date';
  publishedSortList = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];

  searchCategory = 'sku';
  searchList = ['sku', 'product', 'shop', 'spu'];

  isPendingChecked: any = false;

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  cateA: any = '';
  cateB: any = '';
  cateC: any = '';

  min: any;
  max: any;

  csAll: any;
  ceAll: any;
  psAll: any;
  peAll: any;

  shopName: any = false;
  shopNameList: any = [{
    value: false,
    text: 'All'
  }, {
    value: '1688',
    text: '1688'
  }, {
    value: 'clubfactory',
    text: 'ClubFactory'
  }, {
    value: 'pricedrop',
    text: 'Other'
  }];

  constructor(
    private adminService: ProductService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private previewImageService: ImageUploadPreviewService,
    private s3UploaderService: S3UploaderService
  ) {

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    if(this.isSuperuser) {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          break;
        case 2:
          this.productDisapprovedIndex = 1;
          break;
        case 3:
          this.productUnpublishedIndex = 1;
          break;
        case 4:
          this.productDraftIndex = 1;
          break;
        case 5:
          this.productDropsIndex = 1;
          break;
        case 6:
          this.productSelectedIndex = 1;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          break;
        case 2:
          this.productUnpublishedIndex = 1;
          break;
        case 3:
          this.productDraftIndex = 1;
          break;
        case 4:
          this.productDropsIndex = 1;
          break;
      }
    }

    this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
  }

  ngOnInit():void {
    let self = this;
    this.subscription = this.activatedRoute.queryParams.subscribe((data) => {
      switch(data.tab) {
        case 'published':
          self.selectedIndex = 0;
          break;
        case 'pending':
          self.selectedIndex = 1;
          break;
        case 'unpublished':
          self.selectedIndex = 2;
          break;
        case 'draft':
          self.selectedIndex = 3;
          break;
        case 'drops':
          self.selectedIndex = 4;
          break;
        case 'featured':
          self.selectedIndex = 5;
          break;
        default:
          self.selectedIndex = 0;
          break;
      }

      self.changeProducts({
        index: self.selectedIndex
      });
    });

    this.getCategory();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    if(this.isSuperuser) {
      switch (type) {
        case 0:
          this.productPublishedIndex = event.pageIndex + 1;
          break;
        case 1:
          this.productPendingApprovalIndex = event.pageIndex + 1;
          break;
        case 2:
          this.productDisapprovedIndex = event.pageIndex + 1;
          break;
        case 3:
          this.productUnpublishedIndex = event.pageIndex + 1;
          break;
        case 4:
          this.productDraftIndex = event.pageIndex + 1;
          break;
        case 5:
          this.productDropsIndex = event.pageIndex + 1;
          break;
        case 6:
          this.productSelectedIndex = event.pageIndex + 1;
          break;
        default:
          break;
      }
    } else {
      switch (type) {
        case 0:
          this.productPublishedIndex = event.pageIndex + 1;
          break;
        case 1:
          this.productPendingApprovalIndex = event.pageIndex + 1;
          break;
        case 2:
          this.productUnpublishedIndex = event.pageIndex + 1;
          break;
        case 3:
          this.productDraftIndex = event.pageIndex + 1;
          break;
        case 4:
          this.productDropsIndex = event.pageIndex + 1;
          break;
      }
    }

    this.changeProducts({index: type}, this.isSuperuser);
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeProducts(event, superUser?:any) {
    let relationStatus = 'published';
    let page = this.productPublishedIndex;
    let cat = this.catPublished;
    let sort = this.sortPublished;
    if(superUser) {
      if(event.index < 5) {
        switch (event.index) {
          case 1:
            relationStatus = 'pending';
            page = this.productPendingApprovalIndex;
            cat = this.catPending;
            sort = this.sortPending;
            break;
          case 2:
            relationStatus = 'disapproved';
            page = this.productDisapprovedIndex;
            cat = this.catDisapproved;
            sort = this.sortDisapproved;
            break;
          case 3:
            relationStatus = 'unpublished';
            page = this.productUnpublishedIndex;
            cat = this.catUnpublished;
            sort = this.sortUnpublished;
            break;
          case 4:
            relationStatus = 'draft';
            page = this.productDraftIndex;
            cat = this.catDraft;
            sort = this.sortDraft;
            break;
          default:
            break;
        }


        let self = this;
        let q = this.searchKey;
        let qt = this.searchCategory;
        if(q == '') {
          q = null;
          qt = null;
        }

        cat = cat ? cat: null;
        sort = sort ? sort: null;

        this.adminService.getProductList({
          status: relationStatus,
          page: page,
          page_size: this.pageSize,
          cat,
          sort,
          q,
          qt
        }).then((data) => {
          self.length = data.count;
          switch (event.index) {
            case 1:
              self.productPendingApproval = data.results;
              break;
            case 2:
              self.productDisapproved = data.results;
              break;
            case 3:
              self.productUnpublished = data.results;
              break;
            case 4:
              self.productDraft = data.results;
              break;
            default:
              self.productPublished = data.results;
              break;
          }


        });
      } else if(event.index == 6) {

        page = this.productSelectedIndex;
        let self = this;
        let q = this.searchKey;
        let qt = this.searchCategory;
        if(q == '') {
          q = null;
          qt = null;
        }
        this.adminService.getSelectedProductList({
          page: page,
          page_size: this.pageSize,
          q,
          qt
        }).then((data) => {
          self.length = data.count;
          self.productSelected = data.results;

        });
      } else if(event.index == 5) {

        page = this.productDropsIndex;
        let self = this;
        this.adminService.getDropsProductList({
          page: page,
          page_size: this.pageSize
        }).then((data) => {
          self.length = data.count;
          self.productDrops = data.results;

        });
      }

    } else {
      if(event.index <= 3) {
        switch (event.index) {
          case 1:
            relationStatus = 'pending';
            page = this.productPendingApprovalIndex;
            cat = this.catPending;
            sort = this.sortPending;
            break;
          case 2:
            relationStatus = 'unpublished';
            page = this.productUnpublishedIndex;
            cat = this.catUnpublished;
            sort = this.sortUnpublished;
            break;
          case 3:
            relationStatus = 'draft';
            page = this.productDraftIndex;
            cat = this.catDraft;
            sort = this.sortDraft;
            break;
          default:
            break;
        }


        let self = this;
        let q = this.searchKey;
        let qt = this.searchCategory;
        if(q == '') {
          q = null;
          qt = null;
        }

        cat = cat ? cat: null;
        sort = sort ? sort: null;

        this.adminService.getProductList({
          status: relationStatus,
          page: page,
          page_size: this.pageSize,
          cat,
          sort,
          q,
          qt
        }).then((data) => {
          self.length = data.count;
          switch (event.index) {
            case 1:
              self.productPendingApproval = data.results;
              break;
            case 2:
              self.productUnpublished = data.results;
              break;
            case 3:
              self.productDraft = data.results;
              break;
            default:
              self.productPublished = data.results;
              break;
          }

        });
      } else if(event.index == 4) {

        page = this.productDropsIndex;
        let self = this;
        this.adminService.getDropsProductList({
          page: page,
          page_size: this.pageSize
        }).then((data) => {
          self.length = data.count;
          self.productDrops = data.results;

        });
      }
    }


  }

  productChange(event) {
    switch(event.status) {
      case 0:
        switch(event.event) {
          case 'delete':
            this.productPublished.splice(event.index,1);
            break;
          case 'unpublish':
            this.productPublished.splice(event.index,1);
            break;
        }
        break;
      case 1:
        switch(event.event) {
          case 'delete':
            this.productPendingApproval.splice(event.index,1);
            break;
          case 'disapprove':
            this.productPendingApproval.splice(event.index,1);
            break;
          case 'publish':
            this.productPendingApproval.splice(event.index,1);
            break;
          case 'checked':
            this.productPendingApproval[event.index] = event.product;
            break;
        }
        break;
      case 2:
        switch(event.event) {
          case 'delete':
            this.productUnpublished.splice(event.index,1);
            break;
          case 'publish':
            this.productUnpublished.splice(event.index,1);
            break;
        }
        break;
      case 3:
        switch(event.event) {
          case 'delete':
            this.productUnpublished.splice(event.index,1);
            break;
          case 'publish':
            this.productUnpublished.splice(event.index,1);
            break;
        }
        break;
      case 5:
        switch(event.event) {
          case 'delete':
            this.productDrops.splice(event.index,1);
            break;
        }
        break;
      case 6:
        switch(event.event) {
          case 'selected':
            this.productSelected.splice(event.index,1);
            break;
        }
        break;
    }
  }

  openUploadDialog() {
    let dialogRef = this.dialog.open(AddUploadDialogComponent, {
      data: {
        isUpload: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
       if(dialogRef.componentInstance.data.isUpload == true) {
         this.selectedIndex = 0;
         this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
       }
    });
  }

  checkedChange($event) {
    this.isPendingChecked = $event.change;
    for(let item of this.productPendingApproval) {
      item.isChecked = $event.change
    }
  }

  publishedWithList() {
    let product: any = [];
    for(let item of this.productPendingApproval) {
      if(item.isChecked) {
        product.push(item.id);
      }
    }

    if(product.length <= 0) {
      return this.publishedTips('You should selected at least one product!');
    }

    this.adminService.publishProducts({
      product
    }).then(() => {
      this.selectedIndex = 0;
      this.isPendingChecked = false;
      this.publishedTips('Publish Success!');
    });
  }

  publishedTips(str: any) {
    this.snackBar.openFromComponent(ProductTipsComponent, {
      data: str,
      duration: 4000,
      verticalPosition: 'top'
    });
  }

  categoryChange($event) {
    if(this.categoryList.length > 0) {
      let index = this.categoryList.findIndex((data) => {
        if(data.id == $event) {
          this.cateA = data.data.name;
          return true;
        }
      });
      if(this.categoryList[index] && this.categoryList[index].children) {
        this.subCategoryList = [...this.categoryList[index].children];
        this.cateB = null;
        this.cateC = null;
      } else {
        this.subCategoryList = [];
        this.cateB = null;
        this.cateC = null;
      }
      this.thirdCategoryList = [];
    }
    if(this.isSuperuser) {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productDisapprovedIndex = 1;
          this.catDisapproved = $event;
          break;
        case 3:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 4:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 3:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
      }
    }
    this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
  }

  subCategoryChange($event) {
    if(this.subCategoryList.length > 0) {
      let index = this.subCategoryList.findIndex((data) => {
        if(data.id == $event) {
          this.cateB = data.data.name;
          return true;
        }
      });
      if(this.subCategoryList[index] && this.subCategoryList[index].children) {
        this.thirdCategoryList = [...this.subCategoryList[index].children];
        this.cateC = null;
      } else {
        this.thirdCategoryList = [];
        this.cateC = null;
      }
    }
    if(this.isSuperuser) {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productDisapprovedIndex = 1;
          this.catDisapproved = $event;
          break;
        case 3:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 4:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 3:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
      }
    }
    this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
  }

  thirdCategoryChange($event) {
    let index = this.thirdCategoryList.findIndex((data) => {
      if(data.id == $event) {
        this.cateC = data.data.name;
        return true;
      }
    });
    if(this.isSuperuser) {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productDisapprovedIndex = 1;
          this.catDisapproved = $event;
          break;
        case 3:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 4:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.catPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.catPending = $event;
          break;
        case 2:
          this.productUnpublishedIndex = 1;
          this.catUnpublished = $event;
          break;
        case 3:
          this.productDraftIndex = 1;
          this.catDraft = $event;
          break;
      }
    }
    this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
  }

  getCategory() {
    this.adminService.getCategoryList().then((data) => {
      this.categoryList = [...data];
      this.categoryList.unshift({
        id: false,
        data: {
          name: 'All'
        }
      })
    });
  }

  sortChange($event) {
    if(this.isSuperuser) {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.sortPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.sortPending = $event;
          break;
        case 2:
          this.productDisapprovedIndex = 1;
          this.sortDisapproved = $event;
          break;
        case 3:
          this.productUnpublishedIndex = 1;
          this.sortUnpublished = $event;
          break;
        case 4:
          this.productDraftIndex = 1;
          this.sortDraft = $event;
          break;
        default:
          break;
      }
    } else {
      switch (this.selectedIndex) {
        case 0:
          this.productPublishedIndex = 1;
          this.sortPublished = $event;
          break;
        case 1:
          this.productPendingApprovalIndex = 1;
          this.sortPending = $event;
          break;
        case 2:
          this.productUnpublishedIndex = 1;
          this.sortUnpublished = $event;
          break;
        case 3:
          this.productDraftIndex = 1;
          this.sortDraft = $event;
          break;
      }
    }
    this.changeProducts({index: this.selectedIndex}, this.isSuperuser);
  }

  export(): void {
    let min_price: any = this.min? this.min: null;
    let max_price: any = this.max? this.max: null;
    let start_time = this.csAll? this.csAll: null;
    let end_time = this.ceAll? this.ceAll: null;
    let filter_type = this.shopName? this.shopName: null;
    let shop_name = this.searchCategory == 'shop' && this.searchKey && this.searchKey != ''? this.searchKey: null;
    let category_id = this.catPublished? this.catPublished: null;

    this.adminService.getPdfProduct({
      category_id,
      min_price,
      max_price,
      start_time,
      end_time,
      filter_type,
      shop_name
    }).then((res) => {
      if(res && res.length > 0) {
        const ws_name = 'catalog';
        const wb: WorkBook = { SheetNames: [], Sheets: {} };
        let packing: any = [];
        let excel: any = [...res];

        for(let item of excel) {

          for(let i = 0; i < item.variants.length; i++) {
            let orderItem: any = {};
            orderItem.Category = this.cateA;
            orderItem.Subcategory = this.cateB;
            orderItem.Thirdcategory = this.cateC;
            orderItem.SPU = item.spu;
            orderItem.Title = item.title;
            for(let i = 0; i < item.images.length; i++) {
              if(i < 5) {
                const im = item.images[i];
                orderItem['Picture_' + i] = im;
              }
            }
            const im = item.variants[i];
            orderItem.SKU = im.sku;
            orderItem.MainImage = im.mainImage;
            orderItem.Size = '';
            orderItem.Color = '';
            for(let em of im.attributeValues) {
              if(em.name == 'Size') {
                orderItem.Size = em.value;
              }
              if(em.name == 'Color') {
                orderItem.Color = em.value;
              }
            }
            orderItem.Selling_Price = parseInt((im.unitPrice).toString());
            orderItem.MRP = parseInt((im.saleUnitPrice).toString());
            orderItem.Souring_Cost = parseInt(im.sourcingPrice);
            orderItem.Supplier_Name = item.shopName;
            for(let i = 0; i < item.productSpecification.length; i++) {
              const im = item.productSpecification[i];
              orderItem[im.name] = im.content;
            }
            packing.push(orderItem);
          }

        }

        const ws: any = utils.json_to_sheet(packing);
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

        saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${this.cateA}${this.cateB? '-'+this.cateB:''}${this.cateC? '-'+this.cateC:''}.xlsx`);
      }
    });



  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  captureScreen() {

    this.adminService.getPdfProduct({
      category_id: this.catPublished
    }).then((res) => {
      if(res && res.length > 0) {
        let index = 1;
        this.getPdf(index, res);
      }
    });

  }

  getPdf(index, res) {
    let data = document.getElementById('table');
    let excel: any = [];

    for(let i = 0; i < res.length; i++) {
      if(i >= (index - 1) * 120 && i <= index * 120) {
        excel.push(res[i]);
      }
    }

    let html = '';
    html+= '<tr style="height: 131px;">' +
      '<td style="width:550px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 32px;">Product</td>' +
      '<td style="width:650px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 8px;">Images</td>'
    '</tr>';


    let number = 1;

    for(let item of excel) {
      html+='<tr>';
      html += `<td style="width:550px;word-wrap:break-word;text-align: left;padding: 8px 32px; vertical-align:top;">
              <div style="max-height: 56px;font-size: 20px;line-height: 28px;overflow: hidden;">${item.title}</div></td>`;
      html += '<td style="width:650px;height: 131px;font-size: 20px;text-align: left;" rowspan="2">'
      for(let i = 0; i < item.images.length; i++) {
        if(i < 5) {
          const im = item.images[i];
          html += `<img style="border: 1px solid rgba(0, 0, 0, .12); border-radius: 2px; margin-left: 8px;" src="${im}" width="120" height="120">`
        }
      }
      html += '</td>';
      html+='</tr>';
      html+='<tr>';
      html += `<td style="width:550px;font-size: 20px;padding: 8px 32px;font-weight: bold;vertical-align:top;">SPU: ${item.spu}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: ₹${parseInt(item.b2cUnitPrice)}</td>`;
      html += '</tr>';

      if(number > 1 && number % 12 == 0) {
        html+= '<tr style="height: 131px;">' +
          '<td style="width:550px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 32px;">Product</td>' +
          '<td style="width:650px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 8px;">Images</td>'
        '</tr>';
      }

      number++;
    }

    data.insertAdjacentHTML('afterbegin', html);
    html2canvas(data, {
      useCORS: true
    }).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      if(heightLeft < pageHeight) {
        pdf.addImage(contentDataURL, 'JPEG', 0, 0, imgWidth,imgHeight);
      } else {
        while(heightLeft > 0) {
          //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
          pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight;
          position -= 295;
          //避免添加空白页
          if(heightLeft > 0) {
            //注②
            pdf.addPage();
          }
        }
      }

      pdf.save(`${this.cateA}${this.cateB? '-'+this.cateB:''}${this.cateC? '-'+this.cateC:''}-${index}.pdf`); // Generated PDF
      data.innerHTML = '';

      if(index * 120 < res.length - 1) {
        index++;
        this.getPdf(index, res);
      } else {
        console.log("It's OK");
      }
    }).catch((data) => {
      console.log(data)
    });
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheets(wb, 0)

    };
    reader.readAsBinaryString(target.files[0]);
  }

  onFileChange1(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});

      this.getSheets1(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }

  getSheets(wb, index) {
    if(index < wb.SheetNames.length) {
      /* grab first sheet */
      const wsname: string = wb.SheetNames[index];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

      let spu = [];
      for(let i = 0; i < newData.length; i++) {
        const item = newData[i];
        if(i > 0) {
          if(item[0]) {
            spu.push(item[0]);
          }
        }
      }

      this.adminService.getPdfNewProduct({spu}).then((res) => {
        this.getExcel(1, res, wsname, index, wb);
      })
    } else {
      console.log('all is OK');
    }

  }

  getPdf1(index, res, wbname, idx, wb) {
    let data = document.getElementById('table');
    let excel: any = [];

    for(let i = 0; i < res.length; i++) {
      if(i >= (index - 1) * 120 && i <= index * 120) {
        excel.push(res[i]);
      }
    }

    let html = '';
    html+= '<tr style="height: 131px;">' +
      '<td style="width:550px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 32px;">Product</td>' +
      '<td style="width:650px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 8px;">Images</td>'
    '</tr>';


    let number = 1;

    for(let item of excel) {
      html+='<tr>';
      html += `<td style="width:550px;word-wrap:break-word;text-align: left;padding: 8px 32px; vertical-align:top;">
              <div style="max-height: 56px;font-size: 20px;line-height: 28px;overflow: hidden;">${item.title}</div></td>`;
      html += '<td style="width:650px;height: 131px;font-size: 20px;text-align: left;" rowspan="2">'
      for(let i = 0; i < item.images.length; i++) {
        if(i < 5) {
          const im = item.images[i];
          html += `<img style="border: 1px solid rgba(0, 0, 0, .12); border-radius: 2px; margin-left: 8px;" src="${im}" width="120" height="120">`
        }
      }
      html += '</td>';
      html+='</tr>';
      html+='<tr>';
      html += `<td style="width:550px;font-size: 20px;padding: 8px 32px;font-weight: bold;vertical-align:top;">SPU: ${item.spu}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: ₹${parseInt(item.b2cUnitPrice)}</td>`;
      html += '</tr>';

      if(number > 1 && number % 12 == 0) {
        html+= '<tr style="height: 131px;">' +
          '<td style="width:550px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 32px;">Product</td>' +
          '<td style="width:650px;font-size: 18px;line-height: 24px;font-weight:bold;text-align: left;padding: 0 8px;">Images</td>'
        '</tr>';
      }

      number++;
    }

    data.insertAdjacentHTML('afterbegin', html);
    html2canvas(data, {
      useCORS: true
    }).then(canvas => {
      // Few necessary setting options
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      if(heightLeft < pageHeight) {
        pdf.addImage(contentDataURL, 'JPEG', 0, 0, imgWidth,imgHeight);
      } else {
        while(heightLeft > 0) {
          //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
          pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight;
          position -= 295;
          //避免添加空白页
          if(heightLeft > 0) {
            //注②
            pdf.addPage();
          }
        }
      }

      pdf.save(`${wbname} - ${index}.pdf`); // Generated PDF
      data.innerHTML = '';

      if(index * 120 < res.length - 1) {
        index++;
        this.getPdf1(index, res, wbname, idx, wb);
      } else {
        console.log(wbname + " - It's OK");
        idx++;
        this.getSheets(wb, idx);
      }
    }).catch((data) => {
      console.log(data)
    });
  }

  getExcel(index, res, wbname, idx, wb) {


    const _wb: WorkBook = { SheetNames: [], Sheets: {} };
    let excel: any = [...res];
    let packing: any = [];

    for(let item of excel) {
      for(let i = 0; i < item.variants.length; i++) {
        let orderItem: any = {};
        orderItem.Category = '';
        orderItem.Subcategory = '';
        orderItem.Thirdcategory = '';
        orderItem.SPU = item.spu;
        orderItem.Title = item.title;
        for(let i = 0; i < item.images.length; i++) {
          if(i < 5) {
            const im = item.images[i];
            orderItem['Picture_' + i] = im;
          }
        }
        const im = item.variants[i];
        orderItem.SKU = im.sku;
        orderItem.MainImage = im.mainImage;
        orderItem.Size = '';
        orderItem.Color = '';
        for(let em of im.attributeValues) {
          if(em.name == 'Size') {
            orderItem.Size = em.value;
          }
          if(em.name == 'Color') {
            orderItem.Color = em.value;
          }
        }
        orderItem.Selling_Price = parseInt((im.unitPrice).toString());
        orderItem.MRP = parseInt((im.saleUnitPrice).toString());
        orderItem.Souring_Cost = parseInt(im.sourcingPrice);
        orderItem.Supplier_Name = item.shopName;
        for(let i = 0; i < item.productSpecification.length; i++) {
          const im = item.productSpecification[i];
          orderItem[im.name] = im.content;
        }
        packing.push(orderItem);
      }
    }

    const ws: any = utils.json_to_sheet(packing);
    _wb.SheetNames.push(wbname);
    _wb.Sheets[wbname] = ws;
    const wbout = write(_wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${wbname}.xlsx`);

    idx++;
    this.getSheets(wb, idx);
  }

  getImages: any = [];

  getSheets1(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));


    console.log(newData)
    // let pack = [];
    // for(let i = 0; i < newData.length; i++) {
    //   const item = newData[i];
    //   if(i >= 1) {
    //     let obj: any = {};
    //     obj.spu = item[2];
    //     let idx = s.findIndex((value) => {
    //       if(value.spu == obj.spu) {
    //         return true;
    //       }
    //     });
    //     const _item = s[idx];
    //     for(let i = 0; i < _item.images.length; i++ ) {
    //       const fm = _item.images[i];
    //       if(i < 5) {
    //         obj['images_' + (i+1)] = fm;
    //       }
    //     }
    //     pack.push(obj);
    //   }
    // }
    //
    //
    // this.getContentTxt2(pack, wsname);
    //
    let index = 3;
    this.getContentTxt1(newData[index], index, newData, wsname);

  }

  getContentTxt(obj, file, index, newData, wbname) {
    if(index >= 2) {
      const _wb: WorkBook = { SheetNames: [], Sheets: {} };

      const ws: any = utils.json_to_sheet(this.getImages);
      _wb.SheetNames.push(wbname);
      _wb.Sheets[wbname] = ws;
      const wbout = write(_wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${wbname}.xlsx`);
      console.log('All is done');
      return;
    }

    const that = this;
    //新建图片
    let image = new Image();
    //解决canvas无法读取画布问题
    image.crossOrigin = 'Anonymous';

    //通加载图片完毕保证快速读取
    image.onload = () => {

      const bulb: any = this.getBase64Image(image);
      bulb.toBlob((res) => {
        that.s3UploaderService.upload({
          type: 'product/main',
          fileName: file,
          use: 'cover',
          width: image.width,
          height: image.height
        }).then((data) => {
          let url = data.url;
          let key = data.name;

          that.s3UploaderService.uploadToS3(res, data).subscribe((event) => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            if (event.type === HttpEventType.UploadProgress) {
              // This is an upload progress event. Compute and show the % done:
            } else if (event instanceof HttpResponse) {
              this.getImages.push({images:url + '/' + key});
              index++;
              this.getContentTxt(newData[index], file, index, newData, wbname);
            }
          });
        });
      }, "image/jpeg", 1);
    };

    image.src = obj[24];
  }

  getContentTxt2(data, wbname) {
    const _wb: WorkBook = { SheetNames: [], Sheets: {} };

    const ws: any = utils.json_to_sheet(data);
    _wb.SheetNames.push(wbname);
    _wb.Sheets[wbname] = ws;
    const wbout = write(_wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${wbname}.xlsx`);
    console.log('All is done');
  }

  getContentTxt1(obj, index, newData, wbname) {
    if(index >= newData.length) {
      const _wb: WorkBook = { SheetNames: [], Sheets: {} };

      const ws: any = utils.json_to_sheet(this.getImages);
      _wb.SheetNames.push(wbname);
      _wb.Sheets[wbname] = ws;
      const wbout = write(_wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), `${wbname}.xlsx`);
      console.log('All is done');
      return;
    }
    if(index >= 3) {
      //新建图片
      let image = new Image();
      //解决canvas无法读取画布问题
      image.crossOrigin = 'Anonymous';

      //通加载图片完毕保证快速读取
      image.onload = () => {
        let pixels = this.searchImage(image, image.width, image.height);
        let similar = 0;
        let selectedIdx = 0;
        let _index = 0;
        this.getImage(index, pixels, similar, _index, selectedIdx, newData, wbname);
      };

      image.src = obj[23];
    }
  }

  getImage(index, pixels, similar, _index, selectedIdx, newData, wsname) {
    let idx = s.findIndex((value) => {
      if(value.spu == newData[index][2]) {
        return true;
      }
    });
    const item = s[idx];
    if(_index >= item.color_image.length) {
      let em: any = {};
      em.spu = item.spu;
      let imgs: any = item.color_image[selectedIdx].split('160x160.');
      em.images = imgs.join('');
      for(let i = 0; i < item.images.length; i++ ) {
        const fm = item.images[i];
        if(i < 5) {
          em['images_' + (i+1)] = fm;
        }
      }
      this.getImages.push(em);

      index++;
      this.getContentTxt1(newData[index], index, newData, wsname);
      return;
    }

    //新建图片
    let image = new Image();
    //解决canvas无法读取画布问题
    image.crossOrigin = 'Anonymous';

    //通加载图片完毕保证快速读取
    image.onload = () => {
      let pixels2 = this.searchImage(image, image.width, image.height);
      let a = this.compare(pixels, pixels2, image.width, image.height);
      if(similar < a) {
        similar = a;
        selectedIdx = _index;
      }
      _index++;
      this.getImage(index, pixels, similar, _index, selectedIdx, newData, wsname);
    };

    //通加载图片完毕保证快速读取
    image.onerror = () => {
      _index++;
      this.getImage(index, pixels, similar, _index, selectedIdx, newData, wsname);
    };

    image.src = item.color_image[_index];
    if(image.src == '') {
      _index++;
      this.getImage(index, pixels, similar, _index, selectedIdx, newData, wsname);
    }
  }

  getBase64Image(img){
    let canvas = document.createElement("canvas");
    const ratio = img.width / 800 > img.height / 800 ? img.width / 800: img.height / 800;
    canvas.width = img.width / ratio;
    canvas.height = img.height / ratio;

    let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  searchImage(image1, tmplw, tmplh) {
    let canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      sw = image1.width,  // 原图宽度
      sh = image1.height,  // 原图高度
      tw = tmplw || 8,  // 模板宽度
      th = tmplh || 8;  // 模板高度
    canvas.width = tw;
    canvas.height = th;
    ctx.drawImage(image1, 0, 0, sw, sh, 0, 0, tw, th);
    let pixels = ctx.getImageData(0, 0, tw, th);
    return this.toGrayBinary(pixels, true, null, true);
  }

  compare(pixels, pixels2, tw, th) {
    let similar = 0;
    for (let i = 0, len = tw * th; i < len; i++) {
      if (pixels[i] == pixels2[i]) similar++;
    }
    similar = (similar / (tw * th)) * 100;
    return similar;
  }

  toGrayBinary(pixels, binary, value, sn) {
    let r, g, b, avg = 0, len = pixels.data.length, s = '';
    for (let i = 0; i < len; i += 4) {
      avg += (.299 * pixels.data[i] + .587 * pixels.data[i + 1] + .114 * pixels.data[i + 2]);
    }
    avg /= (len / 4);
    for (let i = 0; i < len; i += 4) {
      r = .299 * pixels.data[i],
        g = .587 * pixels.data[i + 1],
        b = .114 * pixels.data[i + 2];
      if (binary) {
        if ((r + g + b) >= (value || avg)) {
          g = 255;
          if (sn) s += '1';
        } else {
          g = 0;
          if (sn) s += '0';
        }
        g = (r + g + b) > (value || avg) ? 255 : 0;
      } else {
        g = r + g + b;
      }
      pixels.data[i] = g,
        pixels.data[i + 1] = g,
        pixels.data[i + 2] = g;
    }
    if (sn) return s;
    else return pixels;
  }

  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    if(event.value) {
      this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
    } else {
      this[type] = null;
    }
  }

  resetDate() {
    this.csAll = null;
    this.ceAll = null;
    this.psAll = null;
    this.peAll = null;
  }

}
