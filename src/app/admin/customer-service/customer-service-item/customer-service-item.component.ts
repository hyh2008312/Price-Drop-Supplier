import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {AdminService} from '../../admin.service';
import {UserService} from '../../../shared/services/user/user.service';

@Component({
  selector: 'app-customer-service-item',
  templateUrl: './customer-service-item.component.html',
  styleUrls: ['../_customer-service.scss']
})

export class CustomerServiceItemComponent implements OnInit {
  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

  }

  jumpCustomerServiceDetail() {
    this.router.navigate(['./detail', this.product.lineId], {relativeTo: this.activatedRoute});
  }
}
