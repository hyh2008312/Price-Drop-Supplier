import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEditAddressDialogComponent } from './confirm-edit-address-dialog.component';

describe('ConfirmEditAddressDialogComponent', () => {
  let component: ConfirmEditAddressDialogComponent;
  let fixture: ComponentFixture<ConfirmEditAddressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEditAddressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEditAddressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
