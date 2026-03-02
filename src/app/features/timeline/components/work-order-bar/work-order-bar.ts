import { Pill } from '../../../../core/components/pill/pill';
import { WorkOrderDocument } from '../../../../models/work-order';
import { NgStyle } from '@angular/common';
import { BarStylePipe } from '../../../../core/pipes/status-style';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
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
import { WorkOrderToolbar } from '../work-order-toolbar/work-order-toolbar';

@Component({
  selector: 'app-work-order-bar',
  standalone: true,
  imports: [NgStyle, Pill, BarStylePipe, WorkOrderToolbar],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
})
export class WorkOrderBar {
  @Input() order!: WorkOrderDocument;
  @Input() left!: number;
  @Input() width!: number;
  @Output() deleted = new EventEmitter<WorkOrderDocument>();
  @Output() edited = new EventEmitter<WorkOrderDocument>();
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<void>;
  @ViewChild('toolbarTemplate') toolbarTemplate!: TemplateRef<WorkOrderBar>;
  @ViewChild('confirmTemplate') confirmTemplate!: TemplateRef<void>;
  private confirmRef: OverlayRef | null = null;

  private overlay = inject(Overlay);
  private vcr = inject(ViewContainerRef);
  private menuRef: OverlayRef | null = null;
  private toolbarRef: OverlayRef | null = null;

  get displayMode(): 'full' | 'pill-only' | 'minimal' {
    if (this.width >= 200) return 'full';
    if (this.width >= 90) return 'pill-only';
    return 'minimal';
  }

  // ===== TOOLBAR =====

  private hideDelay: number = 0;

  openToolbar(event: MouseEvent): void {
    clearTimeout(this.hideDelay);
    if (this.displayMode !== 'minimal' || this.toolbarRef) return;
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();

    this.toolbarRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay
        .position()
        .global()
        .top(`${rect.top - 38}px`)
        .left(`${rect.left}px`),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.toolbarRef.attach(new TemplatePortal(this.toolbarTemplate, this.vcr));
  }

  closeToolbar(): void {
    this.hideDelay = setTimeout(() => {
      this.toolbarRef?.dispose();
      this.toolbarRef = null;
    }, 100);
  }

  keepToolbar(): void {
    clearTimeout(this.hideDelay);
  }

  // ===== DROPDOWN MENU =====

  onEdit(): void {
    this.menuRef?.dispose();
    this.menuRef = null;
    this.toolbarRef?.dispose();
    this.toolbarRef = null;
    this.edited.emit(this.order);
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();

    if (this.menuRef) {
      this.menuRef.dispose();
      this.menuRef = null;
      return;
    }

    const btn = event.target as HTMLElement;
    const rect = btn.getBoundingClientRect();

    this.menuRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .top(`${rect.bottom + 5}px`)
        .left(`${rect.left}px`),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.menuRef.backdropClick().subscribe(() => {
      this.menuRef?.dispose();
      this.menuRef = null;
    });

    this.menuRef.attach(new TemplatePortal(this.dropdownTemplate, this.vcr));
  }

  onDelete(): void {
    this.menuRef?.dispose();
    this.menuRef = null;

    this.confirmRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.confirmRef.backdropClick().subscribe(() => {
      this.confirmRef?.dispose();
      this.confirmRef = null;
    });

    this.confirmRef.attach(new TemplatePortal(this.confirmTemplate, this.vcr));
  }

  confirmDelete(): void {
    this.confirmRef?.dispose();
    this.confirmRef = null;
    this.deleted.emit(this.order);
  }

  cancelDelete(): void {
    this.confirmRef?.dispose();
    this.confirmRef = null;
  }
}
