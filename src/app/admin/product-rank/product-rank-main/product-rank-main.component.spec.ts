import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRankMainComponent } from './product-rank-main.component';

describe('ProductRankMainComponent', () => {
  let component: ProductRankMainComponent;
  let fixture: ComponentFixture<ProductRankMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRankMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRankMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
