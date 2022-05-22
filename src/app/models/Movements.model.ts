import { MovementsLines } from './MovementsLines'
import { Payments } from './Payments.model'
import { Users } from './Users.model'

export class Movements {
    id: number
    fecha: string | any
    hora: string | any
    comentario: string
    estado: string
    total: number
    modo_pago: string
    usuario: Users
    movimiento_lineas: MovementsLines[]
    saldo: number
    pagos: Payments[]
}
