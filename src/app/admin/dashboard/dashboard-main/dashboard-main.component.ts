import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {DashboardService} from "../dashboard.service";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import { graphic } from 'echarts';

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

  csCate: any;
  ceCate: any;
  psCate: any = false;
  peCate: any = false;

  options: any;

  statistics: any = {
    "totalSales": 0,
    'totalOrders': 0,
    'averageOrderValue': 0,
    'totalSoldUnits': 0,
    'refundOrder': 0,
    'refundAmounts': 0,
    'cancelOrder': 0,
    'cancelAmounts': 0
  };
  currency:string = 'INR';

  constructor(private router: Router,
              private dashboardService: DashboardService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.getCharts();
    this.getDataList();
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
    if(event.value) {
      this[type] = event.value._i.year + '-'+ (event.value._i.month+1) +'-'+event.value._i.date + ' 00:00:00';
    } else {
      this[type] = null;
    }
  }

  filterDate() {
    this.getDataList();
  }

  filterDateCate() {

  }

  resetDateCate() {
    this.psCate = null;
    this.peCate = null;
    this.csCate = null;
    this.ceCate = null;
  }

  resetDate() {
    this.psAll = null;
    this.peAll = null;
    this.csAll = null;
    this.ceAll = null;
    this.getDataList();
  }
  showEight: boolean = false;

  changeEight(flag: boolean) {
    this.showEight = flag;
  }

  getCharts() {
    const dataAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    const yMax = 1200;
    const dataShadow = [];

    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }

    this.options = {
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#999'
          }
        }
      },
      series: [
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              color: new graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: data
        }
      ]
    };
  }

}
