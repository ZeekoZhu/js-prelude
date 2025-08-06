import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RewriteItUIModule } from './lib/rewrite-it-ui.module';

export * from './lib/rewrite-it-ui/config-ui.component';
export type { RewriteItConfigUIElement } from './lib/rewrite-it-ui.module';

export async function bootstrap() {
  // what the fuck
  try {
    await platformBrowserDynamic().bootstrapModule(RewriteItUIModule);
  } catch (err) {
    return console.error(err);
  }
}
