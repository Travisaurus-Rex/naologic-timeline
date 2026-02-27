import { Component } from '@angular/core';
import { TimelineHeader } from '../components/timeline-header/timeline-header';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline',
  imports: [TimelineHeader, CommonModule],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  workCenters = [
    { docId: '1', data: { name: 'Extrusion Line A' } },
    { docId: '2', data: { name: 'CNC Machine 1' } },
    { docId: '3', data: { name: 'Assembly Station' } },
    { docId: '4', data: { name: 'Quality Control' } },
    { docId: '5', data: { name: 'Packaging Line' } },
  ];

  workOrders = [
    {
      docId: 'wo1',
      data: {
        workCenterId: '1',
        dayIndex: 1, // Tue
        duration: 2, // spans 2 columns
        label: 'WO-1001',
      },
    },
    {
      docId: 'wo2',
      data: {
        workCenterId: '3',
        dayIndex: 3, // Thu
        duration: 1,
        label: 'WO-2045',
      },
    },
  ];

  columns = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
