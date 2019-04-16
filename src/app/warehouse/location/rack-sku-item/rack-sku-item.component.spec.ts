import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackSkuItemComponent } from './rack-sku-item.component';

describe('RackSkuItemComponent', () => {
  let component: RackSkuItemComponent;
  let fixture: ComponentFixture<RackSkuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackSkuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackSkuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
