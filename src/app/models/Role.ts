import { Users } from "./Users.model";

export class Role {
    id?: number;
    role: string;
    descripcion: string;
    nivel: number;
    usuario?: Users[];
}