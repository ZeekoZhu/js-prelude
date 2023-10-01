import { Component, inject } from '@angular/core';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';

@Component({
  selector: 'zeeko-choose-playlist',
  templateUrl: './choose-playlist.component.html',
  styleUrls: ['./choose-playlist.component.css'],
  providers: [RxState, RxActionFactory],
})
export class ChoosePlaylistComponent {
  state: RxState<State> = inject(RxState);
  actions: RxActions<Actions> = inject(RxActionFactory<Actions>).create();

  constructor() {
    this.state.connect('selectedPlaylist', this.actions.selectPlaylist$);
  }
}

interface State {
  selectedPlaylist?: SimplifiedPlaylist;
}

interface Actions {
  selectPlaylist: SimplifiedPlaylist | undefined;
}
