import {Input, Output, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-warehouse-add-inventory-title',
  templateUrl: './add-inventory-title.component.html',
  styleUrls: ['../_inventory.scss']
})

export class AddInventoryTitleComponent implements OnInit {

  @Input() status: any = 0;

  constructor() { }


  ngOnInit(): void {

  }

}
