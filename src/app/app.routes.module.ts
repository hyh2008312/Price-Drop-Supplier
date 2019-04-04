import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { ProtectedGuard } from 'ngx-auth';

import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'account',
        loadChildren: 'app/login/login.module#LoginModule'
      }, {
        path: 'admin',
        canActivate: [ ProtectedGuard ],
        loadChildren: 'app/admin/admin.module#AdminModule'
      }, {
        path: 'warehouse',
        canActivate: [ ProtectedGuard ],
        loadChildren: 'app/warehouse/warehouse.module#WarehouseModule'
      }, {
        path: 'about',
        loadChildren: 'app/about/about.module#AboutModule'
      }, {
        path: '',
        loadChildren: 'app/landing-page/landing-page.module#LandingPageModule'
      }
    ]
  }, {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule{ }
