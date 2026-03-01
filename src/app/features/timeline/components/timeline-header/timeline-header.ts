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

  timescaleOptions: Timescale[] = ['day', 'week', 'month'];

  timescaleControl = new FormControl<Timescale>('day', { nonNullable: true });

  constructor() {
    this.timescaleControl.valueChanges.subscribe((value: Timescale) => {
      this.timescaleChange.emit(value);
    });
  }
}
