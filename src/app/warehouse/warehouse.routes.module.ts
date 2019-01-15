import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainComponent} from './main/main.component';
import {WarehouseOrderModule} from './order/order.module';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: './home/home.module#HomeModule'
      }, {
        path: 'tracking',
        loadChildren: './tracking/tracking.module#TrackingModule'
      }, {
        path: 'inventory',
        loadChildren: './inventory/inventory.module#InventoryModule'
      }, {
        path: 'order',
        loadChildren: './order/order.module#WarehouseOrderModule'
      }, {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }, {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule {
}
