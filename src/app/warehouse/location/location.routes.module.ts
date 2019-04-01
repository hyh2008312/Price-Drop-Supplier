import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { LocationMainComponent } from './location-main/location-main.component';

const routes: Routes = [
  {
    path: '', component: LocationMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule {
}
