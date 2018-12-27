import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { TrackingService } from '../tracking.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { TrackingCreateDialogComponent } from '../tracking-create-dialog/tracking-create-dialog.component';
import { MatDialog } from '@angular/material';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {utils, WorkBook, write} from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-warehouse-tracking-main',
  templateUrl: './tracking-main.component.html',
  styleUrls: ['../_tracking.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class TrackingMainComponent implements OnInit {

  selectedIndex: number = 0;

  searchKey: any = '';
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchCategory: any = 'international_tracking_number';

  searchList:any = [{
    text: '运单号',
    value: 'international_tracking_number'
  }, {
    text: '检货单号',
    value: 'pick_number'
  }, {
    text: '订单号',
    value: 'order_number'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [25, 50];

  isSuperuser: boolean = false;

  btList: any = [{
    value: false,
    text: '所有'
  }, {
    value: '1',
    text: '带电'
  }, {
    value: '0',
    text: '不带电'
  }];
  codList: any = [{
    value: false,
    text: '所有'
  }, {
    value: '1',
    text: '是COD'
  }, {
    value: '0',
    text: '不是COD'
  }];

  btAll: any = false;
  codAll: any = false;
  purchaseAll: any = false;
  purchaseAllIndex: any = 1;
  csProcessing: any;
  ceProcessing: any;
  asProcessing: any;
  aeProcessing: any;
  btProcessing: any = false;
  codProcessing: any = false;
  purchaseProccessing: any = false;
  purchaseProccessingIndex: any = 1;
  csShipped: any;
  ceShipped: any;
  asShipped: any;
  aeShipped: any;
  btShipped: any = false;
  codShipped: any = false;
  purchaseShipped: any = false;
  purchaseShippedIndex: any = 1;
  purchaseDeleted: any = false;
  purchaseDeletedIndex: any = 1;

  constructor(
    private adminService: TrackingService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
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
        this.purchaseDeletedIndex = 1;
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
        this.purchaseDeletedIndex = event.pageIndex + 1;
        break;
    }
    this.changePurchaseLists({index: type});
  }

  changePurchaseLists($event) {

    let status: any = null;
    let page = this.purchaseAllIndex;
    let page_size = this.pageSize;
    let received_time: any = null;
    let create_start_time: any = null;
    let create_end_time: any = null;
    let packing_start_time: any = null;
    let packing_end_time: any = null;
    let is_battery: any = null;
    let is_cod: any = null;

    switch ($event.index) {
      case 0:
        is_battery = this.btAll;
        is_cod = this.codAll;
        break;
      case 1:
        is_battery = this.btProcessing;
        is_cod = this.codProcessing;
        status = 'Pending Packaging';
        page = this.purchaseProccessingIndex;
        create_start_time = this.csProcessing;
        create_end_time = this.ceProcessing;
        break;
      case 2:
        is_battery = this.btShipped;
        is_cod = this.codShipped;
        status = 'Packaging Completed';
        page = this.purchaseShippedIndex;
        packing_start_time = this.csShipped;
        packing_end_time = this.ceShipped;
        break;
      case 3:
        status = 'Package Deleted';
        page = this.purchaseDeletedIndex;
        received_time = true;
        break;
    }

    let search: any = null;
    let search_type: any = null;
    if(this.searchKey && this.searchKey != '') {
      search = this.searchKey;
      search_type = this.searchCategory;
    }
    is_battery = is_battery? is_battery: null;
    is_cod = is_cod? is_cod: null;

    this.adminService.getPickList({
      status,
      page,
      page_size,
      search,
      search_type,
      received_time,
      create_start_time,
      create_end_time,
      packing_start_time,
      packing_end_time,
      is_battery,
      is_cod
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
          this.purchaseDeleted = [...data.results];
          break;
      }
    });
  }

  createPurchase() {
    let dialogRef = this.dialog.open(TrackingCreateDialogComponent, {
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

  productChange(event) {
    switch(event.status) {
      case 1:
        switch(event.event) {
          case 'delete':
            this.purchaseProccessing.splice(event.index,1);
            break;
          case 'change':
            this.purchaseProccessing.splice(event.index,1);
            break;
        }
        break;
      case 2:
        switch(event.event) {
          case 'change':
            this.purchaseShipped.splice(event.index,1);
            break;
        }
        break;
      case 3:
        switch(event.event) {
          case 'delete':
            this.purchaseDeleted.splice(event.index,1);
            break;
          case 'complete':
            this.purchaseDeleted.splice(event.index,1);
            break;
        }
        break;
    }
  }

  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
  }

  filterDate() {
    switch (this.selectedIndex) {
      case 1:
        this.purchaseProccessingIndex = 1;
        break;
      case 2:
        this.purchaseShippedIndex = 1;
        break;
    }
    this.changePurchaseLists({
      index: this.selectedIndex
    });
  }

  cancelDate(type) {
    switch (type) {
      case 1:
        this.csProcessing = null;
        this.ceProcessing = null;
        this.asProcessing = null;
        this.aeProcessing = null;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.csShipped = null;
        this.ceShipped = null;
        this.asShipped = null;
        this.aeShipped = null;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }
  }

  btChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.btAll = $event;
        this.purchaseAllIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 1:
        this.btProcessing = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.btShipped = $event;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }
  }

  codChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.codAll = $event;
        this.purchaseAllIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 1:
        this.codProcessing = $event;
        this.purchaseProccessingIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
      case 2:
        this.codShipped = $event;
        this.purchaseShippedIndex = 1;
        this.changePurchaseLists({
          index: this.selectedIndex
        });
        break;
    }
  }

  export(): void {
    const ws_name = '拣货订单及物流';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let packing: any = [];
    let excel: any = [];
    switch (this.selectedIndex) {
      case 1:
        excel = [...this.purchaseProccessing];
        break;
      case 2:
        excel = [...this.purchaseShipped];
        break;
    }

    for(let item of excel) {
      for( let itm of item.pickVariants) {
        let orderItem: any = {};
        orderItem['订单号'] = itm.orderNumber;
        orderItem['运单号'] = item.internationalTrackingNumber;
        orderItem['物流公司'] = item.internationalCarrier;
        orderItem['创建日期'] = item.created.split('T')[0];
        orderItem['拣货日期'] = item.packagingTime ? item.packagingTime.split('T')[0]: '';
        packing.push(orderItem);
      }
    }

    const ws: any = utils.json_to_sheet(packing);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '拣货单号表' +
      new Date().getUTCFullYear() + '-' + (new Date().getMonth() + 1 < 10? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
      '-' +(new Date().getDate() < 10? '0' + new Date().getDate() : new Date().getDate())
      + '.xlsx');

  }

}
