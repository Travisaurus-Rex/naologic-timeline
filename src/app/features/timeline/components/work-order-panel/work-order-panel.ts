import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../../../models/work-order';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusLabelPipe } from '../../../../core/pipes/status-label';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pill, NgSelectModule, StatusLabelPipe],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: WorkOrderDocument | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Omit<WorkOrderData, 'workCenterId'>>();

  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    status: new FormControl<WorkOrderStatus>('open', {
      nonNullable: true,
      validators: Validators.required,
    }),
    startDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
    endDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  ngOnChanges() {
    if (this.mode === 'edit' && this.order) {
      this.form.patchValue({
        name: this.order.data.name,
        status: this.order.data.status,
        startDate: this.order.data.startDate,
        endDate: this.order.data.endDate,
      });
    }

    if (this.mode === 'create') {
      this.form.reset({
        name: '',
        status: 'open',
        startDate: '',
        endDate: '',
      });
    }
  }

  get isEdit() {
    return this.mode === 'edit';
  }

  onSave() {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();
    this.saved.emit(val);
  }
}
