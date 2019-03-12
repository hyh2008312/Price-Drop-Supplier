import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryTitleComponent } from './add-inventory-title.component';

describe('AddInventoryTitleComponent', () => {
  let component: AddInventoryTitleComponent;
  let fixture: ComponentFixture<AddInventoryTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInventoryTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
