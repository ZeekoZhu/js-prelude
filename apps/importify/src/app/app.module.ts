import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ChoosePlaylistComponent } from './pages/choose-playlist/choose-playlist.component';
import { PlaylistSelectComponent } from './components/playlist-select/playlist-select.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RxLet } from '@rx-angular/template/let';
import { RxFor } from '@rx-angular/template/for';
import { ChooseFileComponent } from './pages/choose-file/choose-file.component';
// import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ExportifyLinkComponent } from './components/exportify-link/exportify-link.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RxIf } from '@rx-angular/template/if';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ImportFinishedComponent } from './pages/import-finished/import-finished.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ChoosePlaylistComponent,
    PlaylistSelectComponent,
    ChooseFileComponent,
    ExportifyLinkComponent,
    ImportFinishedComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    MatListModule,
    RxLet,
    RxFor,
    // NgxMatFileInputModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    RxIf,
    MatProgressBarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
