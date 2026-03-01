import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDays } from 'date-fns';

import { TimelineHeader } from '../components/timeline-header/timeline-header';
import { WorkOrderBar } from '../components/work-order-bar/work-order-bar';
import { WorkOrderPanel } from '../components/work-order-panel/work-order-panel';

import { WORK_CENTERS, WORK_ORDERS } from '../../../data/data';
import { ColHeaderPipe } from '../../../core/pipes/column-header';
import { WorkOrderData, WorkOrderDocument } from '../../../models/work-order';
import {
  buildColumns,
  calculateBarPositions,
  calculateTimelineEnd,
  calculateTimelineStart,
} from '../utils/timeline.utils';

@Component({
  selector: 'app-timeline',
  imports: [CommonModule, TimelineHeader, WorkOrderBar, ColHeaderPipe, WorkOrderPanel],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  // ===== DATA =====

  workCenters = WORK_CENTERS;
  workOrders = signal<WorkOrderDocument[]>(WORK_ORDERS);

  // ===== CONFIG =====

  timescale = signal<'day' | 'week' | 'month'>('day');

  columnWidth = computed(() => {
    switch (this.timescale()) {
      case 'day':
        return 150;
      case 'week':
        return 400;
      case 'month':
        return 800;
    }
  });

  // ===== DERIVED TIMELINE =====
  timelineStart = computed(() => calculateTimelineStart(this.workOrders(), this.timescale()));

  timelineEnd = computed<Date>(() => calculateTimelineEnd(this.workOrders(), this.timescale()));

  columns = computed<Date[]>(() =>
    buildColumns(this.timelineStart(), this.timelineEnd(), this.timescale()),
  );

  pxPerDay = computed(() => {
    switch (this.timescale()) {
      case 'day':
        return this.columnWidth();
      case 'week':
        return this.columnWidth() / 7;
      case 'month':
        return this.columnWidth() / 30;
    }
  });

  barPositions = computed(() =>
    calculateBarPositions(this.workOrders(), this.timelineStart(), this.pxPerDay()),
  );

  // ===== INTERACTION STATE =====

  hoveredWorkCenterId = signal<string | null>(null);
  hoveredDate = signal<Date | null>(null);
  ghostLeft = signal<number>(-9999);

  // ===== PANEL STATE =====

  panelOpen = signal<boolean>(false);
  panelMode = signal<'create' | 'edit'>('create');
  selectedOrder = signal<WorkOrderDocument | null>(null);

  activeWorkCenterId: string | null = null;

  // ===== INTERACTION HANDLERS =====

  onGridClick(workCenterId: string): void {
    this.activeWorkCenterId = workCenterId;
    this.selectedOrder.set(null);
    this.panelMode.set('create');
    this.panelOpen.set(true);
  }

  onEditOrder(order: WorkOrderDocument): void {
    this.activeWorkCenterId = order.data.workCenterId;
    this.selectedOrder.set(order);
    this.panelMode.set('edit');
    this.panelOpen.set(true);
  }

  onPanelSaved(data: Omit<WorkOrderData, 'workCenterId'>): void {
    const workCenterId: string | null = this.activeWorkCenterId;
    if (!workCenterId) return;

    const fullData: WorkOrderData = {
      ...data,
      workCenterId,
    };

    if (this.panelMode() === 'edit' && this.selectedOrder()) {
      this.updateOrder({
        ...this.selectedOrder()!,
        data: fullData,
      });
    } else {
      this.createOrder({
        docId: crypto.randomUUID(),
        docType: 'workOrder',
        data: fullData,
      });
    }

    this.panelOpen.set(false);
    this.selectedOrder.set(null);
    this.activeWorkCenterId = null;
  }

  onGridMouseLeave(): void {
    this.hoveredDate.set(null);
  }

  onGridMouseMove(event: MouseEvent, workCenterId: string): void {
    const rightPanel = event.currentTarget as HTMLElement;
    const container = rightPanel.closest('.right-panel') as HTMLElement;

    const panelRect: DOMRect = container.getBoundingClientRect();
    const scrollLeft: number = container.scrollLeft;

    const xForDate: number = event.clientX - panelRect.left + scrollLeft;

    const days: number = Math.floor(xForDate / this.pxPerDay());
    const snappedX: number = days * this.pxPerDay();
    const maxLeft: number = (this.columns().length - 1) * this.columnWidth();
    const clampedX: number = Math.max(0, Math.min(snappedX, maxLeft));

    const hovered: Date = addDays(this.timelineStart(), days);

    const isOverOrder: boolean = this.workOrders().some(
      (o: WorkOrderDocument) =>
        o.data.workCenterId === workCenterId &&
        hovered >= new Date(o.data.startDate) &&
        hovered <= new Date(o.data.endDate),
    );

    this.hoveredDate.set(isOverOrder ? null : hovered);
    this.ghostLeft.set(isOverOrder ? -9999 : clampedX);
    this.hoveredWorkCenterId.set(workCenterId);
  }

  deleteOrder(order: WorkOrderDocument): void {
    this.workOrders.update((orders: WorkOrderDocument[]) =>
      orders.filter((o: WorkOrderDocument) => o.docId !== order.docId),
    );
  }

  // ===== CRUD =====

  private createOrder(order: WorkOrderDocument): void {
    this.workOrders.update((orders: WorkOrderDocument[]) => [...orders, order]);
  }

  private updateOrder(updated: WorkOrderDocument): void {
    this.workOrders.update((orders: WorkOrderDocument[]) =>
      orders.map((o: WorkOrderDocument) => (o.docId === updated.docId ? updated : o)),
    );
  }
}
