import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { defer, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IsFullscreenService {
  document = inject(DOCUMENT);

  isFullscreen$ = defer(() =>
    fromEvent(this.document, 'fullscreenchange').pipe(
      map(() => this.document.fullscreenElement != null),
    ),
  );
}
