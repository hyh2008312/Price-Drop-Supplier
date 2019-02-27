import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { HotProductMainComponent } from './hot-product-main/hot-product-main.component';

const routes: Routes = [
  {
    path: '', component: HotProductMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotProductRoutingModule {
}
