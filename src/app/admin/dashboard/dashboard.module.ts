import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard.routes.module';
import {SharedModule} from '../../shared/shared.module';
import {DashboardService} from "./dashboard.service";
import {DashboardTitleComponent} from "./dashboard-title/dashboard-title.component";
import {DashboardMainComponent} from "./dashboard-main/dashboard-main.component";

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule
  ],
  exports: [],
  declarations: [
    DashboardTitleComponent,
    DashboardMainComponent
  ],
  entryComponents: [],
  providers: [DashboardService]
})
export class DashboardModule {
}

