import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { AddressService } from '../address.service';

@Component({
  selector: 'app-address-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['../_address.scss']
})

export class AddressItemComponent implements OnInit {

  @Input() status = 0;
  @Input() item: any = {};
  @Input() index: any = 0;

  constructor() {

  }

  ngOnInit():void {

  }
}
