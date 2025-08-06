import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rewrite-it-config-ui',
  imports: [CommonModule],
  templateUrl: './config-ui.component.html',
  styleUrl: './config-ui.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ConfigUiComponent {
  @Input() config: Record<string, unknown> = {};
  @Output() configChange = new EventEmitter<Record<string, unknown>>();
  @Output() saveClick = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();

  onSave() {
    this.saveClick.emit();
  }

  onCancel() {
    this.cancelClick.emit();
  }

  onConfigChange(newConfig: Record<string, unknown>) {
    this.config = newConfig;
    this.configChange.emit(newConfig);
  }
}
