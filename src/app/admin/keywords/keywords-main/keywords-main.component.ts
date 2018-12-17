import {Component, OnInit, OnDestroy, Inject, NgZone} from '@angular/core';
import {Router, NavigationStart, ActivatedRoute} from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import {KeywordsService} from "../keywords.service";

@Component({
  selector: 'app-admin-keywords-main',
  templateUrl: './keywords-main.component.html',
  styleUrls: ['../_keywords.scss']
})

export class KeywordsMainComponent implements OnInit {


  selectedIndex: any = 0;

  keywordsListIndex = 1;
  keywordsList: any;
  hotwordList: any;

  // MatPaginator Inputs
  length:number = 0;
  pageSize = 100;
  pageSizeOptions = [100];

  // MatPaginator Output
  changePage(event) {
    this.pageSize = event.pageSize;
    this.keywordsListIndex = event.pageIndex + 1;
    this.changeLists();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
  }

  constructor(private router: Router,
              private accountService: KeywordsService,
              private activatedRoute: ActivatedRoute) {
    this.changeLists();
  }

  ngOnInit(): void {

  }

  changeLists() {
    let page: any = '';
    switch (this.selectedIndex) {
      case 0:
        page = this.keywordsListIndex;

        this.accountService.getKeywordsList({
          page,
          page_size: this.pageSize
        }).then((data) => {
          this.length = data.count;
          this.keywordsList = [...data.results];
        });
        break;
      case 1:

        this.accountService.getHotwordList().then((data) => {
          this.hotwordList = [...data];
        });
        break;
    }
  }
}
