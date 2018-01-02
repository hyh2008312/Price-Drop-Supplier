import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-detail-tracking-item',
  templateUrl: './order-detail-tracking-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderDetailTrackingItemComponent implements OnInit {



  constructor(

  ) { }

  ngOnInit(): void {

  }

}
