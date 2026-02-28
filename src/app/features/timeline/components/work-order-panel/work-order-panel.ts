import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument, WorkOrderStatus } from '../../../../models/work-order';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusLabelPipe } from '../../../../core/pipes/status-label';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-work-order-panel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Pill,
    NgSelectModule,
    StatusLabelPipe,
    NgbDatepickerModule,
  ],
  templateUrl: './work-order-panel.html',
  styleUrl: './work-order-panel.scss',
})
export class WorkOrderPanel implements OnChanges {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() order: WorkOrderDocument | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();

  ngOnChanges() {
    if (this.mode === 'edit' && this.order) {
      this.form.patchValue({
        name: this.order.data.name,
        status: this.order.data.status,
        startDate: this.toNgbDate(this.order.data.startDate) as any,
        endDate: this.toNgbDate(this.order.data.endDate) as any,
      });
    }
  }

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
    const val = this.form.value;
    this.saved.emit({
      ...val,
      startDate: this.fromNgbDate(val.startDate as any),
      endDate: this.fromNgbDate(val.endDate as any),
    });
  }

  toNgbDate(dateStr: string) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }

  fromNgbDate(date: { year: number; month: number; day: number }): string {
    if (!date) return '';
    const month = String(date.month).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${date.year}-${month}-${day}`;
  }
}
