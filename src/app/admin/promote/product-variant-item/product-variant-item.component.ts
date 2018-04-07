import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { PromoteService } from '../promote.service';

@Component({
  selector: 'app-promote-change-variant-item',
  templateUrl: './product-variant-item.component.html',
  styleUrls: ['../_promote.scss']
})

export class ProductVariantItemComponent implements OnInit {

  @Input() variant: any={};
  @Input() index: any = 0;
  @Output() variantChange = new EventEmitter<any>();

  isEdit:boolean = false;

  currency: string = 'USD';

  constructor(
    private promoteService: PromoteService
  ) { }

  ngOnInit(): void {

  }

  delete() {
    let param: any = {
      id: this.variant.id
    };

    let self = this;
    this.promoteService.deletePromotionProductVariant(param).then((data) => {
      self.variantChange.emit({
        event: 'delete',
        index: self.index,
        data: data
      });
    });
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  save() {
    let param: any = this.variant;

    let self = this;
    this.promoteService.changePromotionProductVariant(param).then((data) => {
      self.isEdit = false;
      self.variantChange.emit({
        event: 'edit',
        index: self.index,
        data: data
      });
    });
  }

}
