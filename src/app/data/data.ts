import { WorkCenterDocument } from '../models/work-center';
import { WorkOrderDocument } from '../models/work-order';

export const WORK_CENTERS: WorkCenterDocument[] = [
  {
    docId: 'wc-1',
    docType: 'workCenter',
    data: { name: 'Extrusion Line A' },
  },
  {
    docId: 'wc-2',
    docType: 'workCenter',
    data: { name: 'CNC Machine 1' },
  },
  {
    docId: 'wc-3',
    docType: 'workCenter',
    data: { name: 'Assembly Station' },
  },
  {
    docId: 'wc-4',
    docType: 'workCenter',
    data: { name: 'Quality Control' },
  },
  {
    docId: 'wc-5',
    docType: 'workCenter',
    data: { name: 'Packaging Line' },
  },
];

export const WORK_ORDERS: WorkOrderDocument[] = [
  {
    docId: 'wo-1',
    docType: 'workOrder',
    data: {
      name: 'Aluminum Housing Batch 42',
      workCenterId: 'wc-1',
      status: 'complete',
      startDate: '2026-02-01',
      endDate: '2026-02-05',
    },
  },
  {
    docId: 'wo-2',
    docType: 'workOrder',
    data: {
      name: 'PVC Pipe Run 18',
      workCenterId: 'wc-1',
      status: 'in-progress',
      startDate: '2026-02-08',
      endDate: '2026-02-14',
    },
  },
  {
    docId: 'wo-3',
    docType: 'workOrder',
    data: {
      name: 'Gear Shaft Milling',
      workCenterId: 'wc-2',
      status: 'open',
      startDate: '2026-02-03',
      endDate: '2026-02-10',
    },
  },
  {
    docId: 'wo-4',
    docType: 'workOrder',
    data: {
      name: 'Precision Bracket Run',
      workCenterId: 'wc-2',
      status: 'blocked',
      startDate: '2026-02-15',
      endDate: '2026-02-20',
    },
  },
  {
    docId: 'wo-5',
    docType: 'workOrder',
    data: {
      name: 'Motor Assembly Lot A',
      workCenterId: 'wc-3',
      status: 'in-progress',
      startDate: '2026-01-28',
      endDate: '2026-02-06',
    },
  },
  {
    docId: 'wo-6',
    docType: 'workOrder',
    data: {
      name: 'Inspection Cycle 204',
      workCenterId: 'wc-4',
      status: 'open',
      startDate: '2026-02-12',
      endDate: '2026-02-16',
    },
  },
  {
    docId: 'wo-7',
    docType: 'workOrder',
    data: {
      name: 'Final QA Audit',
      workCenterId: 'wc-4',
      status: 'complete',
      startDate: '2026-02-18',
      endDate: '2026-02-22',
    },
  },
  {
    docId: 'wo-8',
    docType: 'workOrder',
    data: {
      name: 'Retail Packaging Batch 9',
      workCenterId: 'wc-5',
      status: 'blocked',
      startDate: '2026-02-05',
      endDate: '2026-02-11',
    },
  },
];
