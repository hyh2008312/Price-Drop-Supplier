import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {DashboardService} from "../dashboard.service";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

import {CategoryListDialogComponent} from "../category-list-dialog/category-list-dialog.component";

import { graphic } from 'echarts';
import {AddOrderStockDialogComponent} from '../../order/add-order-stock-dialog/add-order-stock-dialog.component';
import {MatDialog} from '@angular/material';

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

  csPro: any;
  cePro: any;
  psPro: any = false;
  pePro: any = false;

  loadingOpts = {
    text: 'Loading',
    color: '#00bdfc',
    textColor: '#ff0000',
    maskColor: 'rgba(255, 255, 255, 0.6)',
    zlevel: 0
  };

  options: any = {
    tooltip : {
      trigger: 'axis'
    },
    xAxis: {
      axisLabel: {
        textStyle: {
          color: '#919aa7'
        }
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#48b',
          width: 1,
          type: 'solid'
        }
      }
    },
    yAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#48b',
          width: 1,
          type: 'solid'
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#919aa7'
        }
      }
    }
  };

  options1: any;

  categoryList: any = [];
  subCategoryList: any = [];
  thirdCategoryList: any = [];

  statistics: any = {
    "totalSales": 0,
    'totalOrders': 0,
    'averageOrderValue': 0,
    'totalSoldUnits': 0,
    'refundOrder': 0,
    'refundAmounts': 0,
    'canceledSingular': 0,
    'canceledAmount': 0
  };
  currency:string = 'INR';

  isCateLoading: any = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.getCharts();
    this.getCharts1();
    this.getDataList();
    this.getCategory();
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

    this.isCateLoading = true;
    this.dashboardService.getCategoryMainProductList().then((res) => {
      const dataAxis = [];
      const data = [];
      const dataShow = [];

      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        dataAxis.push(item.name);
        data.push(item.count);
        dataShow.push({
          name: item.name,
          value: item.count,
          xAxis: i,
          yAxis: item.count
        });
      }

      this.options = {
        tooltip : {
          trigger: 'item'
        },
        xAxis: {
          data: dataAxis,
          axisLabel: {
            interval: 0,
            textStyle: {
              color: 'rgba(0,0,0,0.87)'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#48b',
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#48b',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: 'rgba(0,0,0,0.87)'
            }
          }
        },
        series: [{
          name: 'Number of listings by Category',
          type: 'bar',
          barWidth: '32',
          symbol: 'droplet',
          showSymbol: true,
          hoverAnimation: false,
          data: data,
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              ),
              barBorderRadius: [16, 16, 0, 0]
            },
            emphasis: {
              color: new graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              ),
              barBorderRadius: [16, 16, 0, 0]
            }
          },
          markPoint: {
            large: true,
            data: dataShow,
            itemStyle: {
              normal: {
                color: '#663eb1'
              }
            }
          }
        }]
      };
      this.isCateLoading = false;
    });

  }

  getCharts1() {
    const dataAxis = ['Jewellery & Watches', 'Jewellery & Watches', 'Jewellery & Watches', 'Jewellery & Watches', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'Coats & Jackets', 'RCoats & Jackets', 'Coats & Jackets', 'Coats & Jackets'];
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    const yMax = 1200;
    const dataShadow = [];
    const dataShow = [];

    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
      dataShow.push({
        name: dataAxis[i],
        value: data[i],
        xAxis: i,
        yAxis: data[i]
      });
    }

    this.options1 = {
      tooltip : {
        trigger: 'axis'
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          textStyle: {
            color: '#919aa7'
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#48b',
            width: 1,
            type: 'solid'
          }
        }
      },
      yAxis: {
        axisLine: {
          show: true,
          lineStyle: {
            color: '#48b',
            width: 1,
            type: 'solid'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#919aa7'
          }
        }
      },
      series: [{
        name: 'Product Number',
        type: 'line',
        barWidth: '10',
        showSymbol: true,
        hoverAnimation: false,
        data: data,
        itemStyle: {
          normal: {
            color: '#663eb1'
          }
        },
        markPoint: {
          large: true,
          data: dataShow
        }
      }]
    };
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

  }

  thirdCategoryChange($event) {

  }

  getCategory() {
    this.dashboardService.getCategoryList().then((data) => {
      this.categoryList = [...data];
      this.categoryList.unshift({
        id: false,
        data: {
          name: 'All'
        }
      })
    });
  }

  openDialog() {
    let dialogRef = this.dialog.open(CategoryListDialogComponent, {
      data: {}
    });

    let self = this;

    dialogRef.afterClosed().subscribe(result => {

    });
  }


}
