import { Input, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-product-rank-title',
  templateUrl: './product-rank-title.component.html',
  styleUrls: ['../_product-rank.scss']
})

export class ProductRankTitleComponent implements OnInit {
  @Input() status: number = 0;

  constructor(
  ) { }

  ngOnInit(): void {

  }

}
