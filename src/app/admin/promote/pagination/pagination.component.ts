import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-promote-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['../_promote.scss']
})

export class PaginationComponent implements OnInit {

  @Input() pageSize: any = 1;
  @Input() page: any = 1;
  @Input() length: any = 1;
  @Output() paginationChange = new EventEmitter<any>();

  showPaginationNumber = 4;

  hasPrevious: boolean = false;
  hasNext: boolean = false;

  pageArray: any = [];

  constructor(

  ) {


  }

  changePreviousPagination() {
    this.page--;
    if(this.page >= 1) {
      if(this.page < this.pageArray[0]) {
        this.pageArray = [];
        for(let i = this.showPaginationNumber - 1; i >= 0; i--) {
          this.pageArray.push(this.page - i);
        }
        this.hasNext = true;
      }

      if(this.page <= 1) {
        this.hasPrevious = false;
      }

      this.paginationChange.emit({
        page: this.page,
        pageSize: this.pageSize
      });
    }

  }

  changeNextPagination() {
    this.page++;
    if(this.page <= this.length) {
      if(this.page > this.pageArray[this.pageArray.length - 1]) {
        if(this.showPaginationNumber < this.length - this.page) {
          this.pageArray = [];
          for(let i = 0; i < this.showPaginationNumber; i++) {
            this.pageArray.push(this.page + i);
          }
        } else {
          let _len = this.length - this.page + 1;
          this.pageArray = [];
          for(let i = 0; i < _len; i++) {
            this.pageArray.push(this.page + i);
          }
        }
      }

      if(this.page == this.length) {
        this.hasNext = false;
      }

      if(this.page > 1) {
        this.hasPrevious = true;
      }

      this.paginationChange.emit({
        page: this.page,
        pageSize: this.pageSize
      });
    }
  }

  ngOnInit(): void {

  }

  ngOnChanges() {
    this.initPagination();
  }

  initPagination() {
    if(this.length > 4) {
      this.pageArray = [];
      for(let i = 0; i < this.showPaginationNumber; i++) {
        this.pageArray.push(this.page + i);
      }
      this.hasNext = true;
    } else if( this.length > 0 && this.length <= 4) {
      this.pageArray = [];
      for(let i = 0; i < this.length; i++) {
        this.pageArray.push(this.page + i);
      }
      this.hasNext = false;
    }
  }


  changePagination($event) {
    this.page = $event;
    this.paginationChange.emit({
      page: this.page,
      pageSize: this.pageSize
    });
  }

}
