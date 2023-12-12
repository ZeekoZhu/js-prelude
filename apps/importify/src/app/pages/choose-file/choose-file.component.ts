import { Component, inject, ViewChild } from '@angular/core';

import { ImportContextService } from '../../services/import-context.service';
import { RxState } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { combineLatestWith, map, of, switchMap } from 'rxjs';
import Papa from 'papaparse';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  AsyncResult,
  delayResult,
  err,
  isPending,
  ok,
  toAsyncResult,
  untilOk,
} from '../../async-result';
import { Router } from '@angular/router';

@Component({
  selector: 'zeeko-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.css'],
  providers: [RxState, RxActionFactory],
})
export class ChooseFileComponent {
  state: RxState<State> = inject(RxState);
  actions = inject<RxActionFactory<Actions>>(RxActionFactory<Actions>).create(
    {},
  );
  importCtx = inject(ImportContextService);
  displayedColumns = ['trackName', 'trackUri'];
  fileInputControl = new FormControl<File | null>(null);
  datasource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set paginator(
    paginator: MatPaginator,
  ) {
    this.datasource.paginator = paginator;
  }

  emptyTracks$ = this.state
    .select('tracks')
    .pipe(map((tracks) => tracks.length === 0));
  showTable$ = this.emptyTracks$.pipe(map((empty) => !empty));

  get playlist() {
    return this.importCtx.importEntry?.playlist;
  }

  showProgress$ = this.state.select('importTask').pipe(map(isPending));
  disableImportBtn$ = this.showTable$.pipe(
    combineLatestWith(this.showProgress$),
    map(([showTable, isPending]) => !showTable || isPending),
  );

  constructor() {
    const router = inject(Router);
    this.state.set({ tracks: [], importTask: ok(undefined) });

    // tracks file selection
    this.state.connect(
      'tracks',
      this.actions.selectFile$.pipe(
        switchMap((file) => (file ? parseTracks(file) : [])),
      ),
    );
    this.state.hold(this.fileInputControl.valueChanges, (file) => {
      if (file) {
        this.actions.selectFile(file);
      }
    });
    this.state.hold(this.state.select('tracks'), (tracks) => {
      this.datasource.data = tracks;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.importCtx.importEntry!.tracks = tracks;
    });

    // import tracks
    this.state.connect(
      'importTask',
      this.actions.importTracks$.pipe(switchMap(() => this.importTracks())),
    );
    this.state.hold(
      this.state.select('importTask').pipe(
        untilOk,
        switchMap(() => router.navigate(['/import-finished'])),
      ),
    );
  }

  private importTracks() {
    const playlistId = this.playlist?.id;
    if (!playlistId) {
      return of(err('no playlist selected'));
    }
    return this.importCtx.importTracks().pipe(toAsyncResult, delayResult(1000));
  }
}

interface State {
  tracks: TrackInfo[];
  importTask: AsyncResult<void, unknown>;
}

interface Actions {
  selectFile: File | null;
  importTracks: void;
}

interface TrackInfo {
  trackUri: string;
  trackName: string;
}

async function parseTracks(file: Blob) {
  // parse "Track URI", "Track Name" columns from file
  const content = await file.text();

  const { data } = Papa.parse(content, { header: true, skipEmptyLines: true });
  return data.map((row) => {
    const item = row as Record<string, string>;
    return {
      trackUri: item['Track URI'],
      trackName: item['Track Name'],
    };
  });
}
