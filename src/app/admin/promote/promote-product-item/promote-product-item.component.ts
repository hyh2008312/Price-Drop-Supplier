import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PromoteService } from '../promote.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-promote-product-item',
  templateUrl: './promote-product-item.component.html',
  styleUrls: ['../_promote.scss']
})

export class ProductProductItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any={};
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'USD';

  constructor(
    private promoteService: PromoteService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

  }

}
