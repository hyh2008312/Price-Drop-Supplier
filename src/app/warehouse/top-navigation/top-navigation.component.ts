import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { WarehouseService } from '../warehouse.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-warehouse-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./_top-navigation.scss']
})

export class TopNavigationComponent implements OnInit {

  contents = [{
    id: 0,
    text: '首页',
    router: './home',
    isActive: false,
    staff: false
  }];

  accounts = [
    {
      id: 1,
      text: '退出',
      router: '/account/login',
      isActive: false
    }
  ];

  isSuperuser: boolean = false;

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private adminService: WarehouseService,
      private useService: UserService
  ) {
    this.useService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });

  }

  ngOnInit(): void {
    let url = this.router.routerState.snapshot['url'].split('/warehouse');
    for (let value of this.contents) {
      if (!value.router) {
      } else {
        if (url[1] && value.router && value.router != '' && value.router.split('.')[1] == url[1]) {
          value.isActive = true;
          break;
        }
      }
    }
  }

  changeShowMenu(isShow: boolean): void {
    if (isShow) {
      document.getElementById('account-menu').style.overflowY = 'visible';
    } else {
      document.getElementById('account-menu').style.overflowY = 'hidden';
    }
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

  changeAccount(obj: any, index: number) {
    this.changeShowMenu(false);
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

  changeInnerSlide(isShow) {
    if (isShow) {
      document.getElementById('user-menu').style.overflowY = 'visible';
    } else {
      document.getElementById('user-menu').style.overflowY = 'hidden';
    }
  }

  changeInnerToggle(list, index) {
    this.changeInnerSlide(false);
    for (let value of this.accounts) {
      if (value.id != list.id) {
        value.isActive = false;
      }
    }
    if (list.slide) {
      list.isActive = !list.isActive;
    } else {
      list.isActive = true;
    }

    if (list.router) {
      this.router.navigate([`${list.router}`], {relativeTo: this.activatedRoute});
    }
  }
}