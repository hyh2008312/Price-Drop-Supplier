import {Input, Output, Component, OnInit, EventEmitter, ElementRef, NgZone} from '@angular/core';

@Component({
  selector: 'app-warehouse-location-title-fixed',
  templateUrl: './location-title-fixed.component.html',
  styleUrls: ['../_location.scss']
})

export class LocationTitleFixedComponent implements OnInit {

  @Input() status: any = 0;

  constructor() { }

  ngOnInit(): void {

  }

}
