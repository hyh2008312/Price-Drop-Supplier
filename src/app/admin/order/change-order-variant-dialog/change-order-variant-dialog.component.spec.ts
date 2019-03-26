import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOrderVariantDialogComponent } from './change-order-variant-dialog.component';

describe('ChangeOrderVariantDialogComponent', () => {
  let component: ChangeOrderVariantDialogComponent;
  let fixture: ComponentFixture<ChangeOrderVariantDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOrderVariantDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOrderVariantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
