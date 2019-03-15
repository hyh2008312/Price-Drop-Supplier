import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportRestockInventoryDialogComponent } from './export-restock-inventory-dialog.component';

describe('ExportRestockInventoryDialogComponent', () => {
  let component: ExportRestockInventoryDialogComponent;
  let fixture: ComponentFixture<ExportRestockInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportRestockInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportRestockInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
