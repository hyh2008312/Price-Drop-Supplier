import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryItemComponent } from './promote-product-item.component';

describe('ProductCategoryItemComponent', () => {
  let component: ProductCategoryItemComponent;
  let fixture: ComponentFixture<ProductCategoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
