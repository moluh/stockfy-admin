import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expanded-list-item',
  templateUrl: './expanded-list-item.component.html',
  styleUrls: ['./expanded-list-item.component.scss']
})
export class ExpandedListItemComponent implements OnInit {

  @Input('itemList') itemList: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goTo(id) {
    console.log('id',id);
    
    this.router.navigate([id])
    .then(res => console.log)
    .catch(err => console.log)
  }

}
