import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AddressService } from '../address.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { AuthenticationService } from '../../../shared/services/authentication/authentication.service';

@Component({
  selector: 'app-address-address-main',
  templateUrl: './address-main.component.html',
  styleUrls: ['../_address.scss']
})

export class AddressMainComponent implements OnInit {

  addressList: any;
  index: any;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 100;
  pageSizeOptions = [100];

  // MatPaginator Output
  changePage(event) {
    this.pageSize = event.pageSize;
    this.index = event.pageIndex + 1;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }


  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit():void {

  }

}
