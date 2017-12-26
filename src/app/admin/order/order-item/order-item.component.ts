import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../admin.service';
import { UserService } from  '../../../shared/services/user/user.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['../order.scss']
})

export class OrderItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any = {
    categoryId : 217,
    categoryName : "Electronics",
    createdTime : "2017-12-11T06:11:52.203487Z",
    description : "<div><p>▲♬Enjoy quiet phone calls: The Built-in Microphones Allow you to Take Calls Hands Free  and Active Noise Cancellation Minimizes Background Noise</p><br><p>▲♬Function: play/pause answer/ off  noise cancelling  microphone  control music video playback by pressing the center button  answer and end calls</p><br><p>▲♬Premium Sound: Signature Sound Profile Features a Balance of Deep Bass  Full Midrange and Crisp Highs to Ensure any Genre of Music Sounds Great.</p><br><p>▲♬Comfortable and Compact Ergonomic Design Earbuds: Built with High-Performance Speakers Ensuring High-Quality Sound  Capturing the Nuances and  Clarity of All your Favorite Music</p><br><p>▲♬Compatibility: Ideal for All iPhone 6S/6/Plus/iPhone SE/5S/5C/5  Samsung Galaxy S7/S6/Edge  Google  Nexus 6P/5X  HTC One  Nokia  Motorola  Windows Phone  Tablet  iPad  iPod  MP4/MP3  Laptop Computer and many more</p><br></div>",
    id : 457,
    imageUrl : "https://images-na.ssl-images-amazon.com/images/I/716Mg13ZLZL._SL1500_.jpg",
    isCustomer : true,
    isDraft : false,
    isUser : false,
    modifiedTime : "2017-12-11T06:11:52.204611Z",
    originalPriceAmount : 39.99,
    originalPriceCurrency : "USD",
    productId : 34681,
    purchaseUrl : "http://localhost:4200/store/yaohua_store/1",
    recommendation : "",
    salePriceAmount : 13.99,
    salePriceCurrency : "USD",
    storeId : 1,
    tags : null,
    title : "in-ear headset Ancoki  Apple earphones  Remote control perfect for iPhone 6s 6 Plus 5s 5 4s 4 SE 5C iPad 7 8 7s IOS S7 S6 Note 1 2 3  Tablet PC and Other Compatible Devices(2 PACK)",
    userEmail : "hyh2017312@gmail.com",
    userFirstName : "yaohua",
    userId : 2,
    userLastName : "he"
  };
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();


  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {


  }

  delete() {
    let self = this;


  }

  publish() {
    let self = this;


  }

  unpublish() {
    let self = this;


  }

  edit() {
    let tab = '';
    switch (this.status) {
      case 0:
        tab = 'publish';
        break;
      case 1:
        tab = 'draft';
        break;
      case 2:
        tab = 'unpublish';
        break;
    }
  }
}
