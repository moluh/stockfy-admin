import { createAction, props } from '@ngrx/store';
import { Users } from 'src/app/models/Users.model';

export const selectUser = createAction(
  '[User Component] Select User',
  props<{ user: Users }>()
);
