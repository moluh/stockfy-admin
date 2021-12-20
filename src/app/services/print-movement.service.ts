import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Movements } from '../models/Movements.model';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root',
})
export class PrintMovementService {
  constructor() {}

  getDocumentDefinition(movement: Movements) {
    return {
      content: [
        /**
         * =====================================
         * SECCION DATOS DEL MOVIMIENTO
         * =====================================
         */
        {
          text: 'Datos del movimiento',
          style: 'header',
        },
        {
          //  layout: 'noBorders',
          table: {
            headerRows: 0,
            widths: ['25%', '70%'],
            body: [
              [
                { text: 'ID', style: 'detailDescription' },
                {
                  text: `${movement.id}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Fecha/Hora ', style: 'detailDescription' },
                {
                  text: `${dayjs(movement.fecha).format('DD-MM-YYYY')} ${
                    movement.hora
                  }`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Cliente', style: 'detailDescription' },
                {
                  text: `${movement.usuario.nombre} ${movement.usuario.apellido}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Estado', style: 'detailDescription' },
                {
                  text: `${
                    movement.estado === 'COMPLETADO'
                      ? 'COMPLETADO'
                      : movement.estado === 'PENDIENTE'
                      ? 'PENDIENTE'
                      : 'ANULADO'
                  }`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Total', style: 'detailDescription' },
                {
                  text: `$ ${movement.total.toFixed(2)}`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Saldo', style: 'detailDescription' },
                {
                  text: `${
                    movement.saldo !== null
                      ? `$${movement.saldo.toFixed(2)}`
                      : '-'
                  }`,
                  style: 'detailDescription',
                },
              ],
              [
                { text: 'Modo de pago', style: 'detailDescription' },
                {
                  text: `${
                    movement.modo_pago === 'CTACTE'
                      ? 'CUENTA CORRIENTE'
                      : movement.modo_pago === 'EFECTIVO'
                      ? 'EFECTIVO'
                      : 'TARJETA'
                  }`,
                  style: 'detailDescription',
                },
              ],
            ],
          },
        },
        /**
         * =====================================
         * SECCION LISTA DE PRODUCTOS
         * =====================================
         */
        {
          text: 'Productos',
          style: 'header',
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '45%', 'auto', 'auto', '15%', '15%'],
            body: [
              [
                {
                  text: 'ID',
                  style: 'tableHeader',
                },
                {
                  text: 'Título',
                  style: 'tableHeader',
                },
                {
                  text: '%',
                  style: 'tableHeader',
                },
                {
                  text: 'Cant.',
                  style: 'tableHeader',
                },
                {
                  text: 'Precio',
                  style: 'tableHeader',
                },
                {
                  text: 'Sub Total',
                  style: 'tableHeader',
                },
              ],
              ...movement.movimiento_lineas.map((p) => {
                return [
                  { text: p.id_producto, style: 'tableDescription' },
                  { text: p.nombre, style: 'tableDescription' },
                  { text: p.porcentaje, style: 'tableDescription' },
                  { text: p.cantidad, style: 'tableDescription' },
                  {
                    text: `$${p.precio_venta.toFixed(2)}`,
                    style: 'tableDescription',
                  },
                  {
                    text: `$${(p.cantidad * p.precio_venta).toFixed(2)}`,
                    style: 'tableDescription',
                  },
                ];
              }),
            ],
          },
        },
        /**
         * =====================================
         * SECCION LISTA DE PAGOS
         * =====================================
         */
        movement.pagos.length > 0
          ? {
              text: 'Pagos',
              style: 'header',
            }
          : {
              text: '',
              style: 'header',
            },
        movement.pagos.length > 0
          ? {
              table: {
                headerRows: 1,
                widths: ['auto', '23%', '23%', '23%', '23%'],
                body: [
                  [
                    {
                      text: 'ID',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Monto',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Fecha',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Interés',
                      style: 'tableHeader',
                    },
                    {
                      text: 'Ganancia',
                      style: 'tableHeader',
                    },
                  ],
                  ...movement.pagos.map((p) => {
                    return [
                      { text: p.pago_nro, style: 'tableDescription' },
                      {
                        text: `$${p.monto.toFixed(2)}`,
                        style: 'tableDescription',
                      },
                      {
                        text: dayjs(p.fecha).format('DD-MM-YYYY'),
                        style: 'tableDescription',
                      },
                      {
                        text: `${
                          p.tasa_interes !== undefined
                            ? `$ ${p.tasa_interes.toFixed(2)}`
                            : '-'
                        }`,
                        style: 'tableDescription',
                      },
                      {
                        text: `${
                          p.ganancia !== undefined
                            ? `$ ${p.ganancia.toFixed(2)}`
                            : '-'
                        }`,
                        style: 'tableDescription',
                      },
                    ];
                  }),
                ],
              },
            }
          : '',
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 10],
          // decoration: 'underline',
          alignment: 'center',
        },
        tableHeader: {
          bold: true,
          alignment: 'center',
        },
        tableDescription: {
          alignment: 'center',
          margin: [0, 2, 0, 2],
        },
        detailDescription: {
          fontSize: 14,
          margin: [0, 2, 0, 2],
          alignment: 'center',
        },
      },
    };
  }

  generatePdf(action = 'open', movement) {
    console.log('movemnt', movement);

    const documentDefinition = this.getDocumentDefinition(movement);
    switch (action) {
      case 'open':
        pdfMake.createPdf(documentDefinition).open();
        break;
      case 'print':
        pdfMake.createPdf(documentDefinition).print();
        break;
      case 'download':
        pdfMake.createPdf(documentDefinition).download();
        break;
      default:
        pdfMake.createPdf(documentDefinition).open();
        break;
    }
  }
}
