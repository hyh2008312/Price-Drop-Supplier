import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AdminService} from '../admin.service';
import {UserService} from '../../shared/services/user/user.service';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./_top-navigation.scss']
})

export class TopNavigationComponent implements OnInit {

  contents = [{
    id: 0,
    text: '首页',
    router: './dashboard',
    isActive: false
  }, {
    id: 1,
    text: '产品',
    router: './product',
    isActive: false
  }, {
    id: 2,
    text: '促销',
    router: './promote',
    isActive: false
  }, {
    id: 3,
    text: '订单',
    router: './order',
    isActive: false
  }, {
    id: 4,
    text: '客服',
    router: './customerService',
    isActive: false
  }, {
    id: 5,
    text: '报告',
    router: './report',
    isActive: false
  }, {
    id: 6,
    text: '业绩',
    isActive: false
  }, {
    id: 7,
    text: '通知',
    isActive: false
  }];

  accounts = [
    {
      id: 0,
      text: 'Payment Settings',
      router: './account/paymentsettings',
      isActive: false
    },
    {
      id: 1,
      text: 'Account Balance',
      router: './account/balance',
      isActive: false
    },
    {
      id: 2,
      text: 'Disputes',
      router: './account/balance',
      isActive: false
    },
    {
      id: 4,
      text: 'Settings',
      router: './account/balance',
      isActive: false
    },
    {
      id: 5,
      text: 'Logout',
      router: './account/balance',
      isActive: false
    }
  ];


  //是否显示我的账户的东西
  isShowMenu: boolean = false;

  //区分为是导航选项 && 还是账户选项

  isAccountNavigation: boolean = false;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private adminService: AdminService,
      private useService: UserService
  ) {
    this.useService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.contents.push({
            id: 8,
            text: '用户审核',
            router: './user',
            isActive: false
          })
        }
      }
    })
  }

  ngOnInit(): void {
  }

  changeShowMenu(isShow: boolean): void {
    if (isShow) {
      document.getElementById('account-menu').style.overflowY = 'visible';
    } else {
      document.getElementById('account-menu').style.overflowY = 'hidden';
    }
  }

  changeSlide(obj: any, index: number) {
    this.isAccountNavigation = false;
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

  changeAccount(obj: any, index: number) {
    this.changeShowMenu(false);
    this.isAccountNavigation = true;
    for (let value of this.accounts) {
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
