import { BaseDocument } from './base-document';

export interface WorkCenterData {
  name: string;
}

export type WorkCenterDocument = BaseDocument<WorkCenterData> & {
  docType: 'workCenter';
};
