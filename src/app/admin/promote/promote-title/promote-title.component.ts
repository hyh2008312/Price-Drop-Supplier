import { Input, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-promote-product-title',
  templateUrl: './promote-title.component.html',
  styleUrls: ['../_promote.scss']
})

export class PromoteTitleComponent implements OnInit {
  @Input() status: number = 0;

  constructor(
  ) { }

  ngOnInit(): void {

  }



}
