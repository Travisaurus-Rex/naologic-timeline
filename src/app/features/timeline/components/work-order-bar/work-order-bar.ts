import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument } from '../../../../models/work-order';
import { NgStyle } from '@angular/common';
import { BarStylePipe } from '../../../../core/pipes/status-style';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [NgStyle, Pill, BarStylePipe],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
  @Input() order!: WorkOrderDocument;
  @Input() left!: number;
  @Input() width!: number;
  @Output() deleted = new EventEmitter<WorkOrderDocument>();
  @Output() edited = new EventEmitter<WorkOrderDocument>();
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<any>;

  constructor() {
    console.log(this.width);
  }

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  onDelete() {
    this.overlayRef?.dispose();
    this.deleted.emit(this.order);
  }

  onEdit() {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.edited.emit(this.order);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      return;
    }

    const btn = event.target as HTMLElement;
    const rect = btn.getBoundingClientRect();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .top(`${rect.bottom + 5}px`)
        .left(`${rect.left}px`),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });

    this.overlayRef.attach(new TemplatePortal(this.dropdownTemplate, this.vcr));
  }
}
