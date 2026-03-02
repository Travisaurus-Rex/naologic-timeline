import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument } from '../../../../models/work-order';

@Component({
  selector: 'app-work-order-toolbar',
  standalone: true,
  imports: [Pill],
  templateUrl: './work-order-toolbar.html',
  styleUrl: './work-order-toolbar.scss',
})
export class WorkOrderToolbar {
  @Input() order!: WorkOrderDocument;
  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
}
