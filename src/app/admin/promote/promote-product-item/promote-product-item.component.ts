import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { PromoteService } from '../promote.service';

@Component({
  selector: 'app-promote-product-item',
  templateUrl: './promote-product-item.component.html',
  styleUrls: ['../_promote.scss']
})

export class ProductProductItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any={};
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  isEdit: boolean = false;

  currency: string = 'USD';

  constructor(
    private promoteService: PromoteService
  ) { }

  ngOnInit(): void {

  }

  get price() {
    if(!isNaN(this.promote.discount)) {
      return Math.round(this.promote.productPrice * (100 - this.promote.discount)) / 100;
    } else {
      return this.promote.productPrice;
    }
  }

  delete() {
    let self = this;
    this.promoteService.deletePromotionProduct({
      id: this.promote.id
    }).then((data) => {
      this.promotionChange.emit({
        index: self.index,
        event: 'delete',
        promote: data
      });
    });
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  save() {
    let self = this;
    let params:any = this.promote;
    this.promoteService.savePromotionProduct(params).then((data) => {
      self.isEdit = false;
    });
  }
}
