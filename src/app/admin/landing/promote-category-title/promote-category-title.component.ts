import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-landing-promote-category-title',
  templateUrl: './promote-category-title.component.html',
  styleUrls: ['../_landing.scss']
})

export class PromoteCategoryTitleComponent implements OnInit {
  @Input() status:number = 0;

  constructor() { }

  ngOnInit(): void {

  }

}
