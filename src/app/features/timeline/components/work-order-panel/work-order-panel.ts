import { Component, Input, Output, EventEmitter, OnChanges, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderData, WorkOrderDocument, WorkOrderStatus } from '../../../../models/work-order';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusLabelPipe } from '../../../../core/pipes/status-label';
import { TimelineService } from '../../services/timeline-service';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Pill, NgSelectModule, StatusLabelPipe],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel implements OnInit, OnChanges {
  isVisible: boolean = false;
  @Input() workCenterId!: string;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() startDate?: Date;
  @Input() order: WorkOrderDocument | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Omit<WorkOrderData, 'workCenterId'>>();

  ngOnInit(): void {
    requestAnimationFrame(() => (this.isVisible = true));
  }

  service = inject(TimelineService);
  statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    status: new FormControl<WorkOrderStatus>('open', {
      nonNullable: true,
      validators: Validators.required,
    }),
    startDate: new FormControl(this.toInputDate(this.startDate), {
      nonNullable: true,
      validators: Validators.required,
    }),
    endDate: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.order) {
      this.form.patchValue({
        name: this.order.data.name,
        status: this.order.data.status,
        startDate: this.toInputDate(this.order.data.startDate),
        endDate: this.order.data.endDate,
      });
    }

    if (this.mode === 'create') {
      this.form.reset({
        name: '',
        status: 'open',
        startDate: this.toInputDate(this.startDate),
        endDate: '',
      });
    }
  }

  get isEdit() {
    return this.mode === 'edit';
  }

  onSave(): void {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();

    const start = new Date(val.startDate);
    const end = new Date(val.endDate);

    if (start >= end) {
      this.form.setErrors({ dateRange: true });
      return;
    }

    if (!this.workCenterId) return;

    const conflict = this.service.hasConflict(this.workCenterId, start, end, this.order?.docId);

    if (conflict) {
      this.form.setErrors({ dateConflict: true });
      return;
    }

    this.saved.emit(val);
  }

  onClose(): void {
    this.isVisible = false;
    setTimeout(() => this.closed.emit(), 300);
  }

  toInputDate(date?: Date | string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }
}
