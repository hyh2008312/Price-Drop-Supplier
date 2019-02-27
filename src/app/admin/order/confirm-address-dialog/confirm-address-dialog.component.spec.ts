import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddressDialogComponent } from './confirm-address-dialog.component';

describe('ConfirmAddressDialogComponent', () => {
  let component: ConfirmAddressDialogComponent;
  let fixture: ComponentFixture<ConfirmAddressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAddressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
