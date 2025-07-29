import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxState } from '@rx-angular/state';
import { RxIf } from '@rx-angular/template/if';
import { SvgIconComponent } from 'angular-svg-icon';
import { map } from 'rxjs';
import { IsFullscreenService } from './is-fullscreen.service';

@Component({
    selector: 'app-toggle-full-screen-btn',
    imports: [CommonModule, SvgIconComponent, RxIf],
    templateUrl: './toggle-full-screen-btn.component.html'
})
export class ToggleFullScreenBtnComponent {
  document = inject(DOCUMENT);
  isFullscreenService = inject(IsFullscreenService);
  state = rxState<{ isFullscreen: boolean }>(({ set, connect }) => {
    set({ isFullscreen: false });
    connect('isFullscreen', this.isFullscreenService.isFullscreen$);
  });

  showButton$ = this.state.select('isFullscreen').pipe(map((it) => !it));

  async toggleFullScreen() {
    if (document.fullscreenElement) {
      await this.document.exitFullscreen();
    } else {
      await this.document.body.requestFullscreen();
    }
  }
}
