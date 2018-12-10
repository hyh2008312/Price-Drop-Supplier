import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { OrderService } from '../order.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';
import { AddGatiPostDialogComponent } from '../add-gati-post-dialog/add-gati-post-dialog.component';

import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-order-main',
  templateUrl: './order-main.component.html',
  styleUrls: ['../order.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'en'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})

export class OrderMainComponent implements OnInit {


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

  typeList: any = [{
    text: 'All',
    value: false
  }, {
    text: 'Normal',
    value: 'Normal'
  }, {
    text: 'Cut',
    value: 'Cut'
  }, {
    text: 'Flash',
    value: 'Flash'
  }];
  paymentList: any = [{
    text: 'All',
    value: false
  }, {
    text: 'Cod',
    value: 'cod'
  }, {
    text: 'Prepaid',
    value: 'imprest'
  }];

  sourcingList: any = [{
    text: 'All',
    value: false
  }, {
    text: 'Not Started',
    value: 'Not Started'
  }, {
    text: 'Started',
    value: 'Started'
  }];

  sourcingPacking: any = false;

  selectedIndex: number = 0;
  subscription: any;

  searchKey: any = '';
  searchPackingKey: any = '';
  isSearch: boolean = false;
  isSearchResult: boolean = false;
  isSearchPackingResult: boolean = false;
  searchResult: any;
  searchForm: FormGroup;
  searchPackingForm: FormGroup;

  searchCategory = 'OrderNumber';
  searchList = [{
    text: 'Order Number',
    value: 'OrderNumber'
  },{
    text: 'Tracking Number',
    value: 'ShippingNumber'
  },{
    text: 'Product Title',
    value: 'title'
  },{
    text: 'SKU',
    value: 'sku'
  }];

  searchType = 'sku';
  searchTypeList = ['sku','username','title'];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  isSuperuser: any = false;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      searchKey: ['']
    });

    this.searchPackingForm = this.fb.group({
      searchPackingKey: ['']
    });

    this.searchForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

  }

  onValueChanged(data) {
    this.isSearch = false;
  }

  clearSearchKey() {
    this.searchKey = '';
    this.orderAllIndex = 1;
    this.changeProducts({
      index: this.selectedIndex
    });
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
        this.orderUndeliveredIndex = event.pageIndex + 1;
        break;
      case 8:
        this.orderExpiredIndex = event.pageIndex + 1;
        break;
    }
    this.changeProducts({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeReturnRequest($event) {
    this.changeProducts({
      index: 3
    });
  }

  changeProducts(event) {
    let status: any = '';
    let page = 0;
    let order_type = this.typeUnpaid;
    let cod_status = this.paymentUpaid;
    let start_time = this.csUnpaid;
    let end_time = this.ceUnpaid;
    let paid_start_time = false;
    let paid_end_time = false;
    let sourcing_status = false;
    switch (event.index) {
      case 0:
        status = null;
        page = this.orderAllIndex;
        order_type = this.typeAll;
        cod_status = this.paymentAll;
        start_time = this.csAll;
        end_time = this.ceAll;
        break;
      case 1:
        status = 'Unpaid';
        page = this.orderUnpaidIndex;
        break;
      case 2:
        status = 'Packing';
        page = this.orderPackingIndex;
        order_type = this.typePacking;
        cod_status = this.paymentPacking;
        start_time = this.csPacking;
        end_time = this.cePacking;
        paid_start_time = this.psPacking;
        paid_end_time = this.pePacking;
        sourcing_status = this.sourcingPacking;
        break;
      case 3:
        status = 'Shipped';
        page = this.orderShippedIndex;
        order_type = this.typeShipped;
        cod_status = this.paymentShipped;
        start_time = this.csShipped;
        end_time = this.ceShipped;
        paid_start_time = this.psShipped;
        paid_end_time = this.peShipped;
        break;
      case 4:
        status = 'Audit canceled';
        page = this.orderAuditIndex;
        order_type = this.typeAudit;
        cod_status = this.paymentAudit;
        start_time = this.csAudit;
        end_time = this.ceAudit;
        paid_start_time = this.psAudit;
        paid_end_time = this.peAudit;
        break;
      case 5:
        status = 'Canceled';
        page = this.orderCanceledIndex;
        order_type = this.typeCanceled;
        cod_status = this.paymentCanceled;
        start_time = this.csCanceled;
        end_time = this.ceCanceled;
        break;
      case 6:
        status = 'Completed';
        page = this.orderCompletedIndex;
        order_type = this.typeCompleted;
        cod_status = this.paymentCompleted;
        start_time = this.csCompleted;
        end_time = this.ceCompleted;
        paid_start_time = this.psCompleted;
        paid_end_time = this.peCompleted;
        break;
      case 7:
        status = 'Refunded';
        page = this.orderRefundIndex;
        order_type = this.typeRefund;
        cod_status = this.paymentRefund;
        start_time = this.csRefunded;
        end_time = this.ceRefunded;
        paid_start_time = this.psRefunded;
        paid_end_time = this.peRefunded;
        break;
      case 8:
        status = 'Undelivered';
        page = this.orderUndeliveredIndex;
        order_type = this.typeUndelivered;
        cod_status = this.paymentUndelivered;
        start_time = this.csUndelivered;
        end_time = this.ceUndelivered;
        paid_start_time = this.psUndelivered;
        paid_end_time = this.peUndelivered;
        break;
      case 9:
        status = 'Expired';
        page = this.orderExpiredIndex;
        order_type = this.typeExpired;
        cod_status = this.paymentExpired;
        start_time = this.csExpired;
        end_time = this.ceExpired;
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
    const q = this.searchKey && this.searchKey != ''? this.searchKey: null;

    this.orderService.getSupplyOrderList({
      status,
      page,
      page_size: this.pageSize,
      q,
      order_type,
      cod_status,
      start_time,
      end_time,
      paid_start_time,
      paid_end_time,
      sourcing_status
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
          self.orderUndelivered = data.results;
          break;
        case 9:
          self.orderExpired = data.results;
          break;
      }
    });

  }

  searchResultProducts() {
    let self = this;
    self.isSearchResult = true;

    this.orderService.getSupplyOrderResult({
      number: this.searchKey,
      type: this.searchCategory
    }).then((data) => {
      self.length = data.length;
      self.orderAll = [...data];
    });
  }

  searchPackingResult() {
    let self = this;
    self.isSearchPackingResult = true;

    if(self.searchPackingKey == '') return;

    let status = 'Packing';
    switch (self.selectedIndex) {
      case 0:
        status = 'All';
        break;
      case 1:
        status = 'Unpaid';
        break;
      case 3:
        status = 'Shipped';
        break;
      case 4:
        status = 'Audit canceled';
        break;
      case 5:
        status = 'Canceled';
        break;
      case 6:
        status = 'Completed';
        break;
      case 7:
        status = 'Refunded';
        break;
      case 8:
        status = 'Undelivered';
        break;
      case 8:
        status = 'Expired';
        break;
    }

    let params: any = {
      status,
      sku: self.searchPackingKey
    };

    switch(this.searchCategory) {
      case 'username':
        params = {
          status,
          username: self.searchPackingKey
        };
        break;
      case 'title':
        params = {
          status,
          title: self.searchPackingKey
        };
        break;
    }

    this.orderService.getSupplyOrderPackingResult(params).then((data) => {

      self.length = data.length;

      switch (self.selectedIndex) {
        case 0:
          self.orderAll = [...data];
          break;
        case 1:
          self.orderUnpaid = [...data];
          break;
        case 2:
          self.orderPacking = [...data];
          break;
        case 3:
          self.orderShipped = [...data];
          break;
        case 4:
          self.orderAudit = [...data];
          break;
        case 5:
          self.orderCanceled = [...data];
          break;
        case 6:
          self.orderCompleted = [...data];
          break;
        case 7:
          self.orderRefund = [...data];
          break;
        case 8:
          self.orderUndelivered = [...data];
          break;
        case 9:
          self.orderExpired = [...data];
          break;
      }
    });
  }

  clearSearchPackingKey() {
    this.searchPackingKey = '';
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
    this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
  }

  filterDate() {
    this.changeProducts({
      index: this.selectedIndex
    });
  }

  export(): void {
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
        excel = [...this.orderUndelivered];
        break;
      case 9:
        excel = [...this.orderExpired];
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'exported.xlsx');

  }

  createTracking() {
    let dialogRef = this.dialog.open(AddGatiPostDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
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
        this.typeUndelivered = $event;
        break;
      case 9:
        this.typeExpired = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex
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
        this.paymentUndelivered = $event;
        break;
      case 9:
        this.paymentExpired = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex
    });
  }

  sourcingChange($event) {
    switch (this.selectedIndex) {
      case 2:
        this.sourcingPacking = $event;
        break;
    }

    this.changeProducts({
      index: this.selectedIndex
    });
  }
}
