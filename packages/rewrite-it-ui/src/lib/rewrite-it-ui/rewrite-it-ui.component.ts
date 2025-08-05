import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rewrite-it-rewrite-it-ui',
  imports: [CommonModule],
  templateUrl: './rewrite-it-ui.component.html',
  styleUrl: './rewrite-it-ui.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class RewriteItUiComponent {}
