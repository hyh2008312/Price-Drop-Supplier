import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { OrderService } from '../order.service';
import { UserService } from  '../../../shared/services/user/user.service';

import {utils, write, WorkBook, read, WorkSheet} from 'xlsx';

import { saveAs } from 'file-saver';
import { AddGatiPostDialogComponent } from '../add-gati-post-dialog/add-gati-post-dialog.component';
import { AddOrderDialogComponent } from '../add-order-dialog/add-order-dialog.component';
import { UploadOrderDialogComponent } from '../upload-order-dialog/upload-order-dialog.component';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ToolTipsComponent} from '../tool-tips/tool-tips.component';

@Component({
  selector: 'app-warehouse-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['../_order.scss'],
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

export class OrderMainComponent implements OnInit {


  category: any;
  subcategory: any;
  thirdcategory: any;
  subCategoryList: any = [];
  thirdCategoryList: any = [];
  categoryList: any = [];
  categoryId: any;

  orderAll: any = false;
  orderAllIndex = 1;
  typeAll: any = false;
  paymentAll: any = false;
  orderUnpaid: any = false;
  orderUnpaidIndex = 1;
  typeUnpaid: any = false;
  paymentUpaid: any = false;
  orderPacking: any = false;
  orderPackingIndex = 1;
  typePacking: any = false;
  paymentPacking: any = false;
  orderShipped: any = false;
  orderShippedIndex = 1;
  typeShipped: any = false;
  paymentShipped: any = false;
  orderAudit: any = false;
  orderAuditIndex = 1;
  typeAudit: any = false;
  paymentAudit: any = false;
  orderCanceled: any = false;
  orderCanceledIndex = 1;
  typeCanceled: any = false;
  paymentCanceled: any = false;
  orderCompleted: any = false;
  orderCompletedIndex = 1;
  typeCompleted: any = false;
  paymentCompleted: any = false;
  orderRefund: any = false;
  orderRefundIndex = 1;
  typeRefund: any = false;
  paymentRefund: any = false;
  orderUndelivered: any = false;
  orderUndeliveredIndex = 1;
  typeUndelivered: any = false;
  paymentUndelivered: any = false;
  typeExpired: any = false;
  paymentExpired: any = false;
  orderExpired: any = false;
  orderExpiredIndex: any = 1;
  orderNotStart: any = false;
  orderNotStartIndex: any = 1;
  typeNotStart: any = false;
  paymentNotStart: any = false;

  csAll: any = false;
  ceAll: any = false;
  psAll: any = false;
  peAll: any = false;
  csUnpaid: any = false;
  ceUnpaid: any = false;
  csPacking: any = false;
  cePacking: any = false;
  psPacking: any = false;
  pePacking: any = false;
  csShipped: any = false;
  ceShipped: any = false;
  psShipped: any = false;
  peShipped: any = false;
  csAudit: any = false;
  ceAudit: any = false;
  psAudit: any = false;
  peAudit: any = false;
  csCanceled: any = false;
  ceCanceled: any = false;
  csCompleted: any = false;
  ceCompleted: any = false;
  psCompleted: any = false;
  peCompleted: any = false;
  csRefunded: any = false;
  ceRefunded: any = false;
  psRefunded: any = false;
  peRefunded: any = false;
  csUndelivered: any = false;
  ceUndelivered: any = false;
  psUndelivered: any = false;
  peUndelivered: any = false;
  csExpired: any = false;
  ceExpired: any = false;
  csNotStart: any = false;
  ceNotStart: any = false;
  psNotStart: any = false;
  peNotStart: any = false;

  typeList: any = [{
    text: 'ORDERS.TYPELIST.TITLE1',
    value: false
  }, {
    text: 'ORDERS.TYPELIST.TITLE2',
    value: 'Normal'
  }, {
    text: 'ORDERS.TYPELIST.TITLE3',
    value: 'Drop'
  }, {
    text: 'ORDERS.TYPELIST.TITLE4',
    value: 'Flash'
  }];

  paymentList: any = [{
    text: 'ORDERS.PAYMENTLIST.TITLE1',
    value: false
  }, {
    text: 'ORDERS.PAYMENTLIST.TITLE2',
    value: 'cod'
  }, {
    text: 'ORDERS.PAYMENTLIST.TITLE3',
    value: 'imprest'
  }];

  sourcingList: any = [{
    text: 'ORDERS.SOURCINGLIST.TITLE1',
    value: false
  }, {
    text: 'ORDERS.SOURCINGLIST.TITLE2',
    value: 'Not Started'
  }, {
    text: 'ORDERS.SOURCINGLIST.TITLE3',
    value: 'Address Pending Confirm'
  }, {
    text: 'ORDERS.SOURCINGLIST.TITLE4',
    value: 'Out of stock'
  }, {
    text: 'ORDERS.SOURCINGLIST.TITLE5',
    value: 'Started',
  }];

  sourcingPacking: any = false;

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any;
  isSearch: boolean = false;
  searchForm: FormGroup;

  searchType = 'ShippingNumber';
  searchTypeList = [{
    text: 'ORDERS.SEARCHTYPELIST.TITLE1',
    value: 'OrderNumber'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE2',
    value: 'ShippingNumber'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE3',
    value: 'sku'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE7',
    value: 'third_party_order_number'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE6',
    value: 'sourcing_order_number'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE4',
    value: 'username'
  }, {
    text: 'ORDERS.SEARCHTYPELIST.TITLE5',
    value: 'title'
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  isSuperuser: any = false;

  showNav: any = false;

  isLoading: boolean = false;
  isGlowRoadCancelLoading: boolean = false;
  color: any = 'accent';
  mode: any = 'indeterminate';
  value: any = 20;

  channelId: any = false;
  channelList: any;

  min: any;
  max: any;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

    this.getChannelList();

    const maxProfit = (prices) => {
      let n = prices.length;
      if(n < 2) return 0;
      let hold = new Array(n);
      let sold = new Array(n);
      hold[0] = -prices[0];
      sold[0] = 0;
      for(let i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i - 1], sold[i - 1] - prices[i]);
        sold[i] = Math.max(sold[i - 1], hold[i - 1] + prices[i]);
      }
      return sold[n - 1];

    };
  }

  onValueChanged(data) {
    this.isSearch = false;
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

    this.getCategory();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    switch (type) {
      case 0:
        this.orderAllIndex = event.pageIndex + 1;
        break;
      case 1:
        this.orderUnpaidIndex = event.pageIndex + 1;
        break;
      case 2:
        this.orderPackingIndex = event.pageIndex + 1;
        break;
      case 3:
        this.orderShippedIndex = event.pageIndex + 1;
        break;
      case 4:
        this.orderAuditIndex = event.pageIndex + 1;
        break;
      case 5:
        this.orderCanceledIndex = event.pageIndex + 1;
        break;
      case 6:
        this.orderCompletedIndex = event.pageIndex + 1;
        break;
      case 7:
        this.orderRefundIndex = event.pageIndex + 1;
        break;
      case 8:
        this.orderExpiredIndex = event.pageIndex + 1;
        break;
      // case 9:
      //   this.orderUndeliveredIndex = event.pageIndex + 1;
      //   break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeProducts(event) {
    if(event.tab) {
      this.subCategoryList = [];
      this.thirdCategoryList = [];
      this.categoryId = null;
    }
    let status: any = '';
    let page = 0;
    let order_type = this.typeUnpaid;
    let cod_status = this.paymentUpaid;
    let start_time = this.csUnpaid;
    let end_time = this.ceUnpaid;
    let paid_start_time = false;
    let paid_end_time = false;
    let sourcing_status = false;
    let order_source_channel_id: any = null;
    const search = this.searchKey && this.searchKey != ''? this.searchKey: null;
    let search_type: any = null;
    if(search) {
      search_type = this.searchType;
    }
    let low_price: any = null;
    let high_price: any = null;

    switch (event.index) {
      case 0:
        status = null;
        if(event.resetPage) {
          this.orderAllIndex = 1;
        }
        if(search) {
          this.orderAllIndex = 1;
        }
        page = this.orderAllIndex;
        order_type = this.typeAll;
        cod_status = this.paymentAll;
        start_time = this.csAll;
        end_time = this.ceAll;
        paid_start_time = this.psAll;
        paid_end_time = this.peAll;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 1:
        status = 'Unpaid';
        if(event.resetPage) {
          this.orderUnpaidIndex = 1;
        }
        if(search) {
          this.orderUnpaidIndex = 1;
        }
        page = this.orderUnpaidIndex;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 2:
        status = 'Packing';
        if(event.resetPage) {
          this.orderPackingIndex = 1;
        }
        if(search) {
          this.orderPackingIndex = 1;
        }
        page = this.orderPackingIndex;
        order_type = this.typePacking;
        cod_status = this.paymentPacking;
        start_time = this.csPacking;
        end_time = this.cePacking;
        paid_start_time = this.psPacking;
        paid_end_time = this.pePacking;
        sourcing_status = this.sourcingPacking;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 3:
        status = 'Shipped';
        if(event.resetPage) {
          this.orderShippedIndex = 1;
        }
        if(search) {
          this.orderShippedIndex = 1;
        }
        page = this.orderShippedIndex;
        order_type = this.typeShipped;
        cod_status = this.paymentShipped;
        start_time = this.csShipped;
        end_time = this.ceShipped;
        paid_start_time = this.psShipped;
        paid_end_time = this.peShipped;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 4:
        status = 'Audit canceled';
        if(event.resetPage) {
          this.orderAuditIndex = 1;
        }
        if(search) {
          this.orderAuditIndex = 1;
        }
        page = this.orderAuditIndex;
        order_type = this.typeAudit;
        cod_status = this.paymentAudit;
        start_time = this.csAudit;
        end_time = this.ceAudit;
        paid_start_time = this.psAudit;
        paid_end_time = this.peAudit;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 5:
        status = 'Canceled';
        if(event.resetPage) {
          this.orderCanceledIndex = 1;
        }
        if(search) {
          this.orderCanceledIndex = 1;
        }
        page = this.orderCanceledIndex;
        order_type = this.typeCanceled;
        cod_status = this.paymentCanceled;
        start_time = this.csCanceled;
        end_time = this.ceCanceled;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 6:
        status = 'Completed';
        if(event.resetPage) {
          this.orderCompletedIndex = 1;
        }
        if(search) {
          this.orderCompletedIndex = 1;
        }
        page = this.orderCompletedIndex;
        order_type = this.typeCompleted;
        cod_status = this.paymentCompleted;
        start_time = this.csCompleted;
        end_time = this.ceCompleted;
        paid_start_time = this.psCompleted;
        paid_end_time = this.peCompleted;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 7:
        status = 'Refunded';
        if(event.resetPage) {
          this.orderRefundIndex = 1;
        }
        if(search) {
          this.orderRefundIndex = 1;
        }
        page = this.orderRefundIndex;
        order_type = this.typeRefund;
        cod_status = this.paymentRefund;
        start_time = this.csRefunded;
        end_time = this.ceRefunded;
        paid_start_time = this.psRefunded;
        paid_end_time = this.peRefunded;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      case 8:
        if(event.resetPage) {
          this.orderExpiredIndex = 1;
        }
        if(search) {
          this.orderExpiredIndex = 1;
        }
        status = 'Expired';
        page = this.orderExpiredIndex;
        order_type = this.typeExpired;
        cod_status = this.paymentExpired;
        start_time = this.csExpired;
        end_time = this.ceExpired;
        low_price = this.min;
        high_price = this.max;
        order_source_channel_id = this.channelId;
        break;
      // case 9:
      //   status = 'Undelivered';
      //   if(event.resetPage) {
      //     this.orderUndeliveredIndex = 1;
      //   }
      //   if(search) {
      //     this.orderUndeliveredIndex = 1;
      //   }
      //   page = this.orderUndeliveredIndex;
      //   order_type = this.typeUndelivered;
      //   cod_status = this.paymentUndelivered;
      //   start_time = this.csUndelivered;
      //   end_time = this.ceUndelivered;
      //   paid_start_time = this.psUndelivered;
      //   paid_end_time = this.peUndelivered;
      //   break;
      case 9:
        status = 'Packing';
        order_type = this.typeNotStart;
        cod_status = this.paymentNotStart;
        start_time = this.csNotStart;
        end_time = this.ceNotStart;
        paid_start_time = this.psNotStart;
        paid_end_time = this.peNotStart;
        sourcing_status = this.sourcingPacking;
        break;
      default:
        break;
    }
    let self = this;

    order_type = order_type? order_type: null;
    cod_status = cod_status? cod_status: null;
    start_time = start_time? start_time: null;
    end_time = end_time? end_time: null;
    paid_start_time = paid_start_time? paid_start_time: null;
    paid_end_time = paid_end_time? paid_end_time: null;
    sourcing_status = sourcing_status? sourcing_status: null;
    order_source_channel_id = order_source_channel_id? order_source_channel_id: null;
    low_price = low_price? low_price: null;
    high_price = high_price? high_price: null;

    let category_id = this.categoryId? this.categoryId: null;

    if(event.index < 9) {
      this.orderService.getSupplyOrderList({
        status,
        page,
        page_size: this.pageSize,
        search,
        search_type,
        order_type,
        cod_status,
        start_time,
        end_time,
        paid_start_time,
        paid_end_time,
        sourcing_status,
        category_id,
        order_source_channel_id,
        low_price,
        high_price
      }).then((data) => {
        self.length = data.count;
        switch (event.index) {
          case 0:
            self.orderAll = data.results;
            break;
          case 1:
            self.orderUnpaid = data.results;
            break;
          case 2:
            self.orderPacking = data.results;
            break;
          case 3:
            self.orderShipped = data.results;
            break;
          case 4:
            self.orderAudit = data.results;
            break;
          case 5:
            self.orderCanceled = data.results;
            break;
          case 6:
            self.orderCompleted = data.results;
            break;
          case 7:
            self.orderRefund = data.results;
            break;
          case 8:
            self.orderExpired = data.results;
            break;
          // case 9:
          //   self.orderUndelivered = data.results;
          //   break;
        }
      });
    } else {
      this.isLoading = true;
      this.orderService.getSupplyOrderRecommendList({
        status,
        search,
        search_type,
        order_type,
        cod_status,
        start_time,
        end_time,
        paid_start_time,
        paid_end_time,
        sourcing_status,
        category_id
      }).then((data) => {
        switch (event.index) {
          case 9:
            self.getSKUOrders(data);
            //self.orderNotStart = data;
            break;
        }
      });
    }
  }

  clearSearchKey() {
    this.searchKey = '';
    switch (this.selectedIndex) {
      case 0:
        this.orderAllIndex = 1;
        break;
      case 1:
        this.orderUnpaidIndex = 1;
        break;
      case 2:
        this.orderPackingIndex = 1;
        break;
      case 3:
        this.orderShippedIndex = 1;
        break;
      case 4:
        this.orderAuditIndex = 1;
        break;
      case 5:
        this.orderCanceledIndex = 1;
        break;
      case 6:
        this.orderCompletedIndex = 1;
        break;
      case 7:
        this.orderRefundIndex = 1;
        break;
      case 8:
        this.orderExpiredIndex = 1;
        break;
      // case 9:
      //   this.orderUndeliveredIndex = 1;
      //   break;
      default:
        break;
    }
    this.changeProducts({
      index: this.selectedIndex
    });
  }

  productChange(event) {
    switch(event.status) {
      case 4:
        switch(event.event) {
          case 'audit':
            this.orderAudit.splice(event.index,1);
            break;
        }
    }
  }

  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    if(event.value) {
      this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
    } else {
      this[type] = null;
    }
  }

  filterDate() {
    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
  }

  export() {
    const ws_name = 'SomeSheet';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    let packing: any = [];
    let excel: any = [];
    switch (this.selectedIndex) {
      case 1:
        excel = [...this.orderUnpaid];
        break;
      case 2:
        excel = [...this.orderPacking];
        break;
      case 3:
        excel = [...this.orderShipped];
        break;
      case 4:
        excel = [...this.orderAudit];
        break;
      case 5:
        excel = [...this.orderCanceled];
        break;
      case 6:
        excel = [...this.orderCompleted];
        break;
      case 7:
        excel = [...this.orderRefund];
        break;
      case 8:
        excel = [...this.orderExpired];
        break;
      // case 9:
      //   excel = [...this.orderUndelivered];
      //   break;
      case 9:
        excel = [...this.orderNotStart];
        break;
    }

    for(let item of excel) {
      let orderItem: any = {};
      orderItem.orderNumber = item.number;
      orderItem.sumOrderNumber = item.sumOrderNumber;
      orderItem.codStatus = item.paymentMode == 'cod' ? 'Cod' : 'None-Cod';
      orderItem.mainImage = item.lines[0].mainImage;
      orderItem.variants = item.lines[0].attributes;
      orderItem.productTitle = item.lines[0].title;
      orderItem.sku = item.lines[0].sku;
      orderItem.quantity = item.lines[0].quantity;
      orderItem.created = item.created.split('T')[0];
      orderItem.username = item.username;
      orderItem.address = item.line3 + (item.line3 != ''? '' : ',') + item.line2 + ',' + item.line1;
      orderItem.city = item.city;
      orderItem.state = item.state;
      orderItem.country = item.country;
      orderItem.postcode = item.postcode;
      orderItem.phoneNumber = item.phoneNumber;
      orderItem.email = item.email;
      orderItem.paymentAmount = item.paymentAmount;
      orderItem.TrackingNumber = item.shippingNumber;
      orderItem.shippingProvider = item.shippingProvider;
      orderItem.notes = item.orderNotes;
      packing.push(orderItem);
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '订单' + new Date().getUTCFullYear() + '-' + (new Date().getMonth() + 1 < 10? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
      '-' +(new Date().getDate() < 10? '0' + new Date().getDate() : new Date().getDate()) +'.xlsx');

  }

  exportAll() {

    let status: any = '';
    let order_type = this.typeUnpaid;
    let cod_status = this.paymentUpaid;
    let start_time = this.csUnpaid;
    let end_time = this.ceUnpaid;
    let paid_start_time = false;
    let paid_end_time = false;
    let sourcing_status = false;
    let order_source_channel_id: any = null;
    const search = this.searchKey && this.searchKey != ''? this.searchKey: null;
    let search_type: any = null;
    if(search) {
      search_type = this.searchType;
    }
    let low_price = null;
    let high_price = null;

    switch (this.selectedIndex) {
      case 0:
        status = null;
        order_type = this.typeAll;
        cod_status = this.paymentAll;
        start_time = this.csAll;
        end_time = this.ceAll;
        order_source_channel_id = this.channelId;
        paid_start_time = this.psAll;
        paid_end_time = this.peAll;
        break;
      case 1:
        status = 'Unpaid';
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 2:
        status = 'Packing';
        order_type = this.typePacking;
        cod_status = this.paymentPacking;
        start_time = this.csPacking;
        end_time = this.cePacking;
        paid_start_time = this.psPacking;
        paid_end_time = this.pePacking;
        sourcing_status = this.sourcingPacking;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 3:
        status = 'Shipped';
        order_type = this.typeShipped;
        cod_status = this.paymentShipped;
        start_time = this.csShipped;
        end_time = this.ceShipped;
        paid_start_time = this.psShipped;
        paid_end_time = this.peShipped;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 4:
        status = 'Audit canceled';
        order_type = this.typeAudit;
        cod_status = this.paymentAudit;
        start_time = this.csAudit;
        end_time = this.ceAudit;
        paid_start_time = this.psAudit;
        paid_end_time = this.peAudit;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 5:
        status = 'Canceled';
        order_type = this.typeCanceled;
        cod_status = this.paymentCanceled;
        start_time = this.csCanceled;
        end_time = this.ceCanceled;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 6:
        status = 'Completed';
        order_type = this.typeCompleted;
        cod_status = this.paymentCompleted;
        start_time = this.csCompleted;
        end_time = this.ceCompleted;
        paid_start_time = this.psCompleted;
        paid_end_time = this.peCompleted;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 7:
        status = 'Refunded';
        order_type = this.typeRefund;
        cod_status = this.paymentRefund;
        start_time = this.csRefunded;
        end_time = this.ceRefunded;
        paid_start_time = this.psRefunded;
        paid_end_time = this.peRefunded;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      case 8:
        status = 'Expired';
        order_type = this.typeExpired;
        cod_status = this.paymentExpired;
        start_time = this.csExpired;
        end_time = this.ceExpired;
        order_source_channel_id = this.channelId;
        low_price = this.min;
        high_price = this.max;
        break;
      default:
        break;
    }

    order_type = order_type? order_type: null;
    cod_status = cod_status? cod_status: null;
    start_time = start_time? start_time: null;
    end_time = end_time? end_time: null;
    paid_start_time = paid_start_time? paid_start_time: null;
    paid_end_time = paid_end_time? paid_end_time: null;
    sourcing_status = sourcing_status? sourcing_status: null;
    order_source_channel_id = order_source_channel_id? order_source_channel_id: null;
    low_price = low_price? low_price: null;
    high_price = high_price? high_price: null;

    let category_id = this.categoryId? this.categoryId: null;

    this.orderService.getAllOrderList({
      status,
      search,
      search_type,
      order_type,
      cod_status,
      start_time,
      end_time,
      paid_start_time,
      paid_end_time,
      sourcing_status,
      category_id,
      order_source_channel_id,
      low_price,
      high_price
    }).then((res) => {
      const ws_name = 'SomeSheet';
      const wb: WorkBook = { SheetNames: [], Sheets: {} };
      let packing: any = [];
      let excel: any = [...res];

      for(let item of excel) {
        let orderItem: any = {};
        orderItem.orderNumber = item.number;
        orderItem.phoneNumber = item.phoneNumber;
        orderItem.orderStatus = item.orderStatus;
        orderItem.codStatus = item.paymentMode == 'cod' ? 'Cod' : 'None-Cod';
        orderItem.productTitle = item.title;
        orderItem.sku = item.sku;
        orderItem.quantity = item.quantity;
        orderItem.paidTime = item.paidTime? item.paidTime.split('T')[0]: '';
        orderItem.username = item.username;
        orderItem.address = item.address;
        orderItem.city = item.city;
        orderItem.state = item.state;
        packing.push(orderItem);
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

      saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'orders' + new Date().getUTCFullYear() + '-' + (new Date().getMonth() + 1 < 10? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
        '-' +(new Date().getDate() < 10? '0' + new Date().getDate() : new Date().getDate()) +'.xlsx');
    });

  }

  createTracking() {
    let dialogRef = this.dialog.open(AddGatiPostDialogComponent, {
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        if(this.selectedIndex == 2) {
          this.orderShippedIndex = 1;
        }
        this.changeProducts({
          index: this.selectedIndex
        });
      }
    });
  }

  createOrder() {
    let dialogRef = this.dialog.open(AddOrderDialogComponent, {
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.changeProducts({
          index: this.selectedIndex
        });
      }
    });
  }

  typeChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.typeAll = $event;
        break;
      case 1:
        this.typeUnpaid = $event;
        break;
      case 2:
        this.typePacking = $event;
        break;
      case 3:
        this.typeShipped = $event;
        break;
      case 4:
        this.typeAudit = $event;
        break;
      case 5:
        this.typeCanceled = $event;
        break;
      case 6:
        this.typeCompleted = $event;
        break;
      case 7:
        this.typeRefund = $event;
        break;
      case 8:
        this.typeExpired = $event;
        break;
      // case 9:
      //   this.typeUndelivered = $event;
      //   break;
      case 9:
        this.typeNotStart = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
  }

  paymentChange($event) {
    switch (this.selectedIndex) {
      case 0:
        this.paymentAll = $event;
        break;
      case 1:
        this.paymentUpaid = $event;
        break;
      case 2:
        this.paymentPacking = $event;
        break;
      case 3:
        this.paymentShipped = $event;
        break;
      case 4:
        this.paymentAudit = $event;
        break;
      case 5:
        this.paymentCanceled = $event;
        break;
      case 6:
        this.paymentCompleted = $event;
        break;
      case 7:
        this.paymentRefund = $event;
        break;
      case 8:
        this.paymentExpired = $event;
        break;
      // case 9:
      //   this.paymentUndelivered = $event;
      //   break;
      case 9:
        this.paymentNotStart = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
  }

  sourcingChange($event) {
    switch (this.selectedIndex) {
      case 2:
        this.sourcingPacking = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
  }

  channelChange($event) {
    this.channelId = $event;

    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
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
        this.subCategoryList = [];
      }
      this.thirdCategoryList = [];
    }
    this.categoryId = $event;
    this.changeProducts({index: this.selectedIndex, resetPage: true});
  }

  priceChange() {
    this.changeProducts({
      index: this.selectedIndex,
      resetPage: true
    });
  }

  subCategoryChange($event) {
    if(this.subCategoryList.length > 0) {
      let index = this.subCategoryList.findIndex((data) => {
        if(data.id == $event) {
          return true;
        }
      });
      if(this.subCategoryList[index] && this.subCategoryList[index].children) {
        this.thirdCategoryList = [...this.subCategoryList[index].children];
      } else {
        this.thirdCategoryList = [];
      }
    }
    this.categoryId = $event;
    this.changeProducts({index: this.selectedIndex, resetPage: true});
  }

  thirdCategoryChange($event) {
    this.categoryId = $event;
    this.changeProducts({index: this.selectedIndex, resetPage: true});
  }

  getCategory() {
    this.orderService.getCategoryList().then((data) => {
      this.categoryList = [...data];
      this.categoryList.unshift({
        id: false,
        data: {
          name: 'All'
        }
      })
    });
  }

  scrollChange($event) {
    this.showNav = $event;
  }

  getSKUOrders(res) {
    let skus: any = {};
    for (let item of res) {
      if (!skus[item.lines[0].sku]) {
        skus[item.lines[0].sku] = {};
        skus[item.lines[0].sku].itms = [];
        skus[item.lines[0].sku].itms.push(item);
      } else {
        skus[item.lines[0].sku].itms.push(item);
      }
    }

    let sku: any = [];
    for( let key in skus) {
      sku.push(key);
    }

    this.orderService.getSkuInventoryList({
      sku
    }).then((data) => {
      let orderNotStart: any = [];
      for(let item of data) {
        const orders = skus[item.sku].itms;
        let inventory: any = item.warehouseInventory;
        inventory.sort((a, b) => {
          return (b.quantity - b.freezeQuantity) < (a.quantity - a.freezeQuantity)
        });
        for(let im of orders) {
          let isReocommend: any = false;
          for (let g of inventory) {
            if(im.lines[0].quantity <= g.quantity - g.freezeQuantity) {
              g.quantity -= im.lines[0].quantity;
              im.recommendWarehouse = g;
              isReocommend = true;
              break;
            }
          }
          if(isReocommend) {
            orderNotStart.push(im);
          }
        }
      }

      let orderEmail: any = {};
      for (let item of orderNotStart) {
        if (!orderEmail[item.email]) {
          orderEmail[item.email] = {};
          orderEmail[item.email].itms = [];
          orderEmail[item.email].itms.push(item);
        } else {
          orderEmail[item.email].itms.push(item);
        }
      }
      this.orderNotStart = [];
      for(let key in orderEmail) {
        for(let im of orderEmail[key].itms) {
          this.orderNotStart.push(im);
        }
      }
      this.length = this.orderNotStart.length;
      this.isLoading = false;
    });
  }

  getChannelList() {
    this.orderService.getChannelList().then((data) => {
      this.channelList = [...data];
      this.channelList.unshift({
        id: '0',
        name: 'PriceDrop'
      });
      this.channelList.unshift({
        id: false,
        name: 'ORDERS.TITLE1'
      });
    });
  }

  cancelGlowRoad(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, {type: 'binary'});


      this.getSheets2(wb);

    };
    reader.readAsBinaryString(target.files[0]);
  }


  cancelGlowRoadOrder(orders) {
    this.isGlowRoadCancelLoading = true;
    this.orderService.cancelOrders({orders}).then((data) => {
      this.isGlowRoadCancelLoading = false;
      this.openSnackBar('GlowRoad orders are successfully cancelled');
      this.changeProducts({
        index: this.selectedIndex,
        resetPage: true
      });
    }).catch((res) => {
      this.isGlowRoadCancelLoading = false;
      this.openSnackBar('Some Error');
    });
  }

  getSheets2(wb) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    /* save data */
    const newData: any = <any[][]>(utils.sheet_to_json(ws, {header: 1}));

    let orders = {};
    for(let i = 0; i < newData.length; i++) {
      const item = newData[i];
      if(i > 0) {
        if(!orders[item[0]]) {
          orders[item[0]] = {};
          orders[item[0]].thirdOrderNumber = item[0];
        }
      }
    }

    let data = [];
    for(let k in orders) {
      data.push(k);
    }

    this.cancelGlowRoadOrder(data);

  }

  openSnackBar(str) {
    this.snackBar.openFromComponent(ToolTipsComponent, {
      data: str,
      duration: 4000,
      verticalPosition: 'top'
    });
  }

  uploadOrders() {
    let dialogRef = this.dialog.open(UploadOrderDialogComponent, {
      data: {
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.data.isEdit == true) {
        this.changeProducts({
          index: this.selectedIndex,
          resetPage: true
        });
      }
    });
  }

}
