import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { LotteryService } from '../lottery.service';
import { UserService } from  '../../../shared/services/user/user.service';

import { utils, write, WorkBook } from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-lottery-main',
  templateUrl: './lottery-main.component.html',
  styleUrls: ['../_lottery.scss']
})

export class LotteryMainComponent implements OnInit {


  award: any = [{
    id: 1,
    title: 1111,
    mainImage: '',
    saleUnitPrice: 111.00,
    lowestPrice: 0,
    costPrice: 0,
    unitPrice: 111.00
  }];

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 50;
  pageSizeOptions = [50];

  constructor(
    private lotteryService: LotteryService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit():void {
  }

  ngOnDestroy() {

  }

  // MatPaginator Output
  changePage(event, type) {
    this.pageSize = event.pageSize;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  changeProducts($event) {

  }

  productChange($event) {

  }

}
