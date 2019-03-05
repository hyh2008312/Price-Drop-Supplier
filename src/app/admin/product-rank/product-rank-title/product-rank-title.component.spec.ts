import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRankTitleComponent } from './product-rank-title.component';

describe('ProductRankTitleComponent', () => {
  let component: ProductRankTitleComponent;
  let fixture: ComponentFixture<ProductRankTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRankTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRankTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
