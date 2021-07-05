import { Clients } from "./Clients.model";
import { MovementsLines } from "./MovementsLines";
import { Payments } from "./Payments.model";

export class Movements {
    id: number;
    fecha: Date;
    comentario: string;
    estado: string;
    total: number;
    modo_pago: string;
    cliente: Clients;
    movimiento_lineas: MovementsLines[];
    saldo: number;
    pagos: Payments[];
}