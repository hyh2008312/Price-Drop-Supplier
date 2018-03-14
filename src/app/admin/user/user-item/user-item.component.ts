import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-admin-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['../_user.scss']
})

export class UserItemComponent implements OnInit {

  @Input() status = 0;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }
}
