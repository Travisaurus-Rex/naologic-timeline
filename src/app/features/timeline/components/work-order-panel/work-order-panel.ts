import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument, WorkOrderStatus } from '../../../../models/work-order';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusLabelPipe } from '../../../../core/pipes/status-label';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pill, NgSelectModule, StatusLabelPipe],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: WorkOrderDocument | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    status: new FormControl<WorkOrderStatus>('open', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });

  get isEdit() {
    return this.mode === 'edit';
  }

  onSave() {
    if (this.form.invalid) return;
    this.saved.emit(this.form.value);
  }
}
