import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DatesService {

    dia1 = '01';
    dia30 = '30';
    fechaInicioMesPas: any;
    fechaFinMesPas: any;
    fechaInicioMesActual: any;
    fechaFinMesActual: any;

    FechaAyer: any;
    actualDate: any;

    constructor() {
        this.generarFechas();
    }

    getHoraActual() {
        let hora = new Date()
        let HoraActual: any = hora.toLocaleTimeString();
        // console.log('fechaActual', HoraActual);
        return HoraActual;
    }


    getActualDate() {

        let today = new Date()
        let day: any = today.getDate();
        let month: any = today.getMonth() + 1;
        let year: any = today.getFullYear();
        let hour: any = today.getHours();
        let minutes: any = today.getMinutes();
        let seconds: any = today.getSeconds();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        // this.actualDate = String(`${year}-${month}-${day}T${hour}:${minutes}:${seconds}.000Z`);
        this.actualDate = String(`${year}-${month}-${day}`);

        return this.actualDate;
    }

    getFechaAyer() {

        let hoy = new Date()
        let dia: any = hoy.getDate();
        let mes: any = hoy.getMonth() + 1;
        let anio: any = hoy.getFullYear();
        let dia_ayer: any = dia - 1;

        if (mes < 10) {
            mes = "0" + mes;
        }
        if (dia < 10) {
            dia = "0" + dia;
        }
        if (dia_ayer < 10) {
            dia_ayer = "0" + dia_ayer;
        }
        this.FechaAyer = String(anio + '-' + mes + '-' + dia_ayer);

        return this.FechaAyer;
    }



    generarFechas() {
        let hoy = new Date()
        let anio: any = hoy.getFullYear();
        let dia: any = hoy.getDate();
        let mes: any = hoy.getMonth() + 1;
        // let dia_ayer: any = hoy.getDate();
        let mesPas: any = hoy.getMonth();

        if (mes < 10 && mesPas < 10) {
            mes = "0" + mes;
            mesPas = "0" + mesPas;
        }
        if (dia < 10) {
            dia = "0" + dia;
        }
        if (dia == 31) {
            this.dia30 = dia;
        }

        this.fechaInicioMesPas = String(anio + '-' + mesPas + '-' + this.dia1);
        this.fechaFinMesPas = String(anio + '-' + mesPas + '-' + this.dia30);

        this.fechaInicioMesActual = String(anio + '-' + mes + '-' + this.dia1);
        this.fechaFinMesActual = String(anio + '-' + mes + '-' + this.dia30);

    }

}
