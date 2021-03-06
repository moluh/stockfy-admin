import { Injectable } from '@angular/core'
import { ENVIRONMENT, PRODUCTION } from 'src/environments/environment'
import { ApiResponse } from '../models/ApiResponse.model'
import { ToastService } from './toasts.service'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    production: boolean
    api: any = {}

    constructor(private _toast: ToastService) {
        this.production = PRODUCTION
        this.api = ENVIRONMENT.api
    }

    getApiUrl(): string {
        return this.production ? this.api.prod.url : this.api.dev.url
    }

    handleSuccess(res: ApiResponse, title: string, text: string) {
        this._toast.toastSuccess(text, title)
    }

    handleError(res: ApiResponse | any, title: string, text: string) {
        this._toast.toastError('Error', res.error.error)
        this.log(res)
    }

    handleAlert(res: ApiResponse | any, title: string, text: string) {
        if (res.ok) this._toast.toastAlert(text, title)
        else this._toast.toastAlert(res.error.error, title)
    }

    log(res: ApiResponse) {
        if (!this.production) console.log('[Response ERROR]\n ', res, ' \n')
    }

    /**
   * Todos los datos devueltos en el cuerpo del error deben estar en formato json
   * El formato de los errores debe estar estandarizado para todos los errores
   * @param error
  handleError(error: any) {
    this.log({
      log: "error",
      text: "[Web Service] URL " + error.url + " ERROR",
      data: error,
    });
    let errorResponse: any = {
      error: error,
      text: "Ha ocurrido un error. Por favor, inténtelo nuevamente.",
    };
    switch (error.status) {
      case 0: {
        errorResponse = {
          error: "timeout",
          text: "Verifique su conexión a internet e inténtelo nuevamente.",
        };
        break;
      }
      case 400: {
        try {
          if (
            error.errors.errors.indexOf("Este valor ya se ha utilizado.") > -1
          ) {
            errorResponse = {
              error: "exists",
              text: "No se puede crear porque ya existe.",
            };
          }
        } catch (e) {}
        try {
          if (
            error.error.errors.children.number.errors.indexOf(
              "Este valor ya se ha utilizado."
            ) > -1
          ) {
            errorResponse = {
              error: "exists",
              text: "No se puede crear porque ya existe.",
            };
          }
        } catch (e) {}
        break;
      }
      case 401: {
        errorResponse = {
          error: "unauthenticated",
          text: error.json().text
            ? error.json().text
            : "El usuario o contraseña son incorrectos.",
        };
        break;
      }
      case 403: {
        errorResponse = {
          error: "unauthorized",
          text: "Aún no tenés vigente el servicio de GPStats.",
        };
        break;
      }
      case 404: {
        errorResponse = {
          error: "not-found",
          text: "Lo que intenta buscar no existe",
        };
        break;
      }
      default: {
        if (error.name == "TimeoutError") {
          errorResponse = {
            error: "timeout",
            text: "Verifique su conexión a internet e inténtelo nuevamente.",
          };
          break;
        }
      }
    }
    return errorResponse;
  }
   */
}
