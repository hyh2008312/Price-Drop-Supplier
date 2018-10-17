import { Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SpecificationService } from '../specification.service';

@Component({
  selector: 'app-attribute-category-item',
  templateUrl: './attribute-category-item.component.html',
  styleUrls: ['../_specification.scss']
})

export class AttributeCategoryItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
  @Input() attributeList: any;
  @Input() index: number = 0;
  @Output() productChange = new EventEmitter<any>();

  isEdit: boolean = false;

  attributeForm: FormGroup;

  constructor(
    private adminService: SpecificationService,
    private fb: FormBuilder
  ) {
    this.attributeForm = this.fb.group({
      id: ['', Validators.required],
      categoryId: ['', Validators.required],
      specificationId: ['', Validators.required],
      sort: ['', Validators.required],
      multiSelect: [false, Validators.required]
    });
  }

  ngOnInit() {

  }

  edit() {
    this.isEdit = true;
    this.attributeForm.patchValue({
      id: this.product.id,
      categoryId: this.product.categoryId,
      specificationId: this.product.specificationId,
      sort: this.product.sort,
      multiSelect: this.product.multiSelect
    });
  }

  save() {
    if(this.attributeForm.invalid) {
      return;
    }
    this.adminService.categoryAttributeSave(this.attributeForm.value).then((data) => {
      this.product = data;
      this.isEdit = false;
    });
  }

  delete() {
    this.adminService.categoryAttributeDelete(this.product).then((data) => {
      this.productChange.emit({
        index: this.index,
        item: data,
        status: this.status,
        event: 'delete'
      });
    });
  }

}
