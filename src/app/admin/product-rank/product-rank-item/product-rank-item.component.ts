import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProductRankService } from '../product-rank.service';

@Component({
  selector: 'app-admin-product-rank-item',
  templateUrl: './product-rank-item.component.html',
  styleUrls: ['../_product-rank.scss']
})

export class ProductRankItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any={};
  @Input() promoteId: any;
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  isEdit: boolean = false;

  currency: string = 'INR';

  constructor(
    private dialog: MatDialog,
    private promoteService: ProductRankService
  ) { }

  ngOnInit(): void {

  }

  get price() {
    if(this.promote.discount <= 100 &&  this.promote.discount > 0) {
      return this.promote.productPrice * this.promote.discount / 100;
    } else {
      return this.promote.productPrice;
    }
  }

  add() {
    let self = this;
    this.promoteService.addProduct({
      id: this.promote.id
    }).then((data) => {
      this.promotionChange.emit({
        status: self.status,
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
      self.promotionChange.emit({
        status: self.status,
        index: self.index,
        event: 'save',
        promote: data
      });
    });
  }

}
