import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProductMainComponent} from './product-main/product-main.component';
import {ProductCreateComponent} from './product-create/product-create.component';

const routes: Routes = [
  {
    path: '', component: ProductMainComponent,
  }, {
    path: 'create', component: ProductCreateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {
}
