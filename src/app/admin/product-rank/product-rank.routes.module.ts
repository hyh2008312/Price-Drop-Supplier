import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ProductRankMainComponent } from './product-rank-main/product-rank-main.component';

const routes: Routes = [
  {
    path: '', component: ProductRankMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRankRoutingModule {
}
