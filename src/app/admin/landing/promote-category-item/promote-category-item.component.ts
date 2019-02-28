import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';

import { LandingService } from '../landing.service';

@Component({
  selector: 'app-landing-promote-category-item',
  templateUrl: './promote-category-item.component.html',
  styleUrls: ['../_landing.scss']
})

export class ProductCategoryItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any={};
  @Input() promoteId: any;
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  isEdit: boolean = false;

  currency: string = 'INR';

  constructor(
    private dialog: MatDialog,
    private promoteService: LandingService
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

  delete() {
    let self = this;
    this.promoteService.deletePromotionCategory({
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



}
