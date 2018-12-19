import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { InventoryService } from '../inventory.service';
import { UserService } from  '../../../shared/services/user/user.service';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-warehouse-inventory-item',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['../_inventory.scss']
})

export class InventoryItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  currency: string = 'INR';
  isSuperuser: boolean = false;

  constructor(
    private inventoryService: InventoryService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

}
