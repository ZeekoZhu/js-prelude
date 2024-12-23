import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RxNotificationKind } from '@rx-angular/cdk/notifications';
import { rxState } from '@rx-angular/state';
import { RxIf } from '@rx-angular/template/if';
import { SvgIconComponent } from 'angular-svg-icon';
import { catchError, exhaustMap, map, of, startWith, Subject } from 'rxjs';
import { AltitudeProviderService } from './altitude-provider.service';

@Component({
  selector: 'app-altitude-view',
  standalone: true,
  imports: [CommonModule, SvgIconComponent, RxIf],
  templateUrl: './altitude-view.component.html',
  styleUrl: './altitude-view.component.css',
})
export class AltitudeViewComponent {
  altitudeProvider = inject(AltitudeProviderService);
  state = rxState<{ position: GeolocationPosition | null }>();

  latitude$ = this.state
    .select('position')
    .pipe(map((it) => formatLatitude(it?.coords.latitude)));
  longitude$ = this.state
    .select('position')
    .pipe(map((it) => formatLongitude(it?.coords.longitude)));
  altitude$ = this.state
    .select('position')
    .pipe(map((it) => formatMeasure(it?.coords.altitude, 'm') ?? '无法定位'));
  isGPSTooWeak$ = this.state
    .select('position')
    .pipe(map((it) => it?.coords.accuracy == null || it.coords.accuracy > 100));

  $refresh = new Subject<void>();
  locating$ = new Subject<RxNotificationKind>();

  constructor() {
    this.state.connect(
      'position',
      this.$refresh.pipe(
        exhaustMap(async () => {
          console.log('locating');
          this.locating$.next(RxNotificationKind.Suspense);
          const r = await this.altitudeProvider.getCurrentPosition();
          this.locating$.next(RxNotificationKind.Next);
          return r;
        }),
        catchError(() => {
          this.locating$.next(RxNotificationKind.Error);
          return of(null);
        }),
      ),
    );
    this.refresh();
  }

  refresh() {
    this.$refresh.next();
  }
}

function formatMeasure(
  value: number | null | undefined,
  unit = '',
): string | undefined | null {
  if (value == null) {
    return value;
  }
  return `${value.toFixed(2)}${unit}`;
}

function formatLatitude(value?: number): string | undefined {
  if (value == null) {
    return value;
  }
  if (value > 0) {
    return `N ${formatMeasure(value, '°')}`;
  }
  return `S ${formatMeasure(-value, '°')}`;
}

function formatLongitude(value?: number): string | undefined {
  if (value == null) {
    return value;
  }
  if (value > 0) {
    return `E ${formatMeasure(value, '°')}`;
  }
  return `W ${formatMeasure(-value, '°')}`;
}
