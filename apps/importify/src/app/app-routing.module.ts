import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChoosePlaylistComponent } from './pages/choose-playlist/choose-playlist.component';
import { SpotifySdkProviderService } from './services/spotify-sdk-provider.service';
import { ChooseFileComponent } from './pages/choose-file/choose-file.component';
import { ImportContextService } from './services/import-context.service';
import { ImportFinishedComponent } from './pages/import-finished/import-finished.component';

const canActiveSpotifySdk: CanActivateFn = async () => {
  const sdk = inject(SpotifySdkProviderService).sdk;
  if (await sdk.getAccessToken()) {
    return true;
  }
  await sdk.authenticate();
  return !!(await sdk.getAccessToken());
};

const canChooseFile: CanActivateFn = () => {
  const importCtx = inject(ImportContextService);
  const router = inject(Router);
  if (importCtx.importEntry == null) {
    return router.parseUrl('/welcome');
  }
  return true;
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
  {
    path: 'choose-file',
    component: ChooseFileComponent,
    canActivate: [canChooseFile],
  },
  {
    path: 'import-finished',
    component: ImportFinishedComponent,
    canActivate: [canChooseFile],
  },
  // fallback to welcome page
  {
    path: '**',
    redirectTo: 'welcome',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
