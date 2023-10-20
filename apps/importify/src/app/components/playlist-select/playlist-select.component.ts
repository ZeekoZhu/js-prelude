import { Component, inject, Output } from '@angular/core';
import CurrentUserEndpoints from '@spotify/web-api-ts-sdk/dist/mjs/endpoints/CurrentUserEndpoints';
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';
import {
  combineLatestWith,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RxState } from '@rx-angular/state';
import { RxActionFactory, RxActions } from '@rx-angular/state/actions';
import { SpotifySdkProviderService } from '../../services/spotify-sdk-provider.service';
import {
  AsyncResult,
  delayResult,
  okValues,
  pendingValues,
  toAsyncResult,
} from '../../async-result';

@Component({
  selector: 'zeeko-playlist-select',
  templateUrl: './playlist-select.component.html',
  styleUrls: ['./playlist-select.component.css'],
  providers: [RxState, RxActionFactory],
})
export class PlaylistSelectComponent implements View {
  sdk = inject(SpotifySdkProviderService).sdk;
  actions: RxActions<Actions> = inject(RxActionFactory<Actions>).create();
  state: RxState<State> = inject(RxState<State>);
  vm$: Observable<State> = this.state.select();
  playlist$ = this.state.select('playlist').pipe(okValues);
  isPlaylistPending$ = this.state.select('playlist').pipe(pendingValues);
  filteredPlaylist$: Observable<SimplifiedPlaylist[]> =
    this.actions.searchPlaylist$.pipe(
      startWith(''),
      distinctUntilChanged(),
      combineLatestWith(this.playlist$),
      map(([search, playlist]) => {
        if (search.trim() === '') {
          return playlist;
        }
        return playlist.filter((p) =>
          p.name.toLowerCase().includes(search.trim().toLowerCase()),
        );
      }),
    );
  @Output() selectPlaylist: Observable<SimplifiedPlaylist | undefined> =
    this.state.select('selectedPlaylist');

  constructor() {
    this.state.connect('playlist', loadAllPlaylist(this.sdk.currentUser));
    this.state.connect('selectedPlaylist', this.actions.selectPlaylist$);
  }
}

interface State {
  playlist: AsyncResult<SimplifiedPlaylist[], unknown>;
  selectedPlaylist?: SimplifiedPlaylist;
}

interface Actions {
  searchPlaylist: string;
  selectPlaylist: SimplifiedPlaylist;
}

interface View {
  actions: RxActions<Actions>;
  vm$: Observable<State>;
  playlist$: Observable<SimplifiedPlaylist[]>;
  filteredPlaylist$: Observable<SimplifiedPlaylist[]>;
}

function loadAllPlaylist(endpoint: CurrentUserEndpoints) {
  // todo: load all playlists from endpoint
  return fromPromise(endpoint.playlists.playlists(50)).pipe(
    map((page) => page.items),
    toAsyncResult,
    delayResult(500),
  );
}
