import { createCustomElement, NgElement } from '@angular/elements';
import {
  NgModule,
  Injector,
  provideExperimentalZonelessChangeDetection,
  DoBootstrap,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigUiComponent } from './rewrite-it-ui/config-ui.component';

@NgModule({
  imports: [BrowserModule, ConfigUiComponent],
  providers: [provideExperimentalZonelessChangeDetection()],
})
export class RewriteItUIModule implements DoBootstrap {
  constructor(injector: Injector) {
    const configUiElement = createCustomElement(ConfigUiComponent, {
      injector,
    });
    customElements.define('rewrite-it-config-ui', configUiElement);
  }

  ngDoBootstrap() {
    console.log('rewrite-it-ui: bootstrapped');
  }
}

export interface RewriteItConfigUIElement extends NgElement {
  config: Record<string, unknown>;
}
