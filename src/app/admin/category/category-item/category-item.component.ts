import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['../_category.scss']
})

export class CategoryItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any = {
    id: '',
    data: {
      name: ''
    }
  };
  @Input() parent: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';

  constructor(
    private adminService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {


  }


  edit() {
    this.router.navigate([`./edit/${this.product.id}`], {relativeTo: this.activatedRoute});
  }

}
