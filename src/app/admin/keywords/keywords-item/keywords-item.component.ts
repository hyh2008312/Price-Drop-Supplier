import {Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {KeywordsService} from "../keywords.service";

@Component({
  selector: 'app-admin-keywords-item',
  templateUrl: './keywords-item.component.html',
  styleUrls: ['../_keywords.scss']
})

export class KeywordsItemComponent implements OnInit {

  @Input() status = 0;
  @Input() item: any = {};
  @Input() index: any = 0;
  @Output() userChange = new EventEmitter<any>();

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private keywordsService: KeywordsService
  ) {
  }

  ngOnInit(): void {
  }

  approved() {
    let self = this;
    self.keywordsService.changeAccountsStatus({
      id: self.item.id,
      status: 'Approved'
    }).then((data) => {
      self.userChange.emit({
        index: this.index,
        user : data,
        status: this.status,
        event: 'Approved'
      });
    });

  }

  skipped() {
    let self = this;
    self.keywordsService.changeAccountsStatus({
      id: self.item.id,
      status: 'Skipped'
    }).then((data) => {
      self.userChange.emit({
        index: this.index,
        user : data,
        status: this.status,
        event: 'Skipped'
      });
    });

  }

  disapproved() {
    let self = this;
    self.keywordsService.changeAccountsStatus({
      id: self.item.id,
      status: 'Disapproved'
    }).then((data) => {
      self.userChange.emit({
        index: this.index,
        user : data,
        status: this.status,
        event: 'Disapproved'
      });
    });

  }
}
