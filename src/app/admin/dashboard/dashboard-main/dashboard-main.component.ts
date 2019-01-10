import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {DashboardService} from "../dashboard.service";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-customer-service-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['../_dashboard.scss'],
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

export class DashboardMainComponent implements OnInit {

  overViewListCategory: any = ['Yesterday', 'Last 7 days', 'Last 14 days', 'Last 30 days', 'All Time'];
  overViewCategory: string = 'Yesterday';

  topProductListCategory: any = ['Yesterday', 'Last 7 days', 'Last 14 days', 'Last 30 days', 'All Time'];
  topProductCategory: string = 'Yesterday';

  topProductSortListCategory: any = ['Total Earnings', 'Total Orders', 'Total Sales', 'Total Pageviews', 'Total Visitors', 'Conversion Rate'];
  topProductSortCategory: string = 'Total Earnings';

  // MatPaginator Inputs
  length: number = 32;
  pageSize = 12;
  pageSizeOptions = [6, 12];

  csAll: any;
  ceAll: any;
  psAll: any = false;
  peAll: any = false;

  statistics: any = {
    "totalSales": 0,
    'totalOrders': 0,
    'averageOrderValue': 0,
    'totalSoldUnits': 0,
    'refundOrder': 0,
    'refundAmounts': 0
  };
  currency:string = 'INR';

  constructor(private router: Router,
              private dashboardService: DashboardService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {

  }

  getDataList() {
    let create_start_time: any = this.csAll? this.csAll: null;
    let create_end_time: any = this.ceAll? this.ceAll: null;
    this.dashboardService.getDataList({
      create_start_time,
      create_end_time
    }).then((data) => {
      this.statistics = data;
    });
  }

  addEvent(type: any, event:MatDatepickerInputEvent<any>) {
    this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
  }

  filterDate() {
    this.getDataList();
  }

  resetDate() {
    this.psAll = null;
    this.peAll = null;
    this.csAll = null;
    this.ceAll = null;
    this.getDataList();
  }

  textList: any = [1, 2, 3, 4, 5];


  showTwo: boolean = false;
  showSeven: boolean = false;
  showEight: boolean = false;

  changeTwo(flag: boolean) {
    this.showTwo = flag;
  }

  changeSeven(flag: boolean) {
    this.showSeven = flag;
  }

  changeEight(flag: boolean) {
    this.showEight = flag;
  }

}
