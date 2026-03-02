import { Injectable } from '@angular/core';
import { WorkOrderDocument } from '../models/work-order';
import { WORK_ORDERS } from '../data/data';

const STORAGE_KEY = 'work-orders';

@Injectable({
  providedIn: 'root',
})
export class LocalStoragePersistenceService {
  load(): WorkOrderDocument[] {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      this.seed();
      return [...WORK_ORDERS];
    }

    try {
      const parsed = JSON.parse(raw) as WorkOrderDocument[];
      return parsed ?? [];
    } catch {
      this.seed();
      return [...WORK_ORDERS];
    }
  }

  save(workOrders: WorkOrderDocument[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workOrders));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private seed(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(WORK_ORDERS));
  }
}
