import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-admin-hot-product-promote-product-title',
  templateUrl: './promote-product-title.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class PromoteProductTitleComponent implements OnInit {
  @Input() status:number = 0;

  constructor() { }

  ngOnInit(): void {

  }

}
