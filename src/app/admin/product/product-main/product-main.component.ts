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
  productSelected: any = false;
  productSelectedIndex = 1;
  productDrops: any = false;
  productDropsIndex = 1;

  publishedSorted = 'Date';
  pendingSorted = 'Under Review';
  unpublishedSorted = 'Date';
  publishedSortList = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];
  pendingSortList = ['Under Review', 'Disapproved'];
  unpublishedSortList = ['Date', 'Most Views', 'Most Orders', 'Highest Conversion'];

  searchCategory = 'sku';
  searchList = ['sku','product'];

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

  userPermission: any = [false, true, true, false, false, true, false];

  constructor(
    private adminService: ProductService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
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
        case 'featured':
          self.selectedIndex = 4;
          break;
        case 'drops':
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
          this.productSelectedIndex = event.pageIndex + 1;
          break;
        case 6:
          this.productDropsIndex = event.pageIndex + 1;
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
    if(superUser) {
      if(event.index < 5) {
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
        let q = this.searchKey;
        let qt = this.searchCategory;
        if(q == '') {
          q = null;
          qt = null;
        }

        this.adminService.getProductList({
          status: relationStatus,
          page: page,
          page_size: this.pageSize,
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
      } else if(event.index == 5) {

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
      } else if(event.index == 6) {

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
            break;
          case 2:
            relationStatus = 'unpublished';
            page = this.productUnpublishedIndex;
            break;
          case 3:
            relationStatus = 'draft';
            page = this.productDraftIndex;
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

        this.adminService.getProductList({
          status: relationStatus,
          page: page,
          page_size: this.pageSize,
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
          case 'selected':
            this.productSelected.splice(event.index,1);
            break;
        }
        break;
      case 6:
        switch(event.event) {
          case 'delete':
            this.productDrops.splice(event.index,1);
            break;
        }
        break;
    }
  }

}
