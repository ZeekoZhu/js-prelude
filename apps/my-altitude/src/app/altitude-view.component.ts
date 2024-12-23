import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { exhaustMap, map, shareReplay, Subject } from 'rxjs';
import { AltitudeProviderService } from './altitude-provider.service';

@Component({
  selector: 'app-altitude-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './altitude-view.component.html',
  styleUrl: './altitude-view.component.css',
})
export class AltitudeViewComponent {
  altitudeProvider = inject(AltitudeProviderService);

  $refresh = new Subject<void>();
  position$ = this.$refresh.pipe(
    exhaustMap(() => this.altitudeProvider.getCurrentPosition()),
    shareReplay(1),
  );

  latitude = toSignal(
    this.position$.pipe(map((it) => formatLatitude(it.latitude))),
    { initialValue: '测量中...' },
  );

  longitude = toSignal(
    this.position$.pipe(map((it) => formatLongitude(it.longitude))),
    { initialValue: '测量中...' },
  );

  altitude = toSignal(
    this.position$.pipe(map((it) => formatMeasure(it.altitude, 'm'))),
    { initialValue: '测量中...' },
  );

  constructor() {
    this.$refresh.next();
  }

  refresh() {
    this.$refresh.next();
  }
}

function formatMeasure(value: number | null, unit = ''): string {
  if (!value) {
    return '测量中...';
  }
  return `${value.toFixed(2)}${unit}`;
}

function formatLatitude(value: number): string {
  if (!value) {
    return '测量中...';
  }
  if (value > 0) {
    return `N ${formatMeasure(value, '°')}`;
  }
  return `S ${formatMeasure(-value, '°')}`;
}

function formatLongitude(value: number): string {
  if (!value) {
    return '测量中...';
  }
  if (value > 0) {
    return `E ${formatMeasure(value, '°')}`;
  }
  return `W ${formatMeasure(-value, '°')}`;
}
