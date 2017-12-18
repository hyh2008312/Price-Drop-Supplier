import { NgModule } from '@angular/core';

import { MainComponent } from './main/main.component';

import { AdminRoutingModule } from './admin.routes.module';

import { AdminService } from './admin.service';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [],
  declarations: [
    MainComponent
  ],
  entryComponents: [

  ],
  providers: [
    AdminService,
    AuthenticationService
  ]
})
export class ShopModule { }

