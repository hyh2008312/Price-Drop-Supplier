import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../category.service';
import { UserService } from  '../../../shared/services/user/user.service';

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
  isSuperuser: boolean = false;

  constructor(
    private adminService: CategoryService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userService.currentUser.subscribe((data) => {
      if(data) {
        if(data.isStaff && data.isSuperuser) {
          this.isSuperuser = true
        }
      }
    });
  }

  ngOnInit(): void {


  }


  edit() {
    this.router.navigate([`./edit/${this.product.id}`], {relativeTo: this.activatedRoute});
  }

}
