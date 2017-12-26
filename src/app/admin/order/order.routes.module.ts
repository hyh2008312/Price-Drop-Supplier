import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { OrderMainComponent } from './order-main/order-main.component';

const routes: Routes = [
  {
    path: '', component: OrderMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {
}
