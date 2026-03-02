import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderToolbar } from './work-order-toolbar';

describe('WorkOrderToolbar', () => {
  let component: WorkOrderToolbar;
  let fixture: ComponentFixture<WorkOrderToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkOrderToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
