import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { changeStateEditing } from '../store/actions/isEditing.action';
import { Editing } from '../interfaces/isEdting.interface';


@Injectable({
  providedIn: 'root',
})
export class IsEditingService {
  isEditing$: Observable<any>;
  isEditingSub: Subscription;

  constructor(private store: Store<{ isEditing: boolean }>) {
    this.isEditing$ = this.store.select('isEditing');
    this.isEditingSub = this.isEditing$.subscribe();
  }

  setIsEditingForm(data: Editing) {
    this.store.dispatch(changeStateEditing({...data}));
  }

  getIsEditingForm() {
    let resp: Editing = <Editing>{}

    this.isEditingSub = this.isEditing$.subscribe({
      next: (res) => {
        this.isEditingSub.unsubscribe();
        resp = res;
      },
    });
    
    return resp;
  }
}
