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


  orderUnfulfilled: any = false;
  orderUnfulfilledIndex = 1;
  orderFulfilled: any = false;
  orderFulfilledIndex = 1;
  orderCanceled: any = false;
  orderCanceledIndex = 1;
  orderReturns: any = false;
  orderReturnsIndex = 1;

  allSorted = 'All';
  unfulfilledSorted = 'All';
  fulfilledSorted = 'All';
  canceledSorted = 'All';
  requestTypeSorted = 'All';
  returnStatusSorted = 'All';
  sortList = ['All', 'Paid', 'Refunded'];
  requestTypeList = ['All', 'Exchange', 'Refund'];
  returnStatusList = ['All', 'Pending', 'Authorized', 'Exchanged','Refunded', 'Partially Refunded', 'Denied'];

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any = '';
  isSearch: boolean = false;
  searchResult: any;
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
    this.subscription = this.activatedRoute.queryParams.subscribe((data) => {
      switch(data.tab) {
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
        this.orderUnfulfilledIndex = event.pageIndex + 1;
        break;
      case 1:
        this.orderFulfilledIndex = event.pageIndex + 1;
        break;
      case 2:
        this.orderCanceledIndex = event.pageIndex + 1;
        break;
      case 3:
        this.orderReturnsIndex = event.pageIndex + 1;
        break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }


  changeProducts(event) {
    let status = '';
    let page = 0;
    switch (event.index) {
      case 0:
        status = 'Unfulfilled';
        page = this.orderUnfulfilledIndex;
        break;
      case 1:
        status = 'Fulfilled';
        page = this.orderFulfilledIndex;
        break;
      case 2:
        status = 'Canceled';
        page = this.orderCanceledIndex;
        break;
      case 3:
        status = 'Returns';
        page = this.orderReturnsIndex;
        break;
      default:
        break;
    }

    let self = this;

    this.adminService.getSupplyOrderList({
      status,
      page,
      page_size: this.pageSize,
      q: this.searchKey
    }).then((data) => {
      self.length = data.count;
      switch (event.index) {
        case 0:
          self.orderUnfulfilled = data.results;
          break;
        case 1:
          self.orderFulfilled = data.results;
          break;
        case 2:
          self.orderCanceled = data.results;
          break;
        case 3:
          self.orderReturns = data.results;
          break;
      }
    });

  }

  searchResultProducts() {
    let self = this;

    this.adminService.getSupplyOrderResult({
      orderNumber: this.searchKey
    }).then((data) => {

      switch (data.status) {
        case 'Unfulfilled':
          self.orderUnfulfilled = [];
          self.orderUnfulfilled.push(data);
          self.selectedIndex = 0;
          break;
        case 'Fulfilled':
          self.orderFulfilled = [];
          self.orderFulfilled.push(data);
          self.selectedIndex = 1;
          break;
        case 'Canceled':
          self.orderCanceled = [];
          self.orderCanceled.push(data);
          self.selectedIndex = 2;
          break;
        case 'Returns':
          self.orderReturns = [];
          self.orderReturns.push(data);
          self.selectedIndex = 3;
          break;
      }

    });
  }

  productChange(event) {

  }

}
