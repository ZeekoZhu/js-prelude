import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChoosePlaylistComponent } from './pages/choose-playlist/choose-playlist.component';
import { SpotifySdkProviderService } from './services/spotify-sdk-provider.service';

const canActiveSpotifySdk: CanActivateFn = async () => {
  const sdk = inject(SpotifySdkProviderService).sdk;
  if (await sdk.getAccessToken()) {
    return true;
  }
  await sdk.authenticate();
  return !!(await sdk.getAccessToken());
};

const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'choose-playlist',
    component: ChoosePlaylistComponent,
    canActivate: [canActiveSpotifySdk],
  },
  // fallback to welcome page
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
