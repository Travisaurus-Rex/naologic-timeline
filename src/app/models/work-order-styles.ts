// models/work-order-styles.ts
import { WorkOrderStatus } from './work-order';

export const BAR_STYLES: Record<WorkOrderStatus, any> = {
  open: {
    boxShadow: 'none',
    borderRadius: '8px',
    backgroundColor: '#CEFBFF',
  },
  'in-progress': {
    boxShadow: '0 0 0 1px rgba(222, 224, 255, 1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(237, 238, 255, 1)',
  },
  complete: {
    boxShadow: '0 0 0 1px rgba(209, 250, 179, 1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(248, 255, 243, 1)',
  },
  blocked: {
    boxShadow: '0 0 0 1px rgba(255, 245, 207, 1)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 252, 241, 1)',
  },
};

export const PILL_STYLES: Record<WorkOrderStatus, any> = {
  open: {
    color: '#00B0BF',
    borderRadius: '5px',
    backgroundColor: '#CEFBFF',
  },
  'in-progress': {
    color: '#3E40DB',
    borderRadius: '5px',
    backgroundColor: '#D6D8FF',
  },
  complete: {
    color: '#08A268',
    borderRadius: '5px',
    backgroundColor: '#E1FFCC',
  },
  blocked: {
    color: '#B13600',
    borderRadius: '5px',
    backgroundColor: '#FCEEB5',
  },
};
