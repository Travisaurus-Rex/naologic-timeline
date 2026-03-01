import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({ name: 'colHeader', standalone: true })
export class ColHeaderPipe implements PipeTransform {
  transform(date: Date, mode: 'day' | 'week' | 'month'): string {
    switch (mode) {
      case 'day':
        return format(date, 'MMM d');
      case 'week':
        return format(date, 'MMM d');
      case 'month':
        return format(date, 'MMM yyyy');
    }
  }
}
