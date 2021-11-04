import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-debugpanel',
  templateUrl: './debugpanel.component.html',
  styleUrls: ['./debugpanel.component.scss']
})
export class DebugpanelComponent implements OnInit {

  constructor() { }

  @Input() debugData: JSON;

  ngOnInit() {
  }

}
