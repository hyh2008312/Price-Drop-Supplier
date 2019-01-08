import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-warehouse-inventory-title',
  templateUrl: './inventory-title.component.html',
  styleUrls: ['../_inventory.scss']
})

export class InventoryTitleComponent implements OnInit {

  @Input() status: any = 0;

  constructor(
  ) { }

  ngOnInit(): void {

  }


}
