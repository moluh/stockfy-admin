import { Component, Input, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
    selector: 'app-tab-content',
    templateUrl: './tab-content.component.html',
    styleUrls: ['./tab-content.component.scss'],
})
export class TabContentComponent implements OnInit {
    @Input() tabName: string = ''

    constructor() {}

    ngOnInit(): void {
        // console.log(this.tabName)
    }
}
