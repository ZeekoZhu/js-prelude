import {
  Component,
  ViewEncapsulation,
  model,
  output,
  computed,
  signal,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as yaml from 'js-yaml';

@Component({
  selector: 'rewrite-it-config-ui',
  imports: [CommonModule],
  templateUrl: './config-ui.component.html',
  styleUrl: './config-ui.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ConfigUiComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('yamlTextarea') textarea!: ElementRef<HTMLTextAreaElement>;

  config = model.required<Record<string, unknown>>();
  saveClick = output<void>();
  cancelClick = output<void>();

  parseError = signal<string>('');

  yamlString = computed(() => {
    try {
      return yaml.dump(this.config());
    } catch (error) {
      return '';
    }
  });

  ngAfterViewInit() {
    this.dialog.nativeElement.showModal();
  }

  onSave() {
    if (!this.parseError()) {
      this.saveClick.emit();
      this.dialog.nativeElement.close();
    }
  }

  onCancel() {
    this.cancelClick.emit();
    this.dialog.nativeElement.close();
  }

  onYamlChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    const yamlContent = textarea.value;

    try {
      const parsedConfig = yaml.load(yamlContent) as Record<string, unknown>;
      if (parsedConfig && typeof parsedConfig === 'object') {
        this.config.set(parsedConfig);
        this.parseError.set('');
      } else {
        this.parseError.set('Invalid YAML configuration format');
      }
    } catch (error) {
      this.parseError.set(
        error instanceof Error ? error.message : 'Invalid YAML syntax',
      );
    }
  }
}
