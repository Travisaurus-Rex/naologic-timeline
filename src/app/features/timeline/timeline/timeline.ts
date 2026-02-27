import { Component } from '@angular/core';
import { TimelineHeader } from '../components/timeline-header/timeline-header';
import { CommonModule } from '@angular/common';
import { WorkOrderBar } from '../components/work-order-bar/work-order-bar';
import { WORK_CENTERS, WORK_ORDERS } from '../../../data/data';
import { computed, signal } from '@angular/core';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, TimelineHeader, WorkOrderBar],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  workCenters = WORK_CENTERS;
  workOrders = WORK_ORDERS;

  columnWidth = signal(150);

  timelineStart = computed(() => {
    const dates = this.workOrders.map((o) => new Date(o.data.startDate));
    return new Date(Math.min(...dates.map((d) => d.getTime())));
  });

  barPositions = computed(() => {
    return this.workOrders.map((order) => ({
      order,
      left:
        differenceInDays(new Date(order.data.startDate), this.timelineStart()) * this.columnWidth(),
      width:
        differenceInDays(new Date(order.data.endDate), new Date(order.data.startDate)) *
        this.columnWidth(),
    }));
  });

  columns = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
