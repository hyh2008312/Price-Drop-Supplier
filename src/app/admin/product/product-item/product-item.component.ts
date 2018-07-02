import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductService } from '../product.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['../product.scss']
})

export class ProductItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';

  constructor(
    private adminService: ProductService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {


  }

  delete() {
    let self = this;
  }

  add() {
    let self = this;
    self.adminService.addProductToSelected({
      products: [{id:self.product.id}]
    }).then((data) => {
      this.product.isSelected = true;
    });

  }

  deleteSelected() {
    let self = this;
    self.adminService.deleteProductToSelected({
      id: self.product.id
    }).then((data) => {
      this.product.isSelected = false;
    });

  }

  deleteSelectedNew() {
    let self = this;
    self.adminService.deleteProductToSelected({
      id: self.product.productId
    }).then((data) => {
      self.productChange.emit({
        index: this.index,
        product : data,
        status: this.status,
        event: 'selected'
      });
    });

  }

  publish() {
    let self = this;
    self.adminService.publishProduct({
      id: self.product.id,
      status: 'published'
    }).then((data) => {
      self.productChange.emit({
        index: this.index,
        product : data,
        status: this.status,
        event: 'publish'
      });
    });

  }

  unpublish() {
    let self = this;

    self.adminService.publishProduct({
      id: self.product.id,
      status: 'unpublished'
    }).then((data) => {
      self.productChange.emit({
        index: this.index,
        product : data,
        status: this.status,
        event: 'unpublish'
      });
    });
  }

  disapprove() {
    let self = this;

    self.adminService.disapproveProduct({
      id: self.product.id
    }).then((data) => {
      self.productChange.emit({
        index: this.index,
        product : data,
        status: this.status,
        event: 'disapprove'
      });
    });
  }

  edit() {
    if(this.status != 4) {
      this.router.navigate([`./edit/${this.product.id}`], {relativeTo: this.activatedRoute});
    } else {
      this.router.navigate([`./draftedit/${this.product.id}`], {relativeTo: this.activatedRoute});
    }
  }

  countInventory(variants) {
    let number = 0;
    for (let value of variants) {
      number += parseInt(value.stockrecord);
    }
    return number;
  }

  getLowestPrice(variants): any {
    let price: any = {
      saleUnitPrice : variants[0],
      unitPrice : variants[0]
    };

    let unitPriceArray = [];

    for(let i=0;i<variants.length;i++){
      if(variants[i].saleUnitPrice <=  price.saleUnitPrice){
        price.saleUnitPrice = variants[i].saleUnitPrice;
      }
    }

    for(let value of variants) {
      if(value.saleUnitPrice == price.saleUnitPrice) {
        unitPriceArray.push(value.unitPrice);
      }
    }

    for(let value of unitPriceArray) {
      if(value <=  price.unitPrice){
        price.unitPrice = value;
      }
    }

    return price;
  }

}
