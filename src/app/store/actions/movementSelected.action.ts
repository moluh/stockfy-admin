import { createAction, props } from '@ngrx/store';
import { Movements } from 'src/app/models/Movements.model';

export const selectMovement = createAction(
  '[Counter Component] Increment',
  props<{ movement: Movements }>()
);
