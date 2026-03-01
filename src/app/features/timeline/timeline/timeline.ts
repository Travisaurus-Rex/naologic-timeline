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

  columnWidth = signal(150);

  // ===== DERIVED TIMELINE =====

  timelineStart = computed(() => calculateTimelineStart(this.workOrders()));

  timelineEnd = computed(() => calculateTimelineEnd(this.workOrders()));

  columns = computed(() => buildColumns(this.timelineStart(), this.timelineEnd()));

  barPositions = computed(() =>
    calculateBarPositions(this.workOrders(), this.timelineStart(), this.columnWidth()),
  );

  // ===== INTERACTION STATE =====

  hoveredWorkCenterId = signal<string | null>(null);
  hoveredDate = signal<Date | null>(null);
  ghostLeft = signal<number>(-9999);

  // ===== PANEL STATE =====

  panelOpen = signal(false);
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
    const workCenterId = this.activeWorkCenterId;
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

  onGridMouseLeave() {
    this.hoveredDate.set(null);
  }

  onGridMouseMove(event: MouseEvent, workCenterId: string): void {
    const rightPanel = event.currentTarget as HTMLElement;
    const container = rightPanel.closest('.right-panel') as HTMLElement;

    const panelRect = container.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;

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

  // ===== CRUD =====

  private createOrder(order: WorkOrderDocument): void {
    this.workOrders.update((orders) => [...orders, order]);
  }

  private updateOrder(updated: WorkOrderDocument): void {
    this.workOrders.update((orders) =>
      orders.map((o) => (o.docId === updated.docId ? updated : o)),
    );
  }
}
