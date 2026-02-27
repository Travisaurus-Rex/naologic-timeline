import { Component, Input } from '@angular/core';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument } from '../../../../models/work-order';
import { NgStyle } from '@angular/common';
import { BarStylePipe } from '../../../../core/pipes/status-style';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [NgStyle, Pill, BarStylePipe],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
  @Input() order!: WorkOrderDocument;
  @Input() left!: number;
  @Input() width!: number;
}
