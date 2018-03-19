import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {MainComponent} from './main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: 'app/admin/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'product',
        loadChildren: 'app/admin/product/product.module#ProductModule'
      }, {
        path: 'order',
        loadChildren: 'app/admin/order/order.module#OrderModule'
      }, {
        path: 'customerService',
        loadChildren: 'app/admin/customer-service/customer-service.module#CustomerServiceModule'
      }, {
        path: 'report',
        loadChildren: 'app/admin/report/report.module#ReportModule'
      }, {
        path: 'account',
        loadChildren:'app/admin/account/account.module#AccountModule'
      }, {
        path: 'user',
        loadChildren:'app/admin/user/user.module#UserModule'
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
export class AdminRoutingModule {
}
