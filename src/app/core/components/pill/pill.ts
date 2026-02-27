import { Component, Input } from '@angular/core';
import { WorkOrderStatus } from '../../../models/work-order';
import { PILL_STYLES } from '../../../models/work-order-styles';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-pill',
  imports: [NgStyle],
  templateUrl: './pill.html',
  styleUrl: './pill.scss',
})
export class Pill {
  @Input() status!: WorkOrderStatus;

  get styles() {
    return PILL_STYLES[this.status];
  }
}
