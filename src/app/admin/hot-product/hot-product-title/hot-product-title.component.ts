import { Input, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-hot-product-title',
  templateUrl: './hot-product-title.component.html',
  styleUrls: ['../_hot-product.scss']
})

export class HotProductTitleComponent implements OnInit {
  @Input() status: number = 0;

  constructor(
  ) { }

  ngOnInit(): void {

  }

}
