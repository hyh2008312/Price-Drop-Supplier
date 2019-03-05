import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';

import { HotProductService } from '../hot-product.service';

@Component({
  selector: 'app-admin-hot-product-promote-product-item',
  templateUrl: './promote-product-item.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class PromoteProductItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any={};
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  isEdit: boolean = false;

  currency: string = 'INR';

  constructor(
    private dialog: MatDialog,
    private promoteService: HotProductService
  ) { }

  ngOnInit(): void {

  }


  delete() {
    let self = this;
    this.promoteService.deleteProduct({
      id: this.promote.productId
    }).then((data) => {
      this.promotionChange.emit({
        status: self.status,
        index: self.index,
        event: 'delete',
        promote: data
      });
    });
  }

}
