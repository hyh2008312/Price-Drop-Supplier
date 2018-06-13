import { Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() order: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {


  }

  delete() {
    let self = this;


  }

  publish() {
    let self = this;


  }

  unpublish() {
    let self = this;


  }

  edit() {
    let tab = '';
    switch (this.status) {
      case 0:
        tab = 'publish';
        break;
      case 1:
        tab = 'draft';
        break;
      case 2:
        tab = 'unpublish';
        break;
    }
  }
}
