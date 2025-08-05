import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rewrite-it-config-ui',
  imports: [CommonModule],
  templateUrl: './config-ui.component.html',
  styleUrl: './config-ui.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class ConfigUiComponent {}
