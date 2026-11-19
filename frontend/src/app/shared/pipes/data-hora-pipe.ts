
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataHora',
  standalone: true,
})
export class DataHoraPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
  }
}
