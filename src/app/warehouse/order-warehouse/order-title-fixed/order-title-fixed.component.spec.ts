import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTitleComponent } from './order-title-fixed.component';

describe('OrderTitleComponent', () => {
  let component: OrderTitleComponent;
  let fixture: ComponentFixture<OrderTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
