import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProductMainComponent} from './product-main/product-main.component';

const routes: Routes = [
  {
    path: '', component: ProductMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
