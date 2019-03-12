import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryDialogComponent } from './add-inventory-dialog.component';

describe('AddInventoryDialogComponent', () => {
  let component: AddInventoryDialogComponent;
  let fixture: ComponentFixture<AddInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
