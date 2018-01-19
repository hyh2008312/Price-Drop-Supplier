import { Component, OnInit, OnDestroy, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['../order.scss']
})

export class OrderDetailComponent implements OnInit {

  order: any = {};

  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params['id'];
    this.adminService.getSupplyOrderDetail({
      id
    }).then((data) => {
      console.log(data);
      this.order = data;
    });
  }

}
