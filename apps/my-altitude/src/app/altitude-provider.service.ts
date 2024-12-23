import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AltitudeProviderService {
  httpClient = inject(HttpClient);

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      console.log('getCurrentPosition');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('getCurrentPosition', position);
          resolve(position);
        },
        (err) => {
          reject(err);
        },
        {
          enableHighAccuracy: true,
        },
      );
    });
  }

  getAltitude(lat: number, lon: number) {
    return firstValueFrom(
      this.httpClient.get<OpenTopoDataAltitudeApiResult>(
        `https://api.opentopodata.org/v1/mapzen?locations=${lat},${lon}`,
      ),
    );
  }
}

export interface OpenTopoDataAltitudeApiResult {
  results: {
    dataset: 'mapzen';
    elevation: number;
    location: {
      lat: number;
      lng: number;
    };
  }[];
  status: 'OK';
}

export interface Position {
  latitude: number;
  longitude: number;
  altitude: number | null;
}
