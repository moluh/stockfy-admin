import { Component, Input, OnInit } from '@angular/core'
import { icons } from 'src/assets/icons'

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
    icons = icons
    @Input() iconName
    @Input() iconSize
    @Input() iconColor

    constructor() {}

    ngOnInit(): void {}
}
