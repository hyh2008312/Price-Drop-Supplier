import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinitiateOrderDialogComponent } from './reinitiate-order-dialog.component';

describe('ReinitiateOrderDialogComponent', () => {
  let component: ReinitiateOrderDialogComponent;
  let fixture: ComponentFixture<ReinitiateOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinitiateOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitiateOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
