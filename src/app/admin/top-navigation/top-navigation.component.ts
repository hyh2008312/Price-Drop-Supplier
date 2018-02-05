import {Input, Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Observable} from 'rxjs/Observable';

import {AdminService} from '../admin.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.scss']
})

export class TopNavigationComponent implements OnInit {

  contents = [{
    id: 0,
    text: '首页',
    isActive: false
  }, {
    id: 1,
    text: '产品',
    router: './product',
    isActive: false
  }, {
    id: 2,
    text: '促销',
    isActive: false
  }, {
    id: 3,
    text: '订单',
    router: './order',
    isActive: false
  }, {
    id: 4,
    text: '客服问题',
    router: './customerService',
    isActive: false
  }, {
    id: 5,
    text: '业绩',
    isActive: false
  }, {
    id: 6,
    text: '通知',
    isActive: false
  }];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private adminService: AdminService) {
  }

  ngOnInit(): void {

  }

  changeSlide(obj: any, index: number) {

    for (let value of this.contents) {
      if (value.id != obj.id) {
        value.isActive = false;
      }
    }
    if (obj.slide) {
      obj.isActive = !obj.isActive;
    } else {
      obj.isActive = true;
    }
    if (obj.router) {
      this.router.navigate([`${obj.router}`], {relativeTo: this.activatedRoute});
    }
  }

}
