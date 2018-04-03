import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { PromoteService } from '../promote.service';

@Component({
  selector: 'app-promote-select-product-item',
  templateUrl: './select-product-item.component.html',
  styleUrls: ['../_promote.scss']
})

export class SelectProductItemComponent implements OnInit {

  @Input() promote: any={};
  @Output() promoteChange = new EventEmitter<any>();

  currency: string = 'USD';

  constructor(
    private promoteService: PromoteService
  ) { }

  ngOnInit(): void {

  }

}
