import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-dashboard-item',
  templateUrl: './dashboard-item.component.html',
  styleUrls: ['../_dashboard.scss']
})

export class DashboardItemComponent implements OnInit {
  @Input() product: any;

  imageStr: string = 'https://images-na.ssl-images-amazon.com/images/I/81qmmiwFuKL._SX522SX522_SY523_CR,0,0,522,523_PIbundle-60,TopRight,0,0_SX522_SY523_CR,0,0,522,523_SH20_.jpg';

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }
}
