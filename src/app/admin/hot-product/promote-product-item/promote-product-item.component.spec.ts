import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoteProductItemComponent } from './promote-product-item.component';

describe('PromoteProductItemComponent', () => {
  let component: PromoteProductItemComponent;
  let fixture: ComponentFixture<PromoteProductItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoteProductItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoteProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
