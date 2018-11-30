import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { HomeService } from '../home.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-warehouse-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['../_home.scss']
})

export class HomeMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchList: [{
    text: '采购单号',
    value: 'purchase'
  }, {
    text: '快递单号',
    value: 'delivery'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  purchaseAll: any = false;
  purchaseAllIndex: any = 1;
  purchaseProccessing: any = false;
  purchaseProccessingIndex: any = false;
  purchaseShipped: any = false;
  purchaseShippedIndex: any = false;
  purchaseDelivery: any = false;
  purchaseDeliveryIndex: any = false;

  constructor(
    private adminService: HomeService,
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
  }

  ngOnDestroy() {

  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 0:
        this.purchaseAllIndex = event.pageIndex + 1;
        break;
      case 1:
        this.purchaseProccessingIndex = event.pageIndex + 1;
        break;
      case 2:
        this.purchaseShippedIndex = event.pageIndex + 1;
        break;
      case 3:
        this.purchaseDeliveryIndex = event.pageIndex + 1;
        break;
    }
    this.changePurchaseLists({index: type});
  }

  changePurchaseLists($event) {

    let status: any = null;
    let page = this.purchaseAllIndex;
    let page_size = this.pageSize;
    switch ($event.index) {
      case 0:
        break;
      case 1:
        status = 'Processing';
        page = this.purchaseProccessingIndex;
        break;
      case 2:
        status = 'Shipped';
        page = this.purchaseShippedIndex;
        break;
      case 3:
        status = 'Delivered';
        page = this.purchaseDeliveryIndex;
        break;
    }

    this.adminService.getPurchaseList({
      status,
      page,
      page_size
    }).then((data) => {
      this.length = data.count;
      switch ($event.index) {
        case 0:
          this.purchaseAll = [...data.results];
          break;
        case 1:
          this.purchaseProccessing = [...data.results];
          break;
        case 2:
          this.purchaseShipped = [...data.results];
          break;
        case 3:
          this.purchaseDelivery = [...data.results];
          break;
      }
    });
  }

}
