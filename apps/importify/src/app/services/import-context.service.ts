import { inject, Injectable } from '@angular/core';
import { SimplifiedPlaylist, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { SpotifySdkProviderService } from './spotify-sdk-provider.service';
import { chunk } from 'lodash-es';
import { defer, from, Observable, retry, switchMap, throwError } from 'rxjs';

export interface ImportEntry {
  playlist: SimplifiedPlaylist;
  tracks: TrackInfo[];
}

export interface TrackInfo {
  trackName: string;
  trackUri: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImportContextService {
  importEntry: ImportEntry | null = null;
  sdk = inject(SpotifySdkProviderService).sdk;

  addEntry(playlist: SimplifiedPlaylist, tracks: TrackInfo[]) {
    this.importEntry = {
      playlist,
      tracks,
    };
  }

  importTracks() {
    if (!this.importEntry) {
      return throwError(() => 'No import entry');
    }
    if (this.importEntry.tracks.length === 0) {
      return throwError(() => 'No tracks to import');
    }
    const playlistId = this.importEntry.playlist.id;
    const chunks = chunk(this.importEntry.tracks.map(it => it.trackUri),
      TRACKS_PER_REQUEST);
    return from(chunks).pipe(
      switchMap(chunk => addTracksToPlaylist(playlistId, chunk, this.sdk)),
    );
  }
}

const TRACKS_PER_REQUEST = 100;

function addTracksToPlaylist(playlistId: string,
                             tracks: string[],
                             sdk: SpotifyApi): Observable<void> {
  return defer(() => sdk.playlists.addItemsToPlaylist(playlistId, tracks)).pipe(
    retry(3),
  );
}
