import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


import { WarehouseService } from '../warehouse.service';
import { UserService } from '../../shared/services/user/user.service';

@Component({
  selector: 'app-warehouse-main',
  templateUrl: './main.component.html',
  styleUrls: ['../_warehouse.scss']
})

export class MainComponent implements OnInit {

  langArray: any;
  selectLang: any;
  warehouseId: any = false;
  warehouseList: any;

  constructor(
    public trans: TranslateService,
    private warehouseService: WarehouseService,
    private useService: UserService
  ) {
    trans.addLangs(['zh', 'en']);

    const browserLang = trans.getBrowserLang();
    trans.use(browserLang.match(/zh|en/) ? browserLang : 'zh');
    this.selectLang = browserLang.match(/zh|en/) ? browserLang : 'zh';
    this.langArray = [];
    for(let item of trans.getLangs()) {
      let em: any = {};
      if(item == 'zh') {
        em.text = '中文';
        em.value = item;
      } else if(item == 'en') {
        em.text = 'English';
        em.value = item;
      }
      this.langArray.push(em);
    }

    this.getWarehouseList();

  }

  ngOnInit():void {

  }

  changeLang($event) {
    this.selectLang = $event;
    this.trans.use($event);
  }

  getWarehouseList() {
    this.warehouseService.getWarehouseList().then((data) => {
      this.warehouseList = [...data];
      this.warehouseList.unshift({
        id: false,
        warehouseName: 'PACKAGING.CODLIST.TITLE1'
      });
    });
  }

  warehouseChange($event) {
    this.useService.addPubWarehouse($event);
  }

}
