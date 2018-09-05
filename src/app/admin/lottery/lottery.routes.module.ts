import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LotteryMainComponent} from './lottery-main/lottery-main.component';
import {LotteryAwardCreateComponent} from './lottery-award-create/lottery-award-create.component';
import { LotteryAwardEditComponent } from './lottery-award-edit/lottery-award-edit.component';

const routes: Routes = [
  {
    path: '', component: LotteryMainComponent
  },
  {
    path: 'prize/create', component: LotteryAwardCreateComponent
  },
  {
    path: 'prize/edit/:id', component: LotteryAwardEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotteryRoutingModule {
}
