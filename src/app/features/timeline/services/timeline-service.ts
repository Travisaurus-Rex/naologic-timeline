import { Injectable, signal } from '@angular/core';
import { WORK_CENTERS, WORK_ORDERS } from '../../../data/data';
import { WorkOrderDocument, WorkOrderData } from '../../../models/work-order';
import { WorkCenterDocument } from '../../../models/work-center';
import { LocalStoragePersistenceService } from '../../../services/local-storage-service';

@Injectable()
export class TimelineService {
  constructor(private persistence: LocalStoragePersistenceService) {
    const stored = this.persistence.load();
    this._workOrders.set(stored);
  }

  private readonly _workCenters = signal<WorkCenterDocument[]>([...WORK_CENTERS]);
  private readonly _workOrders = signal<WorkOrderDocument[]>([]);

  readonly workCenters = this._workCenters.asReadonly();
  readonly workOrders = this._workOrders.asReadonly();

  create(order: WorkOrderDocument): void {
    this._workOrders.update((orders) => {
      const updated = [...orders, order];
      this.persistence.save(updated);
      return updated;
    });
  }

  update(updated: WorkOrderDocument): void {
    this._workOrders.update((orders) => {
      const next = orders.map((o) => (o.docId === updated.docId ? updated : o));
      this.persistence.save(next);
      return next;
    });
  }

  delete(docId: string): void {
    this._workOrders.update((orders) => {
      const next = orders.filter((o) => o.docId !== docId);
      this.persistence.save(next);
      return next;
    });
  }

  hasConflict(
    workCenterId: string,
    startDate: Date,
    endDate: Date,
    excludeDocId?: string,
  ): boolean {
    return this._workOrders().some((order) => {
      if (order.data.workCenterId !== workCenterId) return false;
      if (excludeDocId && order.docId === excludeDocId) return false;

      const existingStart = new Date(order.data.startDate);
      const existingEnd = new Date(order.data.endDate);

      return startDate < existingEnd && endDate > existingStart;
    });
  }

  buildDocument(data: WorkOrderData, existingDocId?: string): WorkOrderDocument {
    return {
      docId: existingDocId ?? crypto.randomUUID(),
      docType: 'workOrder',
      data,
    };
  }
}
