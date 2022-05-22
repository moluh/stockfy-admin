import { createReducer, on } from '@ngrx/store'
import { Users } from 'src/app/models/Users.model'
import { selectUser } from '../actions/userSelected.action'

export const initialState: Users = <Users>{}

const _userSelectedReducer = createReducer(
    initialState,
    on(selectUser, (state, newState) => ({
        ...state,
        ...newState,
    }))
)

export function userSelectedReducer(state, action) {
    return _userSelectedReducer(state, action)
}
