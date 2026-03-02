import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

type Timescale = 'day' | 'week' | 'month';

@Component({
  selector: 'app-timeline-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './timeline-header.html',
  styleUrl: './timeline-header.scss',
})
export class TimelineHeader {
  @Output() timescaleChange = new EventEmitter<Timescale>();
  @Output() scrollToToday = new EventEmitter<void>();

  timescaleOptions: Timescale[] = ['day', 'week', 'month'];

  timescaleControl = new FormControl<Timescale>('month', { nonNullable: true });

  todayLabel = 'Current Month';

  constructor() {
    this.timescaleControl.valueChanges.subscribe((value: Timescale) => {
      this.timescaleChange.emit(value);
      switch (value) {
        case 'day':
          this.todayLabel = 'Today';
          break;
        case 'week':
          this.todayLabel = 'Current Week';
          break;
        case 'month':
          this.todayLabel = 'Current Month';
          break;
      }
    });
  }
}
