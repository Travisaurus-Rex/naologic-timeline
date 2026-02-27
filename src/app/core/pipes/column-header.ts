import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'colHeader', standalone: true })
export class ColHeaderPipe implements PipeTransform {
  transform(date: Date): string {
    return format(date, 'MMM d');
  }
}
