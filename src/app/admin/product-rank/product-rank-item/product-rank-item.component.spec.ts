import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRankItemComponent } from './product-rank-item.component';

describe('ProductRankItemComponent', () => {
  let component: ProductRankItemComponent;
  let fixture: ComponentFixture<ProductRankItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRankItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRankItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
