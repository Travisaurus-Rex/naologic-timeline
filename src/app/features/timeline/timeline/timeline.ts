import { Component } from '@angular/core';
import { TimelineHeader } from '../components/timeline-header/timeline-header';
import { CommonModule } from '@angular/common';
import { WorkOrderBar } from '../components/work-order-bar/work-order-bar';
import { WORK_CENTERS, WORK_ORDERS } from '../../../data/data';
import { computed, signal } from '@angular/core';
import { addDays, differenceInDays, subDays } from 'date-fns';
import { ColHeaderPipe } from '../../../core/pipes/column-header';
import { WorkOrderDocument } from '../../../models/work-order';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, TimelineHeader, WorkOrderBar, ColHeaderPipe],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  workCenters = WORK_CENTERS;
  workOrders = signal<WorkOrderDocument[]>(WORK_ORDERS);

  columnWidth = signal(150);

  timelineStart = computed(() => {
    const dates = this.workOrders().map((o) => new Date(o.data.startDate));
    const earliest = dates.length
      ? new Date(Math.min(...dates.map((d) => d.getTime())))
      : new Date();
    return subDays(earliest, 3);
  });

  timelineEnd = computed(() => {
    const dates = this.workOrders().map((o) => new Date(o.data.endDate));
    const latest = dates.length
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : addDays(new Date(), 60);
    return addDays(latest, 3);
  });

  columns = computed(() => {
    const days = [];
    const current = new Date(this.timelineStart());
    while (current <= this.timelineEnd()) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  });

  barPositions = computed(() => {
    return this.workOrders().map((order: WorkOrderDocument) => ({
      order,
      left:
        differenceInDays(new Date(order.data.startDate), this.timelineStart()) * this.columnWidth(),
      width:
        differenceInDays(new Date(order.data.endDate), new Date(order.data.startDate)) *
        this.columnWidth(),
    }));
  });

  deleteOrder(order: WorkOrderDocument) {
    this.workOrders.update((orders) => orders.filter((o) => o.docId !== order.docId));
  }
}
