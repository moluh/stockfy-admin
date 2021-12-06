import { createReducer, on } from '@ngrx/store';
import { increment, decrement, reset } from '../actions/movement.action';
export const initialState = 0;

const _movementReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1),
  on(reset, (state) => 0)
);

export function movementReducer(state, action) {
  return _movementReducer(state, action);
}

