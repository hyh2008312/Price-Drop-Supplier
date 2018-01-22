import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { OrderService } from '../order.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['../order.scss']
})

export class OrderDetailComponent implements OnInit {

  order: any = {};
  shippingAddress: any;
  shippingPrice: any = {};

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params['id'];
    this.orderService.getSupplyOrderDetail({
      id
    }).then((data) => {
      this.order = data;
      if(data.shippingAddress) {
        this.shippingAddress = data.shippingAddress;
      }
      if(data.shippingPrice) {
        this.shippingPrice = data.shippingPrice;
      }
    });
  }

}
