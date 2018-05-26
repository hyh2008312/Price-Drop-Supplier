import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { ProductService } from '../product.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['../product.scss']
})

export class ProductMainComponent implements OnInit {


  productPublished: any = false;
  productPublishedIndex = 1;
  productPendingApproval: any = false;
  productPendingApprovalIndex = 1;
  productDisapproved: any = false;
  productDisapprovedIndex = 1;
  productDraft: any = false;
  productDraftIndex = 1;
  productUnpublished: any = false;
  productUnpublishedIndex = 1;

  publishedSorted = 'Date';
  pendingSorted = 'Under Review';
  unpublishedSorted = 'Date';
  publishedSortList = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];
  pendingSortList = ['Under Review', 'Disapproved'];
  unpublishedSortList = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];

  searchCategory = 'SKU';
  searchList = ['SKU','Product'];

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 12;
  pageSizeOptions = [6, 12];

  constructor(
    private adminService: ProductService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {

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
          self.selectedIndex = 3;
          break;
        case 'draft':
          self.selectedIndex = 4;
          break;
        default:
          self.selectedIndex = 0;
          break;
      }

      self.changeProducts({
        index: self.selectedIndex
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
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
      default:
        break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }


  changeProducts(event) {
    let relationStatus = 'published';
    let page = this.productPublishedIndex;
    switch (event.index) {
      case 1:
        relationStatus = 'pending';
        page = this.productPendingApprovalIndex;
        break;
      case 2:
        relationStatus = 'disapproved';
        page = this.productDisapprovedIndex;
        break;
      case 3:
        relationStatus = 'unpublished';
        page = this.productUnpublishedIndex;
        break;
      case 4:
        relationStatus = 'draft';
        page = this.productDraftIndex;
        break;
      default:
        break;
    }

    let self = this;

    this.adminService.getProductList({
      status: relationStatus,
      page: page,
      page_size: this.pageSize,
      q: this.searchKey
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
            this.productDraft.splice(event.index,1);
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
    }
  }

}
