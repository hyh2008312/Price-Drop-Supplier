import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {AdminService} from '../../admin.service';
import {UserService} from '../../../shared/services/user/user.service';
import {AccountService} from "../user.service";

@Component({
  selector: 'app-admin-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['../_user.scss']
})

export class UserMainComponent implements OnInit {

  accounts: any = [];

  selectedIndex: any = 0;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 12;
  pageSizeOptions = [12];

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
    this.changeLists({index: type});
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  constructor(private router: Router,
              private accountService: AccountService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

  }

  changeLists($event) {

  }
}
