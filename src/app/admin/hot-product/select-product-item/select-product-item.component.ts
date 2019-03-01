import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { HotProductService } from '../hot-product.service';

@Component({
  selector: 'app-promote-select-product-item',
  templateUrl: './select-product-item.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class SelectProductItemComponent implements OnInit {

  @Input() promote: any={};
  @Input() index: any = 0;
  @Input() categoryId: any;
  @Output() promoteChange = new EventEmitter<any>();

  currency: string = 'INR';
  error: any = false;

  constructor(
    private promoteService: HotProductService
  ) { }

  ngOnInit(): void {

  }

  selectPromotionProduct() {
    let params: any ={};
    params.id = this.promote.id;

    this.promoteService.addProduct(params).then(((data) => {

      if(data && data.status == 'success') {
        this.promote = data;
        this.promoteChange.emit({
          index: this.index,
          promote : data,
          event: 'changed'
        });
      } else {
        this.promoteChange.emit({
          index: this.index,
          promote: data.detail,
          event: 'error'
        });
      }

    })).catch((data) => {
      this.promoteChange.emit({
        index: this.index,
        promote: data,
        event: 'error'
      });
    });
  }


}
