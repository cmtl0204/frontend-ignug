import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';
import {PaginatorModel, ServerResponse} from '../models';
import {HttpErrorResponse} from '@angular/common/http';
import {AbstractControl, Validators} from '@angular/forms';
import {LoginResponse} from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
  }

  error(error: HttpErrorResponse) {
    if (error.status === 400) {
      if (error.error.msg.code === '23505') {
        return Swal.fire({
          title: 'El registro ya existe',
          text: error.error.data,
          icon: 'error'
        });
      }
    }
    if (error.status === 404) {
      return Swal.fire({
        title: error.error.msg.summary,
        text: error.error.msg.detail,
        icon: 'warning'
      });
    }
    if (error.status === 422) {
      let i;
      const fields = Object.values(error.error.msg.detail).toString().split('.,');
      let html = '<ul>';
      for (i = 0; i < fields.length - 1; i++) {
        html += `<li>${fields[i]}.</li>`;
      }
      html += `<li>${fields[i]}</li>`;
      html += '</ul>';
      return Swal.fire({
        title: error.error.msg.summary,
        html,
        icon: 'error'
      });
    }

    return Swal.fire({
      title: error.error.msg.summary,
      text: error.error.msg.detail,
      icon: 'error'
    });
  }

  success(serverResponse: ServerResponse | LoginResponse | undefined) {
    return Swal.fire({
      title: serverResponse?.msg?.summary,
      text: serverResponse?.msg?.detail,
      icon: 'info'
    });
  }

  questionDelete({title = '¿Está seguro de eliminar?', text = 'No podrá recuperar esta información!'}) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<i class="pi pi-trash"> Si, eliminar</i>'
    });
  }

  get fieldRequired(): string {
    return 'El campo es obligatorio.';
  }

  get fieldEmail(): string {
    return 'Correo electrónico no válido.';
  }

  get fieldWeb(): string {
    return 'Página web no válida.';
  }

  get fieldNumber(): string {
    return 'El campo solo debe contener numeros.';
  }

  fieldMinLength(field: AbstractControl) {
    return `Debe contener como mínimo de caracteres es ${field.errors?.minlength.requiredLength}.`;
  }

  fieldMaxLength(field: AbstractControl): string {
    return `Debe contener como máximo de caracteres es ${field.errors?.maxlength.requiredLength}.`;
  }

  fieldMin(field: AbstractControl) {
    return `Numero mínimo permitido es ${field.errors?.min.requiredMin}.`;
  }

  fieldMax(field: AbstractControl): string {
    return `Numero maximo permitido es ${field.errors?.max.requiredMax}.`;
  }

  get fieldNoPasswordMatch(): string {
    return 'Las contraseñas no coinciden.';
  }

  paginatorTotalRegisters(paginator: PaginatorModel): string {
    return 'En total hay ' + (paginator?.total ? paginator.total : 0) + ' registros.';
  }
}
