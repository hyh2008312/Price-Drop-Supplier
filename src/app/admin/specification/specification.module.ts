import { NgModule } from '@angular/core';

import { SpecificationMainComponent } from './specification-main/specification-main.component';
import { SpecificationCreateComponent } from './specification-create/specification-create.component';
import { SpecificationEditComponent } from './specification-edit/specification-edit.component';
import { SpecificationTitleComponent } from './specification-title/specification-title.component';
import { SpecificationItemComponent } from './specification-item/specification-item.component';
import { AttributeTitleComponent } from './attribute-title/attribute-title.component';
import { AttributeItemComponent } from './attribute-item/attribute-item.component';
import { ToolTipsComponent } from './tool-tips/tool-tips.component';

import { SpecificationRoutingModule } from './specification.routes.module';
import { SharedModule } from '../../shared/shared.module';

import { SpecificationService } from './specification.service';

@NgModule({
  imports: [
    SharedModule,
    SpecificationRoutingModule
  ],
  exports: [],
  declarations: [
    SpecificationMainComponent,
    SpecificationCreateComponent,
    SpecificationEditComponent,
    SpecificationTitleComponent,
    SpecificationItemComponent,
    ToolTipsComponent,
    AttributeTitleComponent,
    AttributeItemComponent
  ],
  entryComponents: [
    ToolTipsComponent
  ],
  providers: [
    SpecificationService
  ]
})
export class SpecificationModule { }

