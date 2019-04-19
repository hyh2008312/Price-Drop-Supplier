import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardInventoryDialogComponent } from './outward-inventory-dialog.component';

describe('OutwardInventoryDialogComponent', () => {
  let component: OutwardInventoryDialogComponent;
  let fixture: ComponentFixture<OutwardInventoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardInventoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardInventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
