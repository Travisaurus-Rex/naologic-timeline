import { Pipe, PipeTransform } from '@angular/core';
import { WorkOrderStatus } from '../../models/work-order';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status: WorkOrderStatus): string {
    return status
      .split('-')
      .map((word, i) => (i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
      .join(' ');
  }
}
