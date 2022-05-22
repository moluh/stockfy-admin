import { Role } from './Role.model'

export class Modules {
    id?: number
    modulo: string
    activo: boolean
    role: Role
    permiso: []
}
