import { createAction, props } from '@ngrx/store'

export const changeStateEditing = createAction(
    '[All Components] Is Editing',
    props<{ isEditing: boolean; component: string }>()
)
