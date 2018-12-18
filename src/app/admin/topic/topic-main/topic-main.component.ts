import { Component, OnInit } from '@angular/core';

import { TopicService } from '../topic.service';

@Component({
  selector: 'app-topic-main',
  templateUrl: './topic-main.component.html',
  styleUrls: ['./_topic.scss']
})

export class TopicMainComponent implements OnInit {

  constructor(
    private topicService: TopicService
  ) {

  }

  ngOnInit():void {
  }

  ngOnDestroy() {}

}
