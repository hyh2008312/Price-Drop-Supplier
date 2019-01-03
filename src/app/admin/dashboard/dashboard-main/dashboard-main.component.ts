import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {DashboardService} from "../dashboard.service";

@Component({
  selector: 'app-customer-service-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['../_dashboard.scss']
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


  textList: any = [1, 2, 3, 4, 5];


  showTwo: boolean = false;
  showSeven: boolean = false;
  showEight: boolean = false;


  constructor(private router: Router,
              private dashboardService: DashboardService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {

  }

  ngOnInit(): void {

  }

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
