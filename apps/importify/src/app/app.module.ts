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

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ChoosePlaylistComponent,
    PlaylistSelectComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
