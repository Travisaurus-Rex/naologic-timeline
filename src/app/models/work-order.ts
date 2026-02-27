import { BaseDocument } from './base-document';

export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export interface WorkOrderData {
  name: string;
  workCenterId: string;
  status: WorkOrderStatus;
  startDate: string;
  endDate: string;
}

export type WorkOrderDocument = BaseDocument<WorkOrderData> & {
  docType: 'workOrder';
};
