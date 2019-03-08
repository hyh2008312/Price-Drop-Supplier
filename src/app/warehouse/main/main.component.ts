import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-warehouse-main',
  templateUrl: './main.component.html',
  styleUrls: ['../_warehouse.scss']
})

export class MainComponent implements OnInit {

  langArray: any;
  selectLang: any;

  constructor(
    public trans: TranslateService
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

  }

  ngOnInit():void {

  }

  changeLang($event) {
    this.selectLang = $event;
    this.trans.use($event);
  }

}
