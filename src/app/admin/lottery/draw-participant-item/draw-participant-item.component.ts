import { Input, Output, Component, OnInit,EventEmitter} from '@angular/core';

import { LotteryService } from '../lottery.service';

@Component({
  selector: 'app-lottery-draw-participant-item',
  templateUrl: './draw-participant-item.component.html',
  styleUrls: ['../_lottery.scss']
})

export class DrawParticipantItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() promote: any = {};
  @Input() promoteId: any;
  @Input() index: number = 0;
  @Output() promotionChange = new EventEmitter<any>();

  currency: string = 'USD';

  constructor(
    private promoteService: LotteryService
  ) { }

  ngOnInit(): void {

  }

  addParticipant() {
    this.promoteService.addParticipant(this.promote).then((data) => {
      if(data.id) {
        this.promote = data;
      }
    }).catch((data) => {

    });
  }

  deleteParticipant() {
    this.promoteService.deleteParticipant(this.promote).then((data) => {
      if(data.id) {
        this.promote = data;
      }
    }).catch((data) => {

    });
  }

}
