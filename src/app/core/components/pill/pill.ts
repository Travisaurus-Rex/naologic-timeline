import { Component, Input } from '@angular/core';
import { WorkOrderStatus } from '../../../models/work-order';
import { PILL_STYLES } from '../../../models/work-order-styles';
import { NgStyle } from '@angular/common';
import { StatusLabelPipe } from '../../pipes/status-label';

@Component({
  selector: 'app-pill',
  imports: [NgStyle, StatusLabelPipe],
  templateUrl: './pill.html',
  styleUrl: './pill.scss',
})
export class Pill {
  @Input() status!: WorkOrderStatus;

  get styles() {
    return PILL_STYLES[this.status];
  }
}
