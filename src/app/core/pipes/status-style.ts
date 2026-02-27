import { Pipe, PipeTransform } from '@angular/core';
import { WorkOrderStatus } from '../../models/work-order';
import { BAR_STYLES, PILL_STYLES } from '../../models/work-order-styles';

@Pipe({ name: 'barStyle', standalone: true })
export class BarStylePipe implements PipeTransform {
  transform(status: WorkOrderStatus) {
    return BAR_STYLES[status];
  }
}

@Pipe({ name: 'pillStyle', standalone: true })
export class PillStylePipe implements PipeTransform {
  transform(status: WorkOrderStatus) {
    return PILL_STYLES[status];
  }
}
