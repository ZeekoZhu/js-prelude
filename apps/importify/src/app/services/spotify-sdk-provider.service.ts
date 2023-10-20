import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

@Injectable({
  providedIn: 'root',
})
export class SpotifySdkProviderService {
  public sdk: SpotifyApi;

  constructor() {
    this.sdk = SpotifyApi.withUserAuthorization(
      environment.clientId,
      environment.redirectUrl,
      [
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-modify-public',
      ],
    );
  }
}
