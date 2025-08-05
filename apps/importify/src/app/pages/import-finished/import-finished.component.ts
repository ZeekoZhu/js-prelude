import { Component, inject } from '@angular/core';
import { ImportContextService } from '../../services/import-context.service';

@Component({
  selector: 'zeeko-import-finished',
  templateUrl: './import-finished.component.html',
  styleUrls: ['./import-finished.component.css'],
  standalone: false,
})
export class ImportFinishedComponent {
  importCtx = inject(ImportContextService);

  get tracksCount() {
    return this.importCtx.importEntry?.tracks.length ?? 0;
  }
}
