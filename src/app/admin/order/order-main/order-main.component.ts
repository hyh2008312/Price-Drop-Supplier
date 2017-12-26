import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['../order.scss']
})

export class OrderMainComponent implements OnInit {


  productPublished: any = false;
  productPublishedIndex = 1;
  productDraft: any = false;
  productDraftIndex = 1;
  productUnpublished: any = false;
  productUnpublishedIndex = 1;

  allSorted = 'All';
  unfulfilledSorted = 'All';
  fulfilledSorted = 'All';
  canceledSorted = 'All';
  requestTypeSorted = 'All';
  returnStatusSorted = 'All';
  sortList = ['All', 'Paid', 'Refunded'];
  requestTypeList = ['All', 'Exchanged', 'Refund'];
  returnStatusList = ['All', 'Pending', 'Authorized', 'Exchanged','Refunded', 'Partially', 'Partially Refunded', 'Denied'];

  selectedIndex: number = 0;
  subscription: any;
  subscription1: any;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 12;
  pageSizeOptions = [6, 12];

  constructor(
    private adminService: AdminService,
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

  }

  ngOnDestroy() {

  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 0:
        this.productPublishedIndex = event.pageIndex + 1;
        break;
      case 1:
        this.productDraftIndex = event.pageIndex + 1;
        break;
      case 2:
        this.productUnpublishedIndex = event.pageIndex + 1;
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
        relationStatus = 'draft';
        page = this.productDraftIndex;
        break;
      case 2:
        relationStatus = 'unpublished';
        page = this.productUnpublishedIndex;
        break;
      default:
        break;
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
    }
  }

}
