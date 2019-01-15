import { Input, Output, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-warehouse-order-title',
  templateUrl: './order-title.component.html',
  styleUrls: ['../_order.scss']
})

export class OrderTitleComponent implements OnInit {
  @Input() status: number = 0;

  constructor(
  ) { }

  ngOnInit(): void {

  }



}
