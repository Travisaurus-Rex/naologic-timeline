import { WorkCenterDocument } from '../models/work-center';
import { WorkOrderDocument } from '../models/work-order';

export const WORK_CENTERS: WorkCenterDocument[] = [
  { docId: 'wc-1', docType: 'workCenter', data: { name: 'Extrusion Line A' } },
  { docId: 'wc-2', docType: 'workCenter', data: { name: 'CNC Machine 1' } },
  { docId: 'wc-3', docType: 'workCenter', data: { name: 'Assembly Station' } },
  { docId: 'wc-4', docType: 'workCenter', data: { name: 'Quality Control' } },
  { docId: 'wc-5', docType: 'workCenter', data: { name: 'Packaging Line' } },
  { docId: 'wc-6', docType: 'workCenter', data: { name: 'Welding Bay 1' } },
  { docId: 'wc-7', docType: 'workCenter', data: { name: 'Paint Booth A' } },
  { docId: 'wc-8', docType: 'workCenter', data: { name: 'Stamping Press 3' } },
  { docId: 'wc-9', docType: 'workCenter', data: { name: 'Injection Mold B' } },
  { docId: 'wc-10', docType: 'workCenter', data: { name: 'Heat Treatment' } },
  { docId: 'wc-11', docType: 'workCenter', data: { name: 'Laser Cutting' } },
  { docId: 'wc-12', docType: 'workCenter', data: { name: 'Surface Grinding' } },
  { docId: 'wc-13', docType: 'workCenter', data: { name: 'Anodizing Line' } },
  { docId: 'wc-14', docType: 'workCenter', data: { name: 'Final Assembly' } },
  { docId: 'wc-15', docType: 'workCenter', data: { name: 'PCB Assembly' } },
  { docId: 'wc-16', docType: 'workCenter', data: { name: 'Wire Harness' } },
  { docId: 'wc-17', docType: 'workCenter', data: { name: 'Hydraulic Press' } },
  { docId: 'wc-18', docType: 'workCenter', data: { name: 'Robotic Arm Cell' } },
  { docId: 'wc-19', docType: 'workCenter', data: { name: 'Calibration Lab' } },
  { docId: 'wc-20', docType: 'workCenter', data: { name: 'Shipping Dock' } },
];

const statuses: Array<'open' | 'in-progress' | 'complete' | 'blocked'> = [
  'open',
  'in-progress',
  'complete',
  'blocked',
];

const names = [
  'Aluminum Housing Batch',
  'PVC Pipe Run',
  'Gear Shaft Milling',
  'Precision Bracket Run',
  'Motor Assembly Lot',
  'Inspection Cycle',
  'Final QA Audit',
  'Retail Packaging Batch',
  'Steel Frame Weld',
  'Paint Coat Run',
  'Stamp Die Cut',
  'Mold Inject Cycle',
  'Heat Treat Lot',
  'Laser Cut Sheet',
  'Surface Grind Run',
  'Anodize Batch',
  'PCB Solder Run',
  'Wire Loom Lot',
  'Hydraulic Press Run',
  'Calibration Cycle',
];

const allOrders: WorkOrderDocument[] = [];
let id = 1;

for (let wc = 1; wc <= 20; wc++) {
  const numOrders = 3 + Math.floor(Math.random() * 4);
  let currentDay = Math.floor(Math.random() * 30);

  for (let o = 0; o < numOrders; o++) {
    const duration = 14 + Math.floor(Math.random() * 166); // 2 weeks to 6 months
    const gap = 7 + Math.floor(Math.random() * 30);
    const startDate = new Date(2026, 0, 1 + currentDay);
    const endDate = new Date(2026, 0, 1 + currentDay + duration);

    allOrders.push({
      docId: `wo-${id}`,
      docType: 'workOrder',
      data: {
        name: `${names[id % names.length]} ${id}`,
        workCenterId: `wc-${wc}`,
        status: statuses[Math.floor(Math.random() * 4)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      },
    });

    currentDay += duration + gap;
    id++;
  }
}

export const WORK_ORDERS = allOrders;
