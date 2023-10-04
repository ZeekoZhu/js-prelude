import { Component, inject } from '@angular/core';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';
import { ImportContextService } from '../../services/import-context.service';

@Component({
  selector: 'zeeko-choose-playlist',
  templateUrl: './choose-playlist.component.html',
  styleUrls: ['./choose-playlist.component.css'],
  providers: [RxState, RxActionFactory],
})
export class ChoosePlaylistComponent {
  state: RxState<State> = inject(RxState);
  actions: RxActions<Actions> = inject(RxActionFactory<Actions>).create();
  importCtx = inject(ImportContextService);

  constructor() {
    this.state.connect('selectedPlaylist', this.actions.selectPlaylist$);
    this.state.hold(this.actions.selectPlaylist$, (playlist) => {
      if (!playlist) return;
      this.importCtx.addEntry(playlist, []);
    });
  }
}

interface State {
  selectedPlaylist?: SimplifiedPlaylist;
}

interface Actions {
  selectPlaylist: SimplifiedPlaylist | undefined;
}
