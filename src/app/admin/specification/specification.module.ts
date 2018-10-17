import { NgModule } from '@angular/core';

import { SpecificationMainComponent } from './specification-main/specification-main.component';
import { SpecificationEditComponent } from './specification-edit/specification-edit.component';
import { SpecificationTitleComponent } from './specification-title/specification-title.component';
import { SpecificationItemComponent } from './specification-item/specification-item.component';
import { AttributeTitleComponent } from './attribute-title/attribute-title.component';
import { AttributeItemComponent } from './attribute-item/attribute-item.component';
import { AttributeCategoryTitleComponent } from './attribute-category-title/attribute-category-title.component';
import { AttributeCategoryItemComponent } from './attribute-category-item/attribute-category-item.component';
import { AddAttributeDialogComponent } from './add-attribute-dialog/add-attribute-dialog.component';
import { AddCategoryAttributeDialogComponent } from './add-category-attribute-dialog/add-category-attribute-dialog.component';
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
    SpecificationEditComponent,
    SpecificationTitleComponent,
    SpecificationItemComponent,
    ToolTipsComponent,
    AttributeTitleComponent,
    AttributeItemComponent,
    AddAttributeDialogComponent,
    AddCategoryAttributeDialogComponent,
    AttributeCategoryItemComponent,
    AttributeCategoryTitleComponent
  ],
  entryComponents: [
    ToolTipsComponent,
    AddAttributeDialogComponent,
    AddCategoryAttributeDialogComponent
  ],
  providers: [
    SpecificationService
  ]
})
export class SpecificationModule { }

