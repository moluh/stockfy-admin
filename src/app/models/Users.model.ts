import { Role } from './Role.model'

export class Users {
    id?: number
    username?: string
    password?: string
    roles?: Role[]
    nombre: string
    apellido: string
    telefono: string
    domicilio: string
    email: string
    provincia: string
    localidad: string
    avatar: string
    recpass: string
    created_at: Date
    updated_at: Date
    activo: boolean
}
