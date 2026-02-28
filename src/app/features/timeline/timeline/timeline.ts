import { Component } from '@angular/core';
import { TimelineHeader } from '../components/timeline-header/timeline-header';
import { CommonModule } from '@angular/common';
import { WorkOrderBar } from '../components/work-order-bar/work-order-bar';
import { WORK_CENTERS, WORK_ORDERS } from '../../../data/data';
import { computed, signal } from '@angular/core';
import { addDays, differenceInDays, subDays } from 'date-fns';
import { ColHeaderPipe } from '../../../core/pipes/column-header';
import { WorkOrderDocument } from '../../../models/work-order';
import { WorkOrderPanel } from '../components/work-order-panel/work-order-panel';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, TimelineHeader, WorkOrderBar, ColHeaderPipe, WorkOrderPanel],
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

  hoveredWorkCenterId = signal<string | null>(null);

  hoveredDate = signal<Date | null>(null);

  ghostLeft = signal<number>(-9999);

  panelOpen = signal(false);
  panelMode = signal<'create' | 'edit'>('create');
  selectedOrder = signal<WorkOrderDocument | null>(null);

  onGridClick() {
    this.panelMode.set('create');
    this.panelOpen.set(true);
  }

  onEditOrder(order: WorkOrderDocument) {
    this.selectedOrder.set(order);
    this.panelMode.set('edit');
    this.panelOpen.set(true);
  }

  onPanelSaved(data: any) {
    this.panelOpen.set(false);
  }

  onGridMouseLeave() {
    this.hoveredDate.set(null);
  }

  onGridMouseMove(event: MouseEvent, workCenterId: string) {
    const rightPanel = event.currentTarget as HTMLElement;
    const panelRect = rightPanel.closest('.right-panel')!.getBoundingClientRect();
    const scrollLeft = rightPanel.closest('.right-panel')!.scrollLeft;

    const xForDate = event.clientX - panelRect.left + scrollLeft;
    const xForGhost = xForDate - 75;

    const maxLeft = (this.columns().length - 1) * this.columnWidth();
    const clampedX = Math.max(0, Math.min(xForGhost, maxLeft));

    const days = Math.floor(xForDate / this.columnWidth());
    const hovered = addDays(this.timelineStart(), days);

    const isOverOrder = this.workOrders().some(
      (o) =>
        o.data.workCenterId === workCenterId &&
        hovered >= new Date(o.data.startDate) &&
        hovered <= new Date(o.data.endDate),
    );

    this.hoveredDate.set(isOverOrder ? null : hovered);
    this.ghostLeft.set(isOverOrder ? -9999 : clampedX);
    this.hoveredWorkCenterId.set(workCenterId);
  }

  deleteOrder(order: WorkOrderDocument) {
    this.workOrders.update((orders) => orders.filter((o) => o.docId !== order.docId));
  }
}
