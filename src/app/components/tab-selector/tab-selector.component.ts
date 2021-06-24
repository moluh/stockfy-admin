import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab-selector',
  templateUrl: './tab-selector.component.html',
  styleUrls: ['./tab-selector.component.scss']
})
export class TabSelectorComponent implements OnInit, AfterViewInit {

  @Input() tabList: any[];
  @Input() doClickAction: string;
  @Output() tabNameEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.doClickAction) {
      const tabToClick = this.tabList.find(tab => tab.name === this.doClickAction);
      document.getElementById(`${tabToClick.id}-tab`).click();
    }
  }

  sendTabNameEvent(value: string) {
    this.tabNameEvent.emit(value);
  }

}
