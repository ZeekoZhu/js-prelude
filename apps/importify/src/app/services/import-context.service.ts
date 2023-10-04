import { Injectable } from '@angular/core';
import { SimplifiedPlaylist, SpotifyApi } from '@spotify/web-api-ts-sdk';

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

  addEntry(playlist: SimplifiedPlaylist, tracks: TrackInfo[]) {
    this.importEntry = {
      playlist,
      tracks,
    };
  }
}
