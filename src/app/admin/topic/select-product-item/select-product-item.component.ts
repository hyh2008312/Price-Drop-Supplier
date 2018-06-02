import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { TopicService } from '../topic.service';

@Component({
  selector: 'app-promote-select-product-item',
  templateUrl: './select-product-item.component.html',
  styleUrls: ['../_topic.scss']
})

export class SelectProductItemComponent implements OnInit {

  @Input() promote: any={};
  @Input() index: any = 0;
  @Input() promoteId: any;
  @Output() promoteChange = new EventEmitter<any>();

  currency: string = 'USD';

  constructor(
    private promoteService: TopicService
  ) { }

  ngOnInit(): void {

  }

  selectPromotionProduct() {
    let params: any ={};
    params.id = this.promoteId;
    params.products = [this.promote.id];

    this.promoteService.addPromotionProduct(params).then(((data) => {
      this.promote = data;
      this.promoteChange.emit({
        index: this.index,
        promote : data,
        event: 'changed'
      });
    }));
  }

  countOff (s, o) {
    if (o > 0) {
      return Math.floor((o - s) / o * 100) + '% OFF'
    } else {
      return ''
    }
  }

}
