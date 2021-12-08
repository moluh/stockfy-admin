import { createAction, props } from '@ngrx/store';
import { Movements } from 'src/app/models/Movements.model';

export const selectMovement = createAction(
  '[Movement Component] Select Movement',
  props<{ movement: Movements }>()
);
