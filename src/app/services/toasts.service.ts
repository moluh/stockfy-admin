import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastr: ToastrService
  ) { }

  public toastSuccess(msg1, msg2) {
    this.toastr.success(`${msg1}`, `${msg2}`)
  }

  public toastError(msg1, msg2) {
    this.toastr.error(`${msg1}`, `${msg2}`)
  }

  public toastAlert(msg1, msg2) {
    this.toastr.info(`${msg1}`, `${msg2}`)
  }


  public toastErrorSession(msg1, msg2) {
    this.toastr.error(`${msg1}`, `${msg2}`)
  }

  public sweetDelete(): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'Eliminar',
        text: "¿Realmente desea eliminar?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          resolve(result.value)
        }
      });
    })
  }

  public sweetConfirm(title: string, text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          resolve(result.value)
        }
      });
    })
  }

  public sweetSuccess(msg1, msg2) {
    Swal.fire(`${msg1}`, `${msg2}`, 'success');
  }

  public sweetInterval(progreso: string) {

    Swal.fire({
      title: 'Cargando imagen..',
      html: `Por favor espere un momento. ${progreso}`,
      timer: 2000,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
      onClose: () => {

      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
  }

  public sweetAlert(msg1:string,msg2) {
    Swal.fire({
      title: msg1,
      text: msg2
    });
  }
}
