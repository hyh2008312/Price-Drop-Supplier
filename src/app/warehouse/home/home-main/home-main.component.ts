import { Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { HomeService } from '../home.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { HomeCreateDialogComponent } from '../home-create-dialog/home-create-dialog.component';
import { MatDialog } from '@angular/material';

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

  searchCategory: any = 'delivery';

  searchList:any = [{
    text: '快递单号',
    value: 'delivery'
  }, {
    text: '采购单号',
    value: 'purchase'
  }, {
    text: 'SKU',
    value: 'sku'
  }];

  status: any = false;

  statusList: any = [{
    value: false,
    text: '所有'
  }, {
    value: 'Completed',
    text: '成功入库'
  }, {
    value: 'Quantity Issue',
    text: '数量问题'
  }, {
    value: 'Quality Issue',
    text: '货物问题'
  }];

  warehouseList: any;

  processingDaysList: any = [{
    value: false,
    text: '所有'
  }, {
    value: 2,
    text: '超过2天未发货'
  }];

  shippedDaysList: any = [{
    value: false,
    text: '所有'
  }, {
    value: 4,
    text: '超过4天未收货'
  }];

  sortList: any = [{
    value: 'true',
    text: '正序'
  }, {
    value: 'false',
    text: '逆序'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  purchaseAll: any = false;
  purchaseAllIndex: any = 1;
  wbAll: any;
  purchaseProccessing: any = false;
  purchaseProccessingIndex: any = 1;
  processingDays: any = false;
  sortProcessing: any = 'true';
  wbProcessing: any;
  purchaseShipped: any = false;
  purchaseShippedIndex: any = 1;
  shippedDays: any = false;
  sortShipped: any = 'false';
  wbShipped: any;
  purchasePartiallyDelivered: any = false;
  purchasePartiallyDeliveredIndex: any = 1;
  wbPartiallyDelivered: any;
  purchaseDelivered: any = false;
  purchaseDeliveredIndex: any = 1;
  wbDelivered: any;
  purchaseCanceled: any = false;
  purchaseCanceledIndex: any = 1;
  wbCanceled: any;

  constructor(
    private adminService: HomeService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {

    this.getWarehouseList();

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

    this.changePurchaseLists({
      index: 0
    });
  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    switch (this.selectedIndex) {
      case 0:
        this.purchaseAllIndex = 1;
        break;
      case 1:
        this.purchaseProccessingIndex = 1;
        break;
      case 2:
        this.purchaseShippedIndex = 1;
        break;
      case 3:
        this.purchasePartiallyDeliveredIndex = 1;
        break;
      case 4:
        this.purchaseDeliveredIndex = 1;
        break;
      case 5:
        this.purchaseCanceledIndex = 1;
        break;
    }
    this.changePurchaseLists({
      index: this.selectedIndex
    });
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
        this.purchasePartiallyDeliveredIndex = event.pageIndex + 1;
        break;
      case 4:
        this.purchaseDeliveredIndex = event.pageIndex + 1;
        break;
      case 5:
        this.purchaseCanceledIndex = event.pageIndex + 1;
        break;
    }
    this.changePurchaseLists({index: type});
  }

  changePurchaseLists($event) {

    let status: any = null;
    let page = this.purchaseAllIndex;
    let page_size = this.pageSize;
    let delivery_status: any = this.status;
    let received_time: any = null;
    let processing_days: any = null;
    let shipped_days: any = null;
    let is_positive_sequence: any = null;

    switch ($event.index) {
      case 0:
        delivery_status = false;
        break;
      case 1:
        status = 'Processing';
        page = this.purchaseProccessingIndex;
        delivery_status = false;
        processing_days = this.processingDays? this.processingDays: null;
        is_positive_sequence = this.sortProcessing? this.sortProcessing: null;
        break;
      case 2:
        status = 'Shipped';
        page = this.purchaseShippedIndex;
        delivery_status = false;
        shipped_days = this.shippedDays? this.shippedDays: null;
        is_positive_sequence = this.sortShipped? this.sortShipped: null;
        break;
      case 3:
        status = 'Partially Delivered';
        page = this.purchasePartiallyDeliveredIndex;
        received_time = true;
        break;
      case 4:
        status = 'Delivered';
        page = this.purchaseDeliveredIndex;
        received_time = true;
        break;
      case 5:
        status = 'Canceled';
        page = this.purchaseCanceledIndex;
        delivery_status = false;
        break;
    }

    let search: any = null;
    let search_type: any = null;
    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search = encodeURIComponent(search);
      search_type = this.searchCategory;
    }
    delivery_status = delivery_status? delivery_status: null;

    this.adminService.getPurchaseList({
      status,
      page,
      page_size,
      search,
      search_type,
      delivery_status,
      received_time,
      processing_days,
      shipped_days,
      is_positive_sequence
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
          this.purchasePartiallyDelivered = [...data.results];
          break;
        case 4:
          this.purchaseDelivered = [...data.results];
          break;
        case 5:
          this.purchaseCanceled = [...data.results];
          break;
      }
    });
  }

  createPurchase() {
    let dialogRef = this.dialog.open(HomeCreateDialogComponent, {
      data: {
        isCreated: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isCreated == true) {
        this.selectedIndex = 0;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
      }
    });
  }

  changeDays($event) {
    switch (this.selectedIndex) {
      case 1:
        this.processingDays = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.shippedDays = $event;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }

  }

  productChange(event) {
    switch(event.status) {
      case 0:
        switch(event.event) {
          case 'delete':
            this.purchaseAll.splice(event.index,1);
            break;
        }
        break;
      case 1:
        switch(event.event) {
          case 'delete':
            this.purchaseProccessing.splice(event.index,1);
            break;
        }
        break;
      case 2:
        switch(event.event) {
          case 'complete':
            this.purchaseShipped.splice(event.index,1);
            break;
        }
        break;
      case 3:
        switch(event.event) {
          case 'complete':
            this.purchasePartiallyDelivered.splice(event.index,1);
            break;
        }
        break;
      case 4:
        switch(event.event) {
          case 'complete':
            this.purchaseDelivered.splice(event.index,1);
            break;
        }
        break;
    }
  }

  sortChange($event) {
    switch (this.selectedIndex) {
      case 1:
        this.sortProcessing = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.sortShipped = $event;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }
  }

  warehouseChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.wbAll = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 1:
        this.wbProcessing = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.wbShipped = $event;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 3:
        this.wbPartiallyDelivered = $event;
        this.purchasePartiallyDeliveredIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 4:
        this.wbDelivered = $event;
        this.purchaseDeliveredIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 5:
        this.wbCanceled = $event;
        this.purchaseDeliveredIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }
  }

  getWarehouseList() {
    this.adminService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
      this.warehouseList.unshift({
        id: false,
        warehouseName: '所有'
      })
    });
  }

}
