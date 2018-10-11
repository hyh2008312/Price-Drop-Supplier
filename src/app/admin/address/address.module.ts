import { NgModule } from '@angular/core';

import { AddressMainComponent } from './address-main/address-main.component';
import { AddressCreateComponent } from './address-create/address-create.component';
import { AddressEditComponent } from './address-edit/address-edit.component';

import { AddressItemComponent } from './address-item/address-item.component';
import { AddressTitleComponent } from './address-title/address-title.component';

import { AddressRoutingModule } from './address.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { AddressService } from './address.service';

@NgModule({
  imports: [
    SharedModule,
    AddressRoutingModule
  ],
  exports: [],
  declarations: [
    AddressMainComponent,
    AddressCreateComponent,
    AddressEditComponent,
    AddressItemComponent,
    AddressTitleComponent
  ],
  entryComponents: [],
  providers: [
    AddressService
  ]
})
export class AddressModule { }

