import { createReducer, on } from '@ngrx/store';
import { Movements } from 'src/app/models/Movements.model';
import { selectMovement } from '../actions/movementSelected.action';

export const initialState: Movements = <Movements>{};

const _movementSelectedReducer = createReducer(
  initialState,
  on(selectMovement, (state, newState) => ({
    ...state,
    ...newState,
  }))
);

export function movementSelectedReducer(state, action) {
  return _movementSelectedReducer(state, action);
}

