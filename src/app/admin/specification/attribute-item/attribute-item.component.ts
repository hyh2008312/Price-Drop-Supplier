import { Input, Output, Component, OnInit, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SpecificationService } from '../specification.service';

@Component({
  selector: 'app-attribute-item',
  templateUrl: './attribute-item.component.html',
  styleUrls: ['../_specification.scss']
})

export class AttributeItemComponent implements OnInit {

  @Input() status: number = 0;
  @Input() product: any;
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
      name: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  edit() {
    this.isEdit = true;
    this.attributeForm.patchValue({
      id: this.product.id,
      name: this.product.name
    });
  }

  save() {
    if(this.attributeForm.invalid) {
      return;
    }
    this.adminService.attributeSave(this.attributeForm.value).then((data) => {
      this.product = data;
      this.isEdit = false;
    });
  }

  delete() {
    this.adminService.attributeDelete(this.product).then((data) => {
      this.productChange.emit({
        index: this.index,
        item: data,
        status: this.status,
        event: 'delete'
      });
    });
  }

}
