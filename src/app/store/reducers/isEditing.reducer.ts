import { createReducer, on } from '@ngrx/store'
import { changeStateEditing } from '../actions/isEditing.action'

interface Editing {
    isEditing: boolean
    component: string
}

export const initialState: Editing = {
    isEditing: false,
    component: '',
}

const _isEditingReducer = createReducer(
    initialState,
    on(changeStateEditing, (state, newState) => ({
        ...state,
        ...newState,
    }))
)

export function isEditingReducer(state: Editing, action) {
    return _isEditingReducer(state, action)
}
